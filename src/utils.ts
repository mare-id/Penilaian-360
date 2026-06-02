import { AppState, Employee, Assignment, Response, Objection, OrgUnit, Job, Period, Weights } from "./types";
import { dimensions, orgUnitCatalog, jobCatalog } from "./data";

export function average(list: number[]): number {
  if (!list.length) return 0;
  return list.reduce((a, b) => a + b, 0) / list.length;
}

export function getCategory(score: number): string {
  if (score >= 90) return "Sangat Baik";
  if (score >= 76) return "Baik";
  if (score >= 61) return "Butuh Perbaikan";
  if (score >= 51) return "Kurang";
  return "Sangat Kurang";
}

export function categoryClass(category: string): string {
  const mapping: Record<string, string> = {
    "Sangat Baik": "bg-emerald-100 text-emerald-700 border-emerald-200",
    Baik: "bg-blue-100 text-blue-700 border-blue-200",
    "Butuh Perbaikan": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Kurang: "bg-orange-100 text-orange-700 border-orange-200",
    "Sangat Kurang": "bg-red-100 text-red-700 border-red-200",
  };
  return mapping[category] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function statusClass(status: string): string {
  const mapping: Record<string, string> = {
    Selesai: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Belum Mulai": "bg-red-100 text-red-700 border-red-200",
    "Sedang Diisi": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Terlambat: "bg-orange-100 text-orange-700 border-orange-200",
    "Tidak Melakukan Penilaian": "bg-red-200 text-red-800 border-red-300",
    "Menunggu Verifikasi": "bg-blue-100 text-blue-700 border-blue-200",
    Disetujui: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Ditolak: "bg-red-100 text-red-700 border-red-200",
    Terkunci: "bg-slate-100 text-slate-700 border-slate-200",
    Diproses: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Diajukan: "bg-blue-100 text-blue-700 border-blue-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return mapping[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function scoreFromResponse(response?: Response, includeLeadership = true): number {
  if (!response) return 0;
  const keys = dimensions.filter((d) => includeLeadership || !d.leadershipOnly).map((d) => d.key);
  return average(keys.map((k) => response.scores[k]).filter((v) => typeof v === "number"));
}

export function calculateResult(employee: Employee, assignments: Assignment[], responses: Response[], period?: Period) {
  const relevant = assignments.filter((a) => a.evalueeId === employee.id && a.approved && (!period || a.periodId === period.id));
  const includeLeadership = ["Struktural", "JPT Pratama", "Administrator", "Pengawas"].includes(employee.jenis) || employee.hasSub;
  const byType: Record<string, number[]> = {};

  relevant.forEach((a) => {
    const response = responses.find((r) => r.assignmentId === a.id);
    if (!response) return;
    byType[a.type] = byType[a.type] || [];
    byType[a.type].push(scoreFromResponse(response, includeLeadership));
  });

  const atasan = average(byType.Atasan || []);
  const peer = average(byType.Peer || []);
  const bawahan = average(byType.Bawahan || []);
  const self = average(byType.Diri || []);

  const defaultWeightsWithSub = { Atasan: 60, Peer: 15, Bawahan: 25 };
  const defaultWeightsNoSub = { Atasan: 60, Peer: 40 };

  const weights = (employee.hasSub
    ? (period?.weightsWithSub || defaultWeightsWithSub)
    : (period?.weightsNoSub || defaultWeightsNoSub)) as Weights;
  let weighted = 0;
  let usedWeight = 0;

  if (atasan) {
    weighted += atasan * weights.Atasan;
    usedWeight += weights.Atasan;
  }
  if (peer) {
    weighted += peer * weights.Peer;
    usedWeight += weights.Peer;
  }
  if (employee.hasSub && bawahan) {
    weighted += bawahan * (weights.Bawahan || 0);
    usedWeight += weights.Bawahan || 0;
  }

  const finalScale = usedWeight ? weighted / usedWeight : 0;
  const final100 = Math.round((finalScale / 5) * 100);

  return {
    atasan: Math.round((atasan / 5) * 100) || 0,
    peer: Math.round((peer / 5) * 100) || 0,
    bawahan: Math.round((bawahan / 5) * 100) || 0,
    self: Math.round((self / 5) * 100) || 0,
    final: final100,
    category: final100 ? getCategory(final100) : "Belum Lengkap",
    completed: relevant.filter((a) => responses.some((r) => r.assignmentId === a.id)).length,
    total: relevant.length,
  };
}

export function dimensionScores(employee: Employee, assignments: Assignment[], responses: Response[], period?: Period) {
  const includeLeadership = ["Struktural", "JPT Pratama", "Administrator", "Pengawas"].includes(employee.jenis) || employee.hasSub;
  return dimensions
    .filter((d) => includeLeadership || !d.leadershipOnly)
    .map((d) => {
      const scores = assignments
        .filter((a) => a.evalueeId === employee.id && a.approved && a.type !== "Diri" && (!period || a.periodId === period.id))
        .map((a) => responses.find((r) => r.assignmentId === a.id)?.scores[d.key])
        .filter((v): v is number => typeof v === "number");
      const score = Math.round((average(scores) / 5) * 100) || 0;
      return { ...d, score };
    });
}

export function unitStats(state: AppState, period?: Period) {
  const activePeriod = period || state.period;
  const activeUnits = (state.orgUnits && state.orgUnits.length > 0 ? state.orgUnits : orgUnitCatalog).map((u) => u.name);
  return activeUnits.map((unit) => {
    const emp = state.employees.filter((e) => e.unit === unit);
    const assignments = state.assignments.filter((a) => emp.some((e) => e.id === a.evalueeId) && (!activePeriod || a.periodId === activePeriod.id));
    const completed = assignments.filter((a) => state.responses.some((r) => r.assignmentId === a.id)).length;
    const pct = Math.round((completed / Math.max(1, assignments.length)) * 100);
    const results = emp.map((e) => calculateResult(e, state.assignments, state.responses, activePeriod).final).filter(Boolean);
    return {
      unit,
      totalAsn: emp.length,
      totalAssignments: assignments.length,
      completed,
      pct,
      avg: Math.round(average(results)) || 0,
      status: pct >= 85 ? "Aman" : pct >= 70 ? "Perlu Perhatian" : "Kritis"
    };
  });
}

export function buildAnomalies(state: AppState, period?: Period) {
  const activePeriod = period || state.period;
  const anomalies: Array<{ id: string; type: string; severity: string; count: number }> = [];
  const byEvaluator: Record<string, Response[]> = {};

  state.responses.forEach((r) => {
    const a = state.assignments.find((x) => x.id === r.assignmentId);
    if (!a) return;
    if (activePeriod && a.periodId !== activePeriod.id) return;
    byEvaluator[a.evaluatorId] = byEvaluator[a.evaluatorId] || [];
    byEvaluator[a.evaluatorId].push(r);
  });

  Object.entries(byEvaluator).forEach(([id, list]) => {
    const allScores = list.flatMap((r) => Object.values(r.scores));
    const allFive = allScores.length > 0 && allScores.every((v) => v >= 4.9);
    const noVariation = allScores.length > 8 && Math.max(...allScores) - Math.min(...allScores) < 0.1;
    if (allFive || noVariation) {
      anomalies.push({
        id,
        type: allFive ? "Semua nilai 5" : "Pola nilai identik",
        severity: allFive ? "Anomali" : "Perlu Perhatian",
        count: list.length
      });
    }
  });

  return anomalies;
}

export function syncMandatoryAssignments(employees: Employee[], currentAssignments: Assignment[], maxBawahan: number = 100): Assignment[] {
  // Update hasSub dynamically based on actual subordinates in the organization tree
  employees.forEach((emp) => {
    emp.hasSub = employees.some((e) => e.atasanId === emp.id);
  });

  // Group subordinates by their direct boss
  const bossSubordinatesMap: Record<number, Employee[]> = {};
  employees.forEach((emp) => {
    if (emp.atasanId !== null) {
      if (!bossSubordinatesMap[emp.atasanId]) {
        bossSubordinatesMap[emp.atasanId] = [];
      }
      bossSubordinatesMap[emp.atasanId].push(emp);
    }
  });

  // For each boss, select at most maxBawahan subordinates based on completion status, then ID (for stable ranking)
  const allowedSubordinatesMap: Record<number, Set<number>> = {};
  Object.entries(bossSubordinatesMap).forEach(([bossIdStr, subs]) => {
    const bossId = Number(bossIdStr);
    const sortedSubs = [...subs].sort((a, b) => {
      const aAss = currentAssignments.find(x => x.evalueeId === bossId && x.evaluatorId === a.id && x.type === "Bawahan");
      const bAss = currentAssignments.find(x => x.evalueeId === bossId && x.evaluatorId === b.id && x.type === "Bawahan");
      
      const aScore = aAss ? (aAss.status === "Selesai" ? 2 : aAss.status === "Sedang Diisi" ? 1 : 0) : 0;
      const bScore = bAss ? (bAss.status === "Selesai" ? 2 : bAss.status === "Sedang Diisi" ? 1 : 0) : 0;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      return a.id - b.id;
    });

    const allowed = sortedSubs.slice(0, maxBawahan);
    allowedSubordinatesMap[bossId] = new Set(allowed.map(x => x.id));
  });

  // Saring assignment apa saja yang masih sah dengan data employees saat ini
  const validAssignments = currentAssignments.filter((a) => {
    const evaluee = employees.find((e) => e.id === a.evalueeId);
    const evaluator = employees.find((e) => e.id === a.evaluatorId);
    
    // Jika salah satu datanya tidak ada, buang
    if (!evaluee || !evaluator) return false;

    // Sesuai tipe kuesioner:
    if (a.type === "Atasan") {
      // Atasan menilai bawahan. Evaluator harus merupakan atasan langsung dari evaluee
      return evaluee.atasanId === evaluator.id;
    }

    if (a.type === "Bawahan") {
      // Bawahan menilai atasan. Evaluator harus mempunyai evaluee sebagai atasan langsungnya
      const isDirectSub = evaluator.atasanId === evaluee.id;
      if (!isDirectSub) return false;

      // Check against current maxBawahan constraint
      const allowedSet = allowedSubordinatesMap[evaluee.id];
      if (allowedSet && !allowedSet.has(evaluator.id)) {
        return false;
      }
      return true;
    }

    if (a.type === "Peer") {
      // Peer rater. Harus berada dalam unit kerja yang sama.
      // Jabatan Fungsional dapat menilai jabatan pelaksana atau sebaliknya.
      return isEligiblePeer(evaluator, evaluee);
    }

    if (a.type === "Diri") {
      return evaluee.id === evaluator.id;
    }

    return true;
  });

  const assignments = [...validAssignments];

  employees.forEach((emp) => {
    // 1. Rule 1: Every subordinate must review their atasan (direct boss)
    if (emp.atasanId !== null) {
      const boss = employees.find((b) => b.id === emp.atasanId);
      if (boss) {
        const allowedSet = allowedSubordinatesMap[boss.id];
        const isAllowed = allowedSet ? allowedSet.has(emp.id) : true;

        if (isAllowed) {
          // Look for existing assignment where boss is evaluated by emp as Bawahan
          const exists = assignments.some(
            (a) => a.evalueeId === boss.id && a.evaluatorId === emp.id && a.type === "Bawahan"
          );
          if (!exists) {
            assignments.push({
              id: 100000 + boss.id * 1000 + emp.id,
              periodId: 1,
              evalueeId: boss.id,
              evaluatorId: emp.id,
              type: "Bawahan",
              status: "Belum Mulai",
              approved: true,
            });
          }
        }

        // 2. Rule 2: Every boss must review their subordinates (Atasan evaluates Bawahan)
        const existsAtasan = assignments.some(
          (a) => a.evalueeId === emp.id && a.evaluatorId === boss.id && a.type === "Atasan"
        );
        if (!existsAtasan) {
          assignments.push({
            id: 300000 + emp.id * 1000 + boss.id,
            periodId: 1,
            evalueeId: emp.id,
            evaluatorId: boss.id,
            type: "Atasan",
            status: "Belum Mulai",
            approved: true,
          });
        }
      }
    }
  });

  return assignments;
}

export function assignmentsEqual(a: Assignment[], b: Assignment[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].evalueeId !== b[i].evalueeId ||
      a[i].evaluatorId !== b[i].evaluatorId ||
      a[i].type !== b[i].type ||
      a[i].approved !== b[i].approved ||
      a[i].status !== b[i].status
    ) {
      return false;
    }
  }
  return true;
}

export function isEligiblePeer(evaluator: Employee, evaluee: Employee): boolean {
  if (evaluator.id === evaluee.id) return false;
  if (evaluator.id === evaluee.atasanId) return false;
  
  // 1. Peer rater hanya yang berada dalam unit kerja yang sama
  if (evaluator.unit !== evaluee.unit) return false;
  
  // 2. Tingkat jabatan setingkat, ATAU Jabatan Fungsional dengan Pelaksana (vice versa)
  const isSameJenis = evaluator.jenis === evaluee.jenis;
  const isFungsionalAndPelaksana = 
    (evaluator.jenis === "Fungsional" && evaluee.jenis === "Pelaksana") ||
    (evaluator.jenis === "Pelaksana" && evaluee.jenis === "Fungsional");
    
  return isSameJenis || isFungsionalAndPelaksana;
}

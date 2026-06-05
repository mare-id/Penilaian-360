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

export function scoreFromResponse(response?: Response, includeLeadership = true, customDimensions?: any[]): number {
  if (!response) return 0;
  const activeDims = customDimensions || dimensions;
  const keys = activeDims.filter((d) => includeLeadership || !d.leadershipOnly).map((d) => d.key);
  return average(keys.map((k) => response.scores[k]).filter((v) => typeof v === "number"));
}

export function getEvaluatorConditionAndWeights(
  hasAtasan: boolean, 
  hasPeer: boolean, 
  hasBawahan: boolean,
  period?: Period
) {
  // Use period configurations as the base if provided, otherwise standard fallbacks
  const defaultWeightsWithSub = { Atasan: 60, Peer: 20, Bawahan: 20 };
  const defaultWeightsNoSub = { Atasan: 60, Peer: 40 };
  const defaultWeightsCond3 = { Atasan: 75, Peer: 0, Bawahan: 25 };
  const defaultWeightsCond4 = { Atasan: 100, Peer: 0, Bawahan: 0 };
  const defaultWeightsCond5 = { Atasan: 0, Peer: 0, Bawahan: 100 };

  const wWithSub = period?.weightsWithSub || defaultWeightsWithSub;
  const wNoSub = period?.weightsNoSub || defaultWeightsNoSub;
  const wCond3 = period?.weightsCond3 || defaultWeightsCond3;
  const wCond4 = period?.weightsCond4 || defaultWeightsCond4;
  const wCond5 = period?.weightsCond5 || defaultWeightsCond5;

  // 1. Kondisi Ada Atasan, Ada Sejawat, Ada Bawahan
  if (hasAtasan && hasPeer && hasBawahan) {
    return {
      code: 1,
      name: "Kondisi Ada Atasan, Ada Sejawat, Ada Bawahan",
      weights: { Atasan: wWithSub.Atasan, Peer: wWithSub.Peer, Bawahan: wWithSub.Bawahan || 20 }
    };
  }

  // 2. Kondisi Ada Atasan, Ada Sejawat, Tidak Ada Bawahan
  if (hasAtasan && hasPeer && !hasBawahan) {
    return {
      code: 2,
      name: "Kondisi Ada Atasan, Ada Sejawat, Tidak Ada Bawahan",
      weights: { Atasan: wNoSub.Atasan, Peer: wNoSub.Peer, Bawahan: 0 }
    };
  }

  // 3. Kondisi Ada Atasan, Tidak Ada Sejawat, Ada Bawahan
  if (hasAtasan && !hasPeer && hasBawahan) {
    return {
      code: 3,
      name: "Kondisi Ada Atasan, Tidak Ada Sejawat, Ada Bawahan",
      weights: { Atasan: wCond3.Atasan, Peer: 0, Bawahan: wCond3.Bawahan || 25 }
    };
  }

  // 4. Kondisi Ada Atasan, Tidak Ada Sejawat, Tidak Ada Bawahan
  if (hasAtasan && !hasPeer && !hasBawahan) {
    return {
      code: 4,
      name: "Kondisi Ada Atasan, Tidak Ada Sejawat, Tidak Ada Bawahan",
      weights: { Atasan: wCond4.Atasan, Peer: 0, Bawahan: 0 }
    };
  }

  // 5. Tidak Ada Atasan, Tidak Ada Sejawat, Ada Bawahan
  if (!hasAtasan && !hasPeer && hasBawahan) {
    return {
      code: 5,
      name: "Tidak Ada Atasan, Tidak Ada Sejawat, Ada Bawahan",
      weights: { Atasan: 0, Peer: 0, Bawahan: wCond5.Bawahan || 100 }
    };
  }

  // Extra combinations for resilience (e.g., if only Peer is configured, etc.):
  if (!hasAtasan && hasPeer && hasBawahan) {
    const totalW = wWithSub.Peer + (wWithSub.Bawahan || 25);
    const scalePeer = totalW > 0 ? Math.round((wWithSub.Peer / totalW) * 100) : 40;
    const scaleBawahan = 100 - scalePeer;
    return {
      code: 6,
      name: "Tidak Ada Atasan, Ada Sejawat, Ada Bawahan",
      weights: { Atasan: 0, Peer: scalePeer, Bawahan: scaleBawahan }
    };
  }

  if (!hasAtasan && hasPeer && !hasBawahan) {
    return {
      code: 7,
      name: "Tidak Ada Atasan, Ada Sejawat, Tidak Ada Bawahan",
      weights: { Atasan: 0, Peer: 100, Bawahan: 0 }
    };
  }

  return {
    code: 8,
    name: "Tidak Ada Evaluator yang Terhubung",
    weights: { Atasan: 0, Peer: 0, Bawahan: 0 }
  };
}

export function calculateResult(employee: Employee, assignments: Assignment[], responses: Response[], period?: Period, customDimensions?: any[]) {
  const relevant = assignments.filter((a) => a.evalueeId === employee.id && a.approved && (!period || a.periodId === period.id));
  const includeLeadership = ["Struktural", "JPT Pratama", "Administrator", "Pengawas"].includes(employee.jenis) || employee.hasSub;
  const byType: Record<string, number[]> = {};

  relevant.forEach((a) => {
    const response = responses.find((r) => r.assignmentId === a.id);
    if (!response) return;
    byType[a.type] = byType[a.type] || [];
    byType[a.type].push(scoreFromResponse(response, includeLeadership, customDimensions));
  });

  const atasan = average(byType.Atasan || []);
  const peer = average(byType.Peer || []);
  const bawahan = average(byType.Bawahan || []);
  const self = average(byType.Diri || []);

  // Determine evaluator presence based on assignments in relevant set
  const hasAtasan = relevant.some((a) => a.type === "Atasan");
  const hasPeer = relevant.some((a) => a.type === "Peer");
  const hasBawahan = relevant.some((a) => a.type === "Bawahan");

  const cond = getEvaluatorConditionAndWeights(hasAtasan, hasPeer, hasBawahan, period);
  const weights = cond.weights;

  let weighted = 0;
  let usedWeight = 0;

  if (atasan && weights.Atasan > 0) {
    weighted += atasan * weights.Atasan;
    usedWeight += weights.Atasan;
  }
  if (peer && weights.Peer > 0) {
    weighted += peer * weights.Peer;
    usedWeight += weights.Peer;
  }
  if (bawahan && weights.Bawahan > 0) {
    weighted += bawahan * weights.Bawahan;
    usedWeight += weights.Bawahan;
  }

  const finalScale = usedWeight ? weighted / usedWeight : 0;
  const behaviorScore = Math.round((finalScale / 5) * 100);

  // Compliance calculations for the employee as an evaluator
  const pId = period?.id || 2;
  const evaluatorTasks = assignments.filter(
    (a) => a.evaluatorId === employee.id && a.approved && a.periodId === pId
  );
  const wajibMenilaiCount = evaluatorTasks.length;
  const sudahMenilaiCount = evaluatorTasks.filter((a) =>
    responses.some((r) => r.assignmentId === a.id)
  ).length;

  const complianceScore = wajibMenilaiCount === 0 ? 100 : (sudahMenilaiCount / wajibMenilaiCount) * 100;

  const wWeightBehavior = period?.weightBehavior ?? 80;
  const wWeightCompliance = period?.weightCompliance ?? 20;

  const finalScoreVal = (behaviorScore * (wWeightBehavior / 100)) + (complianceScore * (wWeightCompliance / 100));
  const roundedFinal = Number(finalScoreVal.toFixed(1));

  return {
    atasan: Math.round((atasan / 5) * 100) || 0,
    peer: Math.round((peer / 5) * 100) || 0,
    bawahan: Math.round((bawahan / 5) * 100) || 0,
    self: Math.round((self / 5) * 100) || 0,
    behaviorScore,
    complianceScore: Number(complianceScore.toFixed(1)),
    wajibMenilaiCount,
    sudahMenilaiCount,
    final: roundedFinal,
    category: behaviorScore ? getCategory(roundedFinal) : "Belum Lengkap",
    completed: relevant.filter((a) => responses.some((r) => r.assignmentId === a.id)).length,
    total: relevant.length,
    conditionName: cond.name,
    conditionCode: cond.code,
    weightsApplied: weights,
  };
}

export function dimensionScores(employee: Employee, assignments: Assignment[], responses: Response[], period?: Period, customDimensions?: any[]) {
  const includeLeadership = ["Struktural", "JPT Pratama", "Administrator", "Pengawas"].includes(employee.jenis) || employee.hasSub;
  const activeDims = customDimensions || dimensions;

  const relevant = assignments.filter((a) => a.evalueeId === employee.id && a.approved && (!period || a.periodId === period.id));
  const hasAtasan = relevant.some((a) => a.type === "Atasan");
  const hasPeer = relevant.some((a) => a.type === "Peer");
  const hasBawahan = relevant.some((a) => a.type === "Bawahan");

  const cond = getEvaluatorConditionAndWeights(hasAtasan, hasPeer, hasBawahan, period);
  const weights = cond.weights;

  return activeDims
    .filter((d) => includeLeadership || !d.leadershipOnly)
    .map((d) => {
      const byType: Record<string, number[]> = {};
      relevant.forEach((a) => {
        const response = responses.find((r) => r.assignmentId === a.id);
        if (!response) return;
        const val = response.scores[d.key];
        if (typeof val === "number") {
          byType[a.type] = byType[a.type] || [];
          byType[a.type].push(val);
        }
      });

      const atasan = average(byType.Atasan || []);
      const peer = average(byType.Peer || []);
      const bawahan = average(byType.Bawahan || []);

      let weighted = 0;
      let usedWeight = 0;

      if (atasan && weights.Atasan > 0) {
        weighted += atasan * weights.Atasan;
        usedWeight += weights.Atasan;
      }
      if (peer && weights.Peer > 0) {
        weighted += peer * weights.Peer;
        usedWeight += weights.Peer;
      }
      if (bawahan && weights.Bawahan > 0) {
        weighted += bawahan * weights.Bawahan;
        usedWeight += weights.Bawahan;
      }

      const finalScale = usedWeight ? weighted / usedWeight : 0;
      const score = Math.round((finalScale / 5) * 100) || 0;

      return { ...d, score };
    });
}

export function unitStats(state: AppState, period?: Period) {
  const activePeriod = period || state.period;
  const activeUnits = (state.orgUnits && state.orgUnits.length > 0 ? state.orgUnits : orgUnitCatalog).map((u) => u.name);
  const customDimensions = state.dimensions;
  return activeUnits.map((unit) => {
    const emp = state.employees.filter((e) => e.unit === unit);
    const assignments = state.assignments.filter((a) => emp.some((e) => e.id === a.evalueeId) && (!activePeriod || a.periodId === activePeriod.id));
    const completed = assignments.filter((a) => state.responses.some((r) => r.assignmentId === a.id)).length;
    const pct = Math.round((completed / Math.max(1, assignments.length)) * 100);
    const results = emp.map((e) => calculateResult(e, state.assignments, state.responses, activePeriod, customDimensions).final).filter(Boolean);
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

export function syncMandatoryAssignments(
  employees: Employee[], 
  currentAssignments: Assignment[], 
  maxBawahan: number = 100, 
  periodId: number = 2, 
  maxPeer: number = 4,
  enforceMaxBawahan: boolean = false,
  autoFillPeers: boolean = true,
  randomizePeers: boolean = false
): Assignment[] {
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

  // Keep a stable map of allowed subordinates if maxBawahan applies
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

    const allowed = sortedSubs.slice(0, enforceMaxBawahan ? maxBawahan : subs.length);
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

      // If enforceMaxBawahan is enabled, check against allowedSet
      if (enforceMaxBawahan) {
        const allowedSet = allowedSubordinatesMap[evaluee.id];
        if (allowedSet && !allowedSet.has(evaluator.id)) {
          return false;
        }
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
        const isAllowed = !enforceMaxBawahan || (allowedSubordinatesMap[boss.id]?.has(emp.id) ?? true);

        if (isAllowed) {
          // Look for existing assignment where boss is evaluated by emp as Bawahan
          const exists = assignments.some(
            (a) => a.evalueeId === boss.id && a.evaluatorId === emp.id && a.type === "Bawahan" && a.periodId === periodId
          );
          if (!exists) {
            assignments.push({
              id: periodId * 100000 + boss.id * 1000 + emp.id,
              periodId: periodId,
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
          (a) => a.evalueeId === emp.id && a.evaluatorId === boss.id && a.type === "Atasan" && a.periodId === periodId
        );
        if (!existsAtasan) {
          assignments.push({
            id: periodId * 100000 + 50000 + emp.id * 1000 + boss.id,
            periodId: periodId,
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

  // 3. Rule 3: Automatically generate peer assignments for employees who have no approved/pending peer assignments (only if autoFillPeers is enabled)
  if (autoFillPeers) {
    employees.forEach((emp) => {
      const hasPeerAssignments = assignments.some(
        (a) => a.evaluatorId === emp.id && a.type === "Peer" && a.periodId === periodId
      );
      if (!hasPeerAssignments) {
        const eligiblePeers = employees.filter((other) => isEligiblePeer(emp, other));
        const selectedPeers = randomizePeers 
          ? seededShuffle(eligiblePeers, emp.id * 1000 + periodId).slice(0, maxPeer)
          : [...eligiblePeers].sort((a, b) => a.id - b.id).slice(0, maxPeer);
        
        selectedPeers.forEach((peer) => {
          // Emp evaluates Peer
          const exists1 = assignments.some(
            (a) => a.evalueeId === peer.id && a.evaluatorId === emp.id && a.type === "Peer" && a.periodId === periodId
          );
          if (!exists1) {
            assignments.push({
              id: periodId * 100000 + 70000 + peer.id * 1000 + emp.id,
              periodId: periodId,
              evalueeId: peer.id,
              evaluatorId: emp.id,
              type: "Peer",
              status: "Belum Mulai",
              approved: true,
            });
          }
          
          // Peer evaluates Emp
          const exists2 = assignments.some(
            (a) => a.evalueeId === emp.id && a.evaluatorId === peer.id && a.type === "Peer" && a.periodId === periodId
          );
          if (!exists2) {
            assignments.push({
              id: periodId * 100000 + 70000 + emp.id * 1000 + peer.id,
              periodId: periodId,
              evalueeId: emp.id,
              evaluatorId: peer.id,
              type: "Peer",
              status: "Belum Mulai",
              approved: true,
            });
          }
        });
      }
    });
  }

  // Deduplicate before returning
  const seen = new Set<string>();
  const uniqueAssignments: Assignment[] = [];
  assignments.forEach((a) => {
    const key = `${a.periodId}-${a.evalueeId}-${a.evaluatorId}-${a.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueAssignments.push(a);
    } else {
      // If we see a duplicate, we might prefer one with higher progress status
      const existingIdx = uniqueAssignments.findIndex(
        (x) => `${x.periodId}-${x.evalueeId}-${x.evaluatorId}-${x.type}` === key
      );
      if (existingIdx !== -1) {
        const existing = uniqueAssignments[existingIdx];
        const statusPriority: Record<string, number> = { "Selesai": 3, "Sedang Diisi": 2, "Belum Mulai": 1 };
        const pExisting = statusPriority[existing.status] || 0;
        const pCurrent = statusPriority[a.status] || 0;
        if (pCurrent > pExisting) {
          uniqueAssignments[existingIdx] = a;
        }
      }
    }
  });

  return uniqueAssignments;
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

export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const r = Math.sin(currentSeed++) * 10000;
    const randomVal = r - Math.floor(r);
    const j = Math.floor(randomVal * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

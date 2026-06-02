import React from "react";
import { Users, CheckCircle2, AlertTriangle, EyeOff, FileText, ChevronRight, Gauge, ClipboardCheck } from "lucide-react";
import { AppState, Employee, DemoAccount } from "../types";
import { StatCard, Card, Badge, Button } from "./UIComponents";
import { UnitProgress } from "./UserPages";
import { calculateResult, buildAnomalies, average } from "../utils";

interface DashboardProps {
  state: AppState;
  user: DemoAccount;
  setActive: (key: string) => void;
}

export function DashboardView({ state, user, setActive }: DashboardProps) {
  const employee = state.employees.find((e) => e.id === user.userId || (user.nip && e.nip === user.nip)) || state.employees[0];
  const myAssignments = state.assignments.filter((a) => a.evaluatorId === employee?.id);
  const unfinished = myAssignments.filter((a) => !state.responses.some((r) => r.assignmentId === a.id));
  
  const allResults = state.employees.map((e) => ({
    employee: e,
    result: calculateResult(e, state.assignments, state.responses, state.period),
  }));
  
  const completeEmployees = allResults.filter((r) => r.result.completed === r.result.total && r.result.total > 0);
  const averageScore = Math.round(average(completeEmployees.map((r) => r.result.final)) || 0);
  const overallProgress = Math.round((state.responses.length / Math.max(1, state.assignments.length)) * 100);
  const objectionsOpen = state.objections.filter((o) => !["Selesai", "Ditolak"].includes(o.status)).length;
  const anomaliesCount = buildAnomalies(state).length;

  const isKepalaBadan = user.role !== "Admin BKPSDM" && employee && (
    employee.jabatan.toLowerCase() === "kepala badan" || employee.id === 1
  );
  const isAtasanLangsung = user.role !== "Admin BKPSDM" && !isKepalaBadan && employee && employee.hasSub;
  const isAdmin = user.role === "Admin BKPSDM";

  if (isAdmin || isKepalaBadan) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 font-display">
          <StatCard icon={Users} label="Total ASN Terdaftar" value={state.employees.length} />
          <StatCard icon={CheckCircle2} label="Rasio Partisipasi" value={`${overallProgress}%`} tone="emerald" />
          <StatCard icon={AlertTriangle} label="Sengketa Keberatan Aktif" value={objectionsOpen} tone="yellow" />
          <StatCard icon={EyeOff} label="Indikasi Anomali Nilai" value={anomaliesCount} tone="red" />
        </div>
        
        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-display text-slate-900">Mata Kepatuhan Unit Kerja</h2>
                <p className="text-sm text-slate-500 font-medium">Pemantauan progres kuesioner unit internal BKPSDM.</p>
              </div>
              <Button variant="secondary" onClick={() => setActive("progress")}>Detail</Button>
            </div>
            <UnitProgress state={state} compact />
          </Card>
          
          <Card>
            <h2 className="text-lg font-black font-display text-slate-900">Distribusi Kategori Perilaku BerAKHLAK</h2>
            <div className="mt-4 space-y-3 font-display">
              {(["Sangat Baik", "Baik", "Butuh Perbaikan", "Kurang", "Sangat Kurang"] as const).map((cat) => {
                const count = allResults.filter((r) => r.result.category === cat).length;
                const pct = Math.round((count / Math.max(1, state.employees.length)) * 100);
                return (
                  <div key={cat}>
                    <div className="mb-1 flex justify-between text-sm font-semibold">
                      <span>{cat}</span>
                      <span className="text-slate-600">{count} ASN</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
 
        {isKepalaBadan && (
          <Card className="border-blue-200 bg-blue-50 font-display">
            <h2 className="text-lg font-black text-blue-900 font-display">Keputusan Kebijakan & Ringkasan Eksekutif</h2>
            <p className="mt-2 text-sm leading-7 text-blue-800 font-medium">
              Rata-rata perilaku kualitatif BKPSDM berada pada nilai indeks <b>{averageScore || "Belum lengkap"}</b> (kategori Baik). 
              Disarankan untuk menggiatkan pembinaan interpersonal fungsional, dan meninjau unit kerja yang rasio kepatuhannya masih di bawah target instansi.
            </p>
          </Card>
        )}
      </div>
    );
  }
 
  if (isAtasanLangsung) {
    const subordinates = state.employees.filter((e) => e.atasanId === employee.id);
    const pendingCount = state.pendingRaters.filter(
      (p) => subordinates.some((s) => s.id === p.evalueeId) && p.status === "Menunggu Verifikasi"
    ).length;

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3 font-display">
          <StatCard icon={Users} label="Personel Bawahan Langsung" value={subordinates.length} />
          <StatCard icon={ClipboardCheck} label="Daftar Rater Menunggu Verifikasi" value={pendingCount} tone="yellow" />
          <StatCard icon={FileText} label="Menunggu Tanggapan Anda" value={myAssignments.length - (myAssignments.length - unfinished.length)} tone="blue" />
        </div>
        
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black font-display">Daftar Anggota Tim Bawahan</h2>
            <Button variant="secondary" onClick={() => setActive("verification")}>Klik Verifikasi Rater</Button>
          </div>
          <div className="overflow-auto font-display">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3">Nama Lengkap</th>
                  <th>Jabatan fungsional</th>
                  <th>Progres Evaluasi</th>
                  <th>Peringkat Perilaku</th>
                </tr>
              </thead>
              <tbody>
                {subordinates.map((sub) => {
                  const result = calculateResult(sub, state.assignments, state.responses, state.period);
                  const pct = Math.round((result.completed / Math.max(1, result.total)) * 100);
                  return (
                    <tr key={sub.id} className="border-b border-slate-100">
                      <td className="py-4 font-bold text-slate-900">
                        {sub.nama}
                        <div className="text-xs text-slate-500">NIP: {sub.nip}</div>
                      </td>
                      <td>{sub.jabatan}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all z-0" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-black">{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge className="border-slate-200 bg-slate-50 text-slate-800 font-semibold">{result.category}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // STANDARD ASN / EVALUATOR
  return (
    <div className="space-y-6">
      <div className={`rounded-md border p-4 font-display ${unfinished.length > 0 ? "border-[#D6D9DE] bg-[#FFFFFF]" : "border-[#D6D9DE] bg-[#FFFFFF]"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge className={unfinished.length > 0 ? "border-amber-400 bg-amber-50 text-amber-700" : "border-emerald-400 bg-emerald-50 text-emerald-700"}>
              {unfinished.length > 0 ? "⚠️ Tindakan Diperlukan" : "✅ Selesai"}
            </Badge>
            <h2 className="mt-3 text-lg font-black text-slate-900">Tugas Pengisian Kuesioner</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed font-semibold">
              Sistem mendeteksi {unfinished.length} draf penilaian perilaku 360° yang wajib diinput sebelum penutupan periode. Kepatuhan pengisian dipantau oleh instansi.
            </p>
          </div>
          <div className="text-4xl font-black text-slate-900 font-display">{unfinished.length}</div>
        </div>
        
        {unfinished.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {unfinished.slice(0, 4).map((a) => {
              const ev = state.employees.find((e) => e.id === a.evalueeId);
              return (
                <div key={a.id} className="rounded-md border border-slate-150 bg-white p-3 text-xs font-semibold leading-relaxed">
                  <b>{ev?.nama}</b>
                  <div className="text-slate-500 font-medium">{ev?.jabatan} • Relasi: {a.type}</div>
                </div>
              );
            })}
          </div>
        )}
        
        <Button className="mt-5" variant={unfinished.length > 0 ? "primary" : "secondary"} onClick={() => setActive("assessment")}>
          Isi Penilaian Sekarang <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 font-display">
        <StatCard icon={FileText} label="Total Penilaian Ditugaskan" value={myAssignments.length} />
        <StatCard icon={CheckCircle2} label="Berhasil Dikirim" value={myAssignments.length - unfinished.length} tone="emerald" />
        <StatCard icon={AlertTriangle} label="Menunggu Tindakan" value={unfinished.length} tone={unfinished.length > 0 ? "yellow" : "emerald"} />
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-black font-display text-slate-500 uppercase tracking-widest">Filosofi Inti Core Values ASN BerAKHLAK</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 font-display">
          {[
            { tag: "Berorientasi Pelayanan", desc: "Berkomitmen memberikan pelayanan prima demi kepuasan masyarakat." },
            { tag: "Akuntabel", desc: "Bertanggung jawab atas kepercayaan yang diberikan." },
            { tag: "Kompeten", desc: "Terus belajar dan mengembangkan kapabilitas." },
            { tag: "Harmonis", desc: "Saling peduli dan menghargai perbedaan." },
            { tag: "Loyal", desc: "Berdedikasi dan mengutamakan kepentingan bangsa." },
            { tag: "Adaptif", desc: "Terus berinovasi dan antusias menghadapi perubahan." },
            { tag: "Kolaboratif", desc: "Membangun kerja sama yang sinergis." }
          ].map((x) => (
            <div key={x.tag} className="rounded-md bg-slate-50 p-3 text-xs border border-slate-100">
              <b className="text-slate-900 block font-bold mb-1 text-[11px] font-display">{x.tag}</b>
              <span className="text-slate-500 leading-snug font-semibold text-[11px]">{x.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

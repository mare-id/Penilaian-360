import React, { useState } from "react";
import { EyeOff, Search, Users, CheckCircle2, AlertTriangle, ClipboardCheck, Lock, ChevronRight, BarChart3, FileText, ArrowUpCircle, ArrowDownCircle, UsersRound, Shield } from "lucide-react";
import { AppState, Employee, Assignment, Response, Objection, PendingRaters, DemoAccount, Period } from "../types";
import { dimensions, orgUnitCatalog } from "../data";
import { Badge, Card, Button, Field, ProgressBar, Empty, StatCard } from "./UIComponents";
import { calculateResult, categoryClass, statusClass, dimensionScores, average, unitStats, buildAnomalies, isEligiblePeer, seededShuffle } from "../utils";

interface PageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  user: DemoAccount;
  toast: (msg: string) => void;
  logAction?: (username: string, name: string, role: string, action: string, details: string) => void;
}

// ---------------------------------------------
// PROFILE PAGE
// ---------------------------------------------
export function Profile({ state, setState, user, toast, logAction }: PageProps) {
  const employee = state.employees.find((e) => e.id === user.userId) || state.employees[0];
  const [form, setForm] = useState({
    ...employee,
    email: employee.email || `${employee.nip}@dairikab.go.id`,
    hp: employee.hp || "081234567890",
  });

  const save = () => {
    if (!/^\d{18}$/.test(form.nip)) return toast("NIP wajib 18 digit angka.");
    if (!confirm("Apakah Anda yakin ingin menyimpan perubahan data profil Anda?")) {
      return;
    }
    setState((s) => ({
      ...s,
      employees: s.employees.map((e) => (e.id === employee.id ? { ...e, ...form } : e)),
    }));
    toast("Profil ASN berhasil diperbarui.");
    if (logAction) {
      const isKepala = user.role !== "Admin BKPSDM" && (employee.jabatan.toLowerCase() === "kepala badan" || employee.id === 1);
      const isAtasan = user.role !== "Admin BKPSDM" && employee.hasSub;
      const displayRole = user.role === "Admin BKPSDM"
        ? "Admin BKPSDM"
        : isKepala
        ? "Kepala Badan"
        : isAtasan
        ? "Atasan Langsung"
        : "Pegawai ASN";
      logAction(user.username || user.nip, user.name, displayRole, "Ubah Profil", `Memperbarui detail data profil mandiri.`);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <Card className="bg-slate-950 text-white">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-500 text-2xl font-black font-display text-white">
          {employee.nama.split(" ").map((x) => x[0]).slice(0, 2).join("")}
        </div>
        <h2 className="mt-4 text-2xl font-black font-display text-slate-950">{employee.nama}</h2>
        <p className="text-slate-500 font-medium">{employee.jabatan}</p>
        <div className="mt-5 space-y-2 text-sm text-slate-500">
          <p>NIP: {employee.nip}</p>
          <p>Unit: {employee.unit}</p>
          <p>Jenis Jabatan: {employee.jenis}</p>
        </div>
        <Badge className="mt-5 border-emerald-400 bg-emerald-400/10 text-emerald-700">Profil Lengkap</Badge>
      </Card>
      
      <Card>
        <h2 className="mb-4 text-lg font-black font-display">Update Profil Simulatif</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama">
            <input className="w-full rounded-xl border p-3" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </Field>
          <Field label="NIP">
            <input className="w-full rounded-xl border p-3" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value.replace(/\D/g, "") })} maxLength={18} />
          </Field>
          <Field label="Pangkat/Golongan">
            <input className="w-full rounded-xl border p-3" value={form.gol} onChange={(e) => setForm({ ...form, gol: e.target.value })} />
          </Field>
          <Field label="Jenis Jabatan">
            <select className="w-full rounded-xl border p-3" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })}>
              <option value="JPT Pratama">JPT Pratama</option>
              <option value="Administrator">Administrator</option>
              <option value="Pengawas">Pengawas</option>
              <option value="Fungsional">Fungsional</option>
              <option value="Pelaksana">Pelaksana</option>
            </select>
          </Field>
          <Field label="Jabatan">
            <select
              className="w-full rounded-xl border p-3"
              value={form.jabatan}
              onChange={(e) => {
                const selectedJob = state.jobs.find((j) => j.name === e.target.value);
                if (selectedJob) {
                  setForm({ ...form, jabatan: selectedJob.name, jenis: selectedJob.type });
                } else {
                  setForm({ ...form, jabatan: e.target.value });
                }
              }}
            >
              {[...state.jobs]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((j) => (
                  <option key={j.id} value={j.name}>
                    {j.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Unit Kerja">
            <select className="w-full rounded-xl border p-3" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              {orgUnitCatalog.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Email">
            <input className="w-full rounded-xl border p-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Nomor HP">
            <input className="w-full rounded-xl border p-3" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} />
          </Field>
        </div>
        <Button className="mt-5" onClick={save}>Simpan Profil</Button>
      </Card>
    </div>
  );
}

// ---------------------------------------------
// RATER MANAGEMENT PAGE
// ---------------------------------------------
export function RaterManagement({ state, setState, user, toast, logAction }: PageProps) {
  const employee = state.employees.find((e) => e.id === user.userId) || state.employees[0];
  const directBoss = state.employees.find((e) => e.id === employee.atasanId);
  const pending = state.pendingRaters.find((p) => p.evalueeId === employee.id);
  
  // Hanya sesama ASN yang memenuhi syarat sebagai rekan sejawat (Eligible Peer)
  const peers = state.employees.filter(
    (e) => isEligiblePeer(e, employee)
  );
  
  // Urutkan rekan sejawat secara alfabetis nama
  const sortedPeers = [...peers].sort((a, b) => {
    return a.nama.localeCompare(b.nama);
  });
  
  const [selected, setSelected] = useState<number[]>(() => {
    if (pending) return pending.proposedIds;
    if (state.period.randomizePeers) {
      const shuffled = seededShuffle(sortedPeers, employee.id * 1000 + state.period.id);
      return shuffled.slice(0, Math.min(state.period.maxPeer, shuffled.length)).map((p) => p.id);
    }
    // Default: maks maxPeer, jika hanya ada kurang ya ambil senyatanya
    return sortedPeers.slice(0, Math.min(state.period.maxPeer, sortedPeers.length)).map((p) => p.id);
  });

  const submit = () => {
    const requiredMin = Math.min(state.period.minPeer, sortedPeers.length);
    const requiredMax = Math.min(state.period.maxPeer, sortedPeers.length);

    if (selected.length < requiredMin) {
      return toast(`Minimal harus memilih ${requiredMin} peer evaluator.`);
    }
    if (selected.length > requiredMax) {
      return toast(`Maksimal hanya boleh memilih ${requiredMax} peer evaluator.`);
    }
    
    const invalidSelected = selected.some((id) => {
      const p = state.employees.find((e) => e.id === id);
      return !p || !isEligiblePeer(p, employee);
    });

    if (invalidSelected) {
      return toast("Seluruh peer evaluator terpilih wajib di satu unit kerja & sesuai aturan klaster jabatan (Pelaksana/Mahir/Pertama vs Ahli Muda vs Ahli Madya).");
    }

    if (!confirm("Apakah Anda yakin ingin menyimpan dan mengirimkan usulan rater rekan sejawat (peer) ini untuk proses penilaian?")) {
      return;
    }

    const isRandomized = !!state.period.randomizePeers;
    setState((s) => {
      const entry: PendingRaters = {
        id: pending?.id || Date.now(),
        evalueeId: employee.id,
        proposedIds: selected,
        status: isRandomized ? "Disetujui" : "Menunggu Verifikasi",
        submittedAt: new Date().toISOString().slice(0, 10),
        rejectionReason: "",
      };

      let nextAssignments = [...s.assignments];
      if (isRandomized) {
        // Clear old Peer assignments for this user
        nextAssignments = nextAssignments.filter(
          (a) => !(a.evalueeId === employee.id && a.type === "Peer" && a.periodId === s.period.id)
        );
        // Add new peer assignments
        selected.forEach((pid) => {
          // Emp evaluated by peer
          const existsLeft = nextAssignments.some(
            (a) => a.evalueeId === employee.id && a.evaluatorId === pid && a.type === "Peer" && a.periodId === s.period.id
          );
          if (!existsLeft) {
            nextAssignments.push({
              id: s.period.id * 100000 + 70000 + pid * 1000 + employee.id,
              periodId: s.period.id,
              evalueeId: employee.id,
              evaluatorId: pid,
              type: "Peer",
              status: "Belum Mulai",
              approved: true,
            });
          }

          // Peer evaluated by emp
          const existsRight = nextAssignments.some(
            (a) => a.evalueeId === pid && a.evaluatorId === employee.id && a.type === "Peer" && a.periodId === s.period.id
          );
          if (!existsRight) {
            nextAssignments.push({
              id: s.period.id * 100000 + 70000 + employee.id * 1000 + pid,
              periodId: s.period.id,
              evalueeId: pid,
              evaluatorId: employee.id,
              type: "Peer",
              status: "Belum Mulai",
              approved: true,
            });
          }
        });
      }

      return {
        ...s,
        pendingRaters: [...s.pendingRaters.filter((p) => p.evalueeId !== employee.id), entry],
        assignments: nextAssignments,
      };
    });

    if (isRandomized) {
      toast("Rekan sejawat berhasil disimpan dan langsung disetujui otomatis!");
    } else {
      toast("Usulan evaluator dikirim ke atasan langsung.");
    }
    if (logAction) {
      const isKepala = user.role !== "Admin BKPSDM" && (employee.jabatan.toLowerCase() === "kepala badan" || employee.id === 1);
      const isAtasan = user.role !== "Admin BKPSDM" && employee.hasSub;
      const displayRole = user.role === "Admin BKPSDM"
        ? "Admin BKPSDM"
        : isKepala
        ? "Kepala Badan"
        : isAtasan
        ? "Atasan Langsung"
        : "Pegawai ASN";
      logAction(
        user.username || user.nip,
        user.name,
        displayRole,
        "Manajemen Evaluator",
        `Mengusulkan ${selected.length} orang rekan sejawat sebagai rater penilaian 360 derajat (${isRandomized ? "Langsung Disetujui Otomatis" : "Status: Menunggu Verifikasi Atasan"}).`
      );
    }
  };

  const toggle = (id: number) => {
    if (pending?.status === "Disetujui") {
      return toast("Usulan penilai Anda sudah disetujui dan terkunci.");
    }

    setSelected((cur) => {
      if (cur.includes(id)) {
        return cur.filter((x) => x !== id);
      } else {
        if (cur.length >= state.period.maxPeer) {
          toast(`Batas maksimal penilai rekan kerja setingkat adalah ${state.period.maxPeer} orang.`);
          return cur;
        }
        return [...cur, id];
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <EyeOff className="mt-1 h-5 w-5 text-blue-700" />
          <div>
            <h2 className="font-black text-blue-950 font-display">Anonimitas Mutlak</h2>
            <p className="mt-1 text-sm leading-6 text-blue-900">
              Daftar evaluator diverifikasi untuk objektivitas. Hasil yang tampil kepada Anda hanya nilai rata-rata agregat, bukan jawaban individual masing-masing peer.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 lg:grid-cols-3 font-display">
        <Card>
          <h3 className="font-black">Atasan Langsung</h3>
          <p className="mt-3 text-sm text-slate-600 font-medium">{directBoss?.nama || "Tidak ada atasan langsung (Kosong)"}</p>
          <Badge className="mt-4 border-emerald-200 bg-emerald-50 text-emerald-700">Otomatis</Badge>
        </Card>
        <Card>
          <h3 className="font-black">Evaluasi Diri</h3>
          <p className="mt-3 text-sm text-slate-600 font-medium">Wajib diisi sebagai pembanding IDP, tidak masuk bobot akhir.</p>
          <Badge className="mt-4 border-blue-200 bg-blue-50 text-blue-700">Pembanding</Badge>
        </Card>
        <Card>
          <h3 className="font-black">Status Usulan</h3>
          {state.period.randomizePeers ? (
            <>
              <p className="mt-3 text-sm text-slate-600 font-medium">Berdasarkan acak otomatis oleh sistem.</p>
              <Badge className="mt-4 border-violet-200 bg-violet-50 text-violet-700 font-semibold uppercase">Otomatis ⚡</Badge>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-slate-600 font-medium">{pending ? pending.submittedAt : "Belum dikirim"}</p>
              <Badge className={statusClass(pending?.status || "Draft")}>{pending?.status || "Draft"}</Badge>
            </>
          )}
        </Card>
      </div>

      {state.period.randomizePeers ? (
        <Card className="border-violet-200 bg-violet-50/20">
          <div className="mb-4">
            <h2 className="text-lg font-black font-display text-slate-950 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-violet-600" />
              Penilaian Rekan Sejawat Acak (Otomatis) Aktif
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Sistem telah memilih dan menetapkan Rekan Sejawat (Peer Evaluator) Anda secara acak dan otomatis sesuai dengan kriteria regulasi (Satu Unit Kerja & Klaster Jabatan sepadan).
            </p>
            <div className="mt-3 p-3 bg-white rounded-xl border border-violet-100/50 text-xs text-slate-500 leading-relaxed font-semibold shadow-sm">
              💡 <b>Informasi Regulasi:</b> Sesuai kebijakan penatausahaan penilaian kinerja periode ini, Anda tidak diperkenankan untuk memilih rater rekan sejawat Anda sendiri demi objektivitas penilaian 360 derajat. Pilihan dari sistem ini bersifat acak, final, dan langsung disetujui otomatis secara tersistem.
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-extrabold text-xs tracking-wider text-slate-500 mb-3 uppercase font-display">1. Daftar Rekan Kerja Yang Menilai Anda (Peer Evaluator):</h3>
            {state.showPeerRaterNames === false ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/25 p-5 text-center font-display">
                <Shield className="mx-auto h-10 w-10 text-emerald-600 stroke-[1.5] mb-2" />
                <p className="text-xs text-slate-800 font-extrabold uppercase tracking-wide">Identitas Evaluator Pendukung Dirahasiakan</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold max-w-sm mx-auto">
                  Sesuai kebijakan penatausahaan dari BKPSDM, nama-nama rekan sejawat yang menilai Anda **sengaja disembunyikan (anonim)** demi asas objektivitas penilaian 360 derajat. Anda hanya dapat melihat total draf penyelesaian rater Anda tanpa rincian identitas.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200/50">
                  <span>🔒</span> Mode Evaluasi Anonim Aktif
                </div>
              </div>
            ) : state.assignments.filter((a) => a.periodId === state.period.id && a.evalueeId === employee.id && a.type === "Peer").length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center select-none">
                <Users className="mx-auto h-10 w-10 text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs text-slate-400 font-semibold font-display">Tidak Memiliki Rekan Sejawat Setingkat</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Berdasarkan database, Anda tidak memiliki rekan kerja dengan jenis jabatan setingkat di unit kerja ini ({employee.unit}). Anda dibebaskan dari kewajiban penilaian peer.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {state.assignments
                  .filter((a) => a.periodId === state.period.id && a.evalueeId === employee.id && a.type === "Peer")
                  .map((a) => {
                    const p = state.employees.find((e) => e.id === a.evaluatorId);
                    if (!p) return null;
                    return (
                      <div key={p.id} className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm tracking-tight text-slate-900">{p.nama}</span>
                          <Badge className="border-violet-100 bg-violet-50 text-violet-700 text-[9px] py-0 px-1 font-semibold uppercase">Sistem Rater ⚡</Badge>
                        </div>
                        <div className="text-xs mt-1.5 font-medium text-slate-500">
                          NIP. {p.nip} • Gol. {p.gol}
                        </div>
                        <div className="text-[11px] font-medium mt-0.5 text-slate-400">
                          {p.jabatan} • {p.unit}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-violet-100">
            <h3 className="font-extrabold text-xs tracking-wider text-slate-500 mb-3 uppercase font-display">2. Daftar Rekan Kerja Yang Anda Nilai (Evaluee Anda):</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Tugas pengerjaan kuesioner Anda untuk rekan kerja di bawah ini dapat diakses pada tab menu utama <b>"Form Kuesioner"</b> di atas.
            </p>
            {state.assignments.filter((a) => a.periodId === state.period.id && a.evaluatorId === employee.id && a.type === "Peer").length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center select-none">
                <Users className="mx-auto h-10 w-10 text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs text-slate-400 font-semibold font-display">Tidak Ada Rekan Kerja Yang Harus Anda Nilai</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {state.assignments
                  .filter((a) => a.periodId === state.period.id && a.evaluatorId === employee.id && a.type === "Peer")
                  .map((a) => {
                    const p = state.employees.find((e) => e.id === a.evalueeId);
                    if (!p) return null;
                    return (
                      <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm tracking-tight text-slate-900">{p.nama}</span>
                          <Badge className="border-slate-100 bg-slate-50 text-slate-600 text-[9px] py-0 px-1 font-semibold uppercase">Evaluee Anda 📝</Badge>
                        </div>
                        <div className="text-xs mt-1.5 font-medium text-slate-500">
                          NIP. {p.nip} • Gol. {p.gol}
                        </div>
                        <div className="text-[11px] font-medium mt-0.5 text-slate-400">
                          {p.jabatan} • {p.unit}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-950">Pilih Peer Evaluator</h2>
              <p className="text-sm text-slate-500">
                {sortedPeers.length > state.period.maxPeer 
                  ? `Pilih maksimal ${state.period.maxPeer} rekan kerja satu unit (Sistem akan mengunci otomatis bila sudah memilih ${state.period.maxPeer}).`
                  : sortedPeers.length > 0 
                  ? `Anda memiliki ${sortedPeers.length} rekan kerja satu unit yang dapat dipilih. Silakan pilih hingga ${Math.min(state.period.maxPeer, sortedPeers.length)} orang tersebut.`
                  : "Anda tidak memiliki rekan kerja satu unit yang memenuhi syarat."}
              </p>
              <div className="mt-1.5 flex flex-col gap-1 items-start">
                <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 text-[10px] font-semibold">
                  Aturan Unit: Wajib Satu Unit Kerja ({employee.unit})
                </Badge>
                <Badge className="bg-emerald-50 border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                  Aturan Jabatan: Klaster sesuai jenjang (Pelaksana/Mahir/Pertama vs Ahli Muda vs Ahli Madya)
                </Badge>
              </div>
            </div>
            <Badge className="border-slate-200 bg-slate-50 text-slate-700">Terpilih {selected.length} / {Math.min(state.period.maxPeer, sortedPeers.length)}</Badge>
          </div>
          
          {sortedPeers.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center select-none">
              <Users className="mx-auto h-12 w-12 text-slate-400 stroke-[1.5] mb-2" />
              <h3 className="text-sm font-black text-slate-750 font-display">Tidak Mempunyai Rekan Kerja yang Memenuhi Syarat</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Anda tidak memiliki rekan kerja dengan rumpun/klaster jabatan atau jenjang yang sama di unit kerja yang sama ({employee.unit}). Sesuai regulasi, Anda dikecualikan dari penilaian peer.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {sortedPeers.map((p) => {
                const isSelected = selected.includes(p.id);
                const isLocked = !isSelected && selected.length >= state.period.maxPeer;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => !isLocked && toggle(p.id)}
                    disabled={pending?.status === "Disetujui"}
                    className={`rounded-2xl border p-4 text-left transition relative overflow-hidden ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                        : isLocked
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                        : "border-slate-200 bg-white hover:border-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm tracking-tight">{p.nama}</span>
                      {isSelected && (
                        <Badge className="bg-white/20 border-white/40 text-white text-[9px] py-0 px-1 font-semibold uppercase">Dipilih ⚡</Badge>
                      )}
                      {isLocked && (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">🔒 Terkunci</span>
                      )}
                      {!isSelected && !isLocked && p.unit === employee.unit && (
                        <Badge className="border-indigo-100 bg-indigo-50 text-indigo-700 text-[9px] py-0 px-1 font-semibold uppercase">Satu Unit</Badge>
                      )}
                    </div>
                    <div className={`text-xs mt-1.5 font-medium ${isSelected ? "text-indigo-100" : "text-slate-500"}`}>
                      NIP. {p.nip} • Gol. {p.gol}
                    </div>
                    <div className={`text-[11px] font-medium mt-0.5 ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                      {p.jabatan} • {p.unit}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {sortedPeers.length > 0 && (
            <Button 
              className="mt-5" 
              onClick={submit}
              disabled={pending?.status === "Disetujui"}
            >
              {pending?.status === "Disetujui" ? "Pilihan Telah Disetujui Atasan" : "Kirim ke Atasan untuk Verifikasi"}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------
// VERIFICATION PAGE
// ---------------------------------------------
export function Verification({ state, setState, user, toast, logAction }: PageProps) {
  const boss = state.employees.find((e) => e.id === user.userId);
  const subordinates = state.employees.filter((e) => e.atasanId === boss?.id);
  const items = state.pendingRaters.filter((p) => subordinates.some((s) => s.id === p.evalueeId));

  const approve = (item: PendingRaters) => {
    const evaluee = state.employees.find((e) => e.id === item.evalueeId);
    if (!confirm(`Apakah Anda yakin ingin menyetujui usulan rater rekan sejawat untuk pegawai "${evaluee?.nama || "Bawahan"}"?`)) {
      return;
    }
    setState((s) => {
      const newAssignments: Assignment[] = item.proposedIds.map((pid) => ({
        id: Date.now() + pid,
        periodId: s.period.id,
        evalueeId: item.evalueeId,
        evaluatorId: pid,
        type: "Peer",
        status: "Belum Mulai",
        approved: true,
      }));
      return {
        ...s,
        pendingRaters: s.pendingRaters.map((p) => (p.id === item.id ? { ...p, status: "Disetujui" } : p)),
        assignments: [...s.assignments, ...newAssignments],
      };
    });
    toast("Evaluator disetujui dan daftar dikunci.");
    if (logAction) {
      logAction(
        user.username || user.nip,
        user.name,
        "Atasan Langsung",
        "Verifikasi Rater",
        `Menyetujui usulan rater rekan sejawat (peer) untuk bawahan: ${evaluee?.nama}.`
      );
    }
  };

  const reject = (item: PendingRaters) => {
    const evaluee = state.employees.find((e) => e.id === item.evalueeId);
    if (!confirm(`Apakah Anda yakin ingin menolak usulan rater rekan sejawat untuk pegawai "${evaluee?.nama || "Bawahan"}"?`)) {
      return;
    }
    const reason = prompt("Masukkan alasan penolakan evaluator:");
    if (!reason) return toast("Alasan penolakan wajib diisi.");
    setState((s) => ({
      ...s,
      pendingRaters: s.pendingRaters.map((p) => (p.id === item.id ? { ...p, status: "Ditolak", rejectionReason: reason } : p)),
    }));
    toast("Usulan evaluator ditolak.");
    if (logAction) {
      logAction(
        user.username || user.nip,
        user.name,
        "Atasan Langsung",
        "Verifikasi Rater",
        `Menolak usulan rater rekan sejawat (peer) untuk bawahan: ${evaluee?.nama} dengan alasan: "${reason}".`
      );
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-black font-display">Verifikasi Evaluator Bawahan</h2>
      <div className="mt-4 space-y-4">
        {items.length === 0 && (
          <Empty title="Belum ada usulan evaluator" text="Bawahan yang mengirim daftar peer evaluator akan muncul di sini." />
        )}
        {items.map((item) => {
          const ev = state.employees.find((e) => e.id === item.evalueeId);
          return (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-black font-display text-slate-900">{ev?.nama}</h3>
                  <p className="text-sm text-slate-500">{ev?.jabatan} • {ev?.unit}</p>
                </div>
                <Badge className={statusClass(item.status)}>{item.status}</Badge>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {item.proposedIds.map((id) => {
                  const p = state.employees.find((e) => e.id === id);
                  return (
                    <div key={id} className="rounded-xl bg-slate-50 p-3 text-sm">
                      <b>{p?.nama}</b>
                      <div className="text-xs text-slate-500">{p?.jabatan}</div>
                    </div>
                  );
                })}
              </div>
              {item.rejectionReason && (
                <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                  Alasan Penolakan: {item.rejectionReason}
                </div>
              )}
              {item.status === "Menunggu Verifikasi" && (
                <div className="mt-4 flex gap-2">
                  <Button variant="success" onClick={() => approve(item)}>Setujui</Button>
                  <Button variant="danger" onClick={() => reject(item)}>Tolak</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------------------------------
// ASSESSMENT PAGE & ASSESSMENTFORM
// ---------------------------------------------
export function Assessment({ state, setState, user, toast, logAction }: PageProps) {
  const employee = state.employees.find((e) => e.id === user.userId);
  const assignments = state.assignments.filter((a) => a.evaluatorId === employee?.id && a.periodId === state.period.id);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);

  if (activeAssignment) {
    return (
      <AssessmentForm
        state={state}
        setState={setState}
        assignment={activeAssignment}
        onBack={() => setActiveAssignment(null)}
        toast={toast}
        logAction={logAction}
        user={user}
      />
    );
  }

  const bawahanAssignments = assignments.filter((a) => a.type === "Bawahan");
  const atasanAssignments = assignments.filter((a) => a.type === "Atasan");
  const peerAssignments = assignments.filter((a) => a.type === "Peer");

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black font-display text-slate-950">Dashboard Evaluasi Kuesioner</h2>
            <p className="mt-1 text-sm text-slate-500">
              Anda memiliki peran evaluasi berdasarkan struktur organisasi dan usulan peer.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-center text-slate-600 shadow-sm animate-fade-in">
              <span className="block text-lg font-black text-slate-950 font-display">{assignments.length}</span>
              Total Evaluasi
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-center text-indigo-700 shadow-sm animate-fade-in">
              <span className="block text-lg font-black text-indigo-950 font-display">
                {assignments.filter((a) => state.responses.some((r) => r.assignmentId === a.id)).length}
              </span>
              Sudah Diisi
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM 1: MENILAI ATASAN */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-indigo-600 animate-pulse" />
              <div>
                <h3 className="font-extrabold font-display text-sm uppercase tracking-wider text-slate-900 leading-none">MENGISI ATASAN</h3>
                <span className="text-[11px] font-semibold text-slate-400">Menilai Atasan Langsung</span>
              </div>
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">{bawahanAssignments.length} Tugas</Badge>
          </div>

          <div className="flex-1 space-y-3">
            {bawahanAssignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center select-none">
                <p className="text-xs text-slate-500 font-bold font-display">Menu Atasan Kosong</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Sesuai ketentuan, karena Anda tidak memiliki atasan langsung di sistem, menu ATASAN akan kosong sehingga Anda tidak perlu menilai atasan.
                </p>
              </div>
            ) : (
              bawahanAssignments.map((a) => {
                const ev = state.employees.find((e) => e.id === a.evalueeId);
                const done = state.responses.some((r) => r.assignmentId === a.id);
                const isKepalaBadan = ev?.role === "Kepala Badan" || ev?.jabatan.toLowerCase() === "kepala badan";
                return (
                  <div key={a.id} className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow duration-200 border-l-4 border-l-indigo-600">
                    <div className="flex items-start justify-between gap-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950 font-display tracking-tight leading-tight group-hover:text-indigo-700 transition">{ev?.nama}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-snug">{ev?.jabatan}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ev?.unit}</p>
                      </div>
                      <Badge className={`text-[9px] py-0 px-1 font-extrabold capitalize ${isKepalaBadan ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-indigo-50 text-indigo-700 border-indigo-100"}`}>
                        {isKepalaBadan ? "Kaban" : "Atasan"}
                      </Badge>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                      <Badge className={`text-[10px] font-extrabold px-2 ${done ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                        {done ? "Selesai" : "Belum Mulai"}
                      </Badge>
                      <Button
                        variant={done ? "secondary" : "primary"}
                        onClick={() => setActiveAssignment(a)}
                        className="h-7 text-xs py-0.5 px-3 rounded-lg font-bold"
                        disabled={done}
                      >
                        {done ? "Terkirim" : "Isi Kuesioner"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KOLOM 2: SEBAGAI ATASAN / MENILAI BAWAHAN */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-emerald-600 animate-pulse" />
              <div>
                <h3 className="font-extrabold font-display text-sm uppercase tracking-wider text-slate-900 leading-none">Sebagai Atasan</h3>
                <span className="text-[11px] font-semibold text-slate-400">Menilai Bawahan Langsung</span>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">{atasanAssignments.length} Tugas</Badge>
          </div>

          <div className="flex-1 space-y-3">
            {atasanAssignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center select-none">
                <p className="text-xs text-slate-500 font-bold font-display">Tidak Mempunyai Bawahan</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Sesuai ketentuan, karena Anda tidak memiliki bawahan langsung dalam struktur organisasi, Anda tidak perlu menilai bawahan.
                </p>
              </div>
            ) : (
              atasanAssignments.map((a) => {
                const ev = state.employees.find((e) => e.id === a.evalueeId);
                const done = state.responses.some((r) => r.assignmentId === a.id);
                return (
                  <div key={a.id} className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow duration-200 border-l-4 border-l-emerald-600">
                    <div className="flex items-start justify-between gap-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950 font-display tracking-tight leading-tight group-hover:text-emerald-700 transition">{ev?.nama}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-snug">{ev?.jabatan}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ev?.unit}</p>
                      </div>
                      <Badge className="text-[9px] py-0 px-1 font-extrabold capitalize bg-emerald-50 text-emerald-700 border-emerald-100">
                        Bawahan
                      </Badge>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                      <Badge className={`text-[10px] font-extrabold px-2 ${done ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                        {done ? "Selesai" : "Belum Mulai"}
                      </Badge>
                      <Button
                        variant={done ? "secondary" : "primary"}
                        onClick={() => setActiveAssignment(a)}
                        className="h-7 text-xs py-0.5 px-3 rounded-lg font-bold"
                        disabled={done}
                      >
                        {done ? "Terkirim" : "Isi Kuesioner"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KOLOM 3: SEBAGAI REKAN SEJAWAT */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-amber-600 animate-pulse" />
              <div>
                <h3 className="font-extrabold font-display text-sm uppercase tracking-wider text-slate-900 leading-none">Rekan Sejawat</h3>
                <span className="text-[11px] font-semibold text-slate-400">Menilai Kolega Setingkat</span>
              </div>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">{peerAssignments.length} Tugas</Badge>
          </div>

          <div className="flex-1 space-y-3">
            {peerAssignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center select-none">
                <p className="text-xs text-slate-500 font-bold font-display">Tidak Ada Rekan Sejawat</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Sesuai ketentuan, jika Anda tidak memiliki usul rater rekan kerja yang disetujui, atau tidak memiliki rekan kerja setingkat, Anda tidak perlu mengisi kolom ini.
                </p>
              </div>
            ) : (
              peerAssignments.map((a) => {
                const ev = state.employees.find((e) => e.id === a.evalueeId);
                const done = state.responses.some((r) => r.assignmentId === a.id);
                return (
                  <div key={a.id} className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow duration-200 border-l-4 border-l-amber-600">
                    <div className="flex items-start justify-between gap-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950 font-display tracking-tight leading-tight group-hover:text-amber-700 transition">{ev?.nama}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-snug">{ev?.jabatan}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ev?.unit}</p>
                      </div>
                      <Badge className="text-[9px] py-0 px-1 font-extrabold capitalize bg-amber-50 text-amber-700 border-amber-100">
                        Peer
                      </Badge>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                      <Badge className={`text-[10px] font-extrabold px-2 ${done ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                        {done ? "Selesai" : "Belum Mulai"}
                      </Badge>
                      <Button
                        variant={done ? "secondary" : "primary"}
                        onClick={() => setActiveAssignment(a)}
                        className="h-7 text-xs py-0.5 px-3 rounded-lg font-bold"
                        disabled={done}
                      >
                        {done ? "Terkirim" : "Isi Kuesioner"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssessmentFormProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  assignment: Assignment;
  onBack: () => void;
  toast: (msg: string) => void;
  logAction?: (username: string, name: string, role: string, action: string, details: string) => void;
  user: DemoAccount;
}

export function AssessmentForm({ state, setState, assignment, onBack, toast, logAction, user }: AssessmentFormProps) {
  const evaluee = state.employees.find((e) => e.id === assignment.evalueeId)!;
  const includeLeadership = ["Struktural", "JPT Pratama", "Administrator", "Pengawas"].includes(evaluee.jenis) || evaluee.hasSub;
  const visibleDims = (state.dimensions || dimensions).filter((d) => includeLeadership || !d.leadershipOnly);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Initialize from draft if it exists in localStorage
  const [scores, setScores] = useState<Record<string, number>>(() => {
    try {
      const draft = localStorage.getItem(`ekinerja-draft-${assignment.id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.scores) return parsed.scores;
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [comments, setComments] = useState<string>(() => {
    try {
      const draft = localStorage.getItem(`ekinerja-draft-${assignment.id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.comments !== undefined) return parsed.comments;
      }
    } catch (e) {
      console.error(e);
    }
    return "";
  });

  const totalQuestions = visibleDims.reduce((sum, d) => sum + d.questions.length, 0);
  const answered = Object.keys(scores).length;
  const pct = Math.round((answered / totalQuestions) * 100);

  const setScore = (key: string, value: number) => {
    setScores((s) => ({ ...s, [key]: value }));
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(
        `ekinerja-draft-${assignment.id}`,
        JSON.stringify({ scores, comments })
      );
      toast("Draf penilaian berhasil disimpan secara lokal.");
    } catch (e) {
      toast("Gagal menyimpan draf penilaian.");
    }
  };

  const autoFill = () => {
    const filled: Record<string, number> = {};
    visibleDims.forEach((d) => {
      d.questions.forEach((_, i) => {
        // High-performing scores 4 or 5
        filled[`${d.key}-${i}`] = Math.random() > 0.35 ? 4 : 5;
      });
    });
    setScores(filled);
    if (!comments.trim()) {
      setComments("Ybs secara konsisten memperlihatkan perilaku berAKHLAK yang luar biasa baik dalam pelayanan publik, integritas akuntabel, serta kolaborasi harmonis dengan seluruh rekan kerja.");
    }
    toast("Kuesioner berhasil diisi otomatis untuk uji coba.");
  };
  
  const submit = () => {
    if (answered < totalQuestions) {
      setShowWarningModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const processSubmit = () => {
    const averagedByDim: Record<string, number> = {};
    visibleDims.forEach((d) => {
      const vals = d.questions.map((_, i) => scores[`${d.key}-${i}`]);
      averagedByDim[d.key] = average(vals);
    });

    setState((s) => ({
      ...s,
      responses: [
        ...s.responses.filter((r) => r.assignmentId !== assignment.id),
        {
          assignmentId: assignment.id,
          scores: averagedByDim,
          comments,
          submittedAt: new Date().toISOString().slice(0, 10),
        },
      ],
      assignments: s.assignments.map((a) => (a.id === assignment.id ? { ...a, status: "Selesai" } : a)),
    }));

    try {
      localStorage.removeItem(`ekinerja-draft-${assignment.id}`);
    } catch (e) {
      console.error(e);
    }

    toast("Penilaian final berhasil dikirim.");
    if (logAction) {
      const isKepala = user.role !== "Admin BKPSDM" && (state.employees.find(e => e.id === user.userId)?.jabatan?.toLowerCase() === "kepala badan" || user.userId === 1);
      const isAtasan = user.role !== "Admin BKPSDM" && state.employees.find(e => e.id === user.userId)?.hasSub;
      const displayRole = user.role === "Admin BKPSDM"
        ? "Admin BKPSDM"
        : isKepala
        ? "Kepala Badan"
        : isAtasan
        ? "Atasan Langsung"
        : "Pegawai ASN";
      
      const typeLabel = assignment.type === "Diri" ? "Diri Sendiri" : assignment.type;
      logAction(
        user.username || user.nip,
        user.name,
        displayRole,
        "Pengisian Kuesioner",
        `Mengisi kuesioner penilaian Kategori: ${typeLabel} untuk pegawai: ${evaluee.nama || "ASN Team"}.`
      );
    }
    setShowConfirmModal(false);
    onBack();
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <div className="flex gap-3">
          <EyeOff className="h-5 w-5 text-blue-700" />
          <p className="text-sm leading-6 text-blue-900">
            <b>Mode anonim aktif.</b> Penilaian Anda dikonversi menjadi data agregat. Identitas Anda dijamin aman.
          </p>
        </div>
      </Card>
      
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button variant="ghost" onClick={onBack}>Kembali</Button>
            <h2 className="mt-3 text-2xl font-black font-display text-slate-950">Kuesioner BerAKHLAK Dairi</h2>
            <p className="text-sm text-slate-500">Menilai: {evaluee.nama} • {evaluee.jabatan}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-slate-200 bg-slate-50 text-slate-700">Progress {pct}%</Badge>
          </div>
        </div>
        <ProgressBar value={pct} className="mt-4" />
      </Card>

      {visibleDims.map((d) => (
        <Card key={d.key}>
          <h3 className="text-lg font-black font-display text-slate-950">
            <span className="mr-2">{d.icon}</span>{d.name}
          </h3>
          <div className="mt-4 space-y-5">
            {d.questions.map((q, i) => (
              <div key={q} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-800 leading-relaxed font-display">{i + 1}. {q}</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setScore(`${d.key}-${i}`, n)}
                      className={`rounded-xl border py-2 text-sm font-black transition font-display ${scores[`${d.key}-${i}`] === n ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-900"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <Field label="Komentar Umum Pengembangan & Feedback Perilaku">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-28 w-full rounded-xl border border-slate-200 p-3"
            placeholder="Tuliskan kekuatan, area pengembangan, dan masukan pembinaan secara profesional."
          />
        </Field>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={saveDraft}>Simpan Draft</Button>
          <Button onClick={submit}>Kirim Penilaian Final</Button>
        </div>
      </Card>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Konfirmasi Kirim Penilaian</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin mengirimkan penilaian final ini untuk <span className="text-slate-800 font-bold">{evaluee.nama}</span>?
            </p>
            <div className="mt-3 rounded bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 leading-snug font-medium">
              💡 <b>Pemberitahuan Sistem:</b> Setelah dikirimkan, penilaian ini akan dikonversi menjadi data agregat anonim demi menjamin kerahasiaan evaluasi. Anda tidak dapat melakukan perubahan atau membatalkan ulasan ini lagi.
            </div>
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <Button type="button" variant="secondary" onClick={() => setShowConfirmModal(false)}>Batal</Button>
              <Button type="button" onClick={processSubmit}>Ya, Kirim Sekarang</Button>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600"></div>
            
            <div className="flex items-start gap-4 mt-1">
              <div className="rounded-full bg-red-100 p-2 text-red-600 shrink-0">
                <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
                  Penilaian Belum Lengkap!
                </h3>
                
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-semibold">
                  Penilaian kuesioner Anda tidak dapat dikirimkan ke server karena masih ada butir pertanyaan yang belum dinilai.
                </p>

                <div className="mt-4 rounded-xl bg-red-50/60 border border-red-100 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-red-950">
                    <span>Kemajuan Pengisian:</span>
                    <span>{pct}% Selesai</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-red-800 font-bold pt-1">
                    <span>Telah Dinilai: {answered} butir</span>
                    <span>Sisa: {totalQuestions - answered} butir</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-relaxed font-medium">
                  Harap lengkapi seluruh butir penilaian dengan memilih skor <strong className="text-slate-800">1 sampai 5</strong> pada setiap dimensi perilaku di atas sebelum melanjutkan pengiriman.
                </p>

                <div className="mt-6 flex justify-end">
                  <Button 
                    type="button" 
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95" 
                    onClick={() => setShowWarningModal(false)}
                  >
                    Lengkapi Penilaian Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------
// RESULTS PAGE
// ---------------------------------------------
function recommendationFor(key?: string): string[] {
  const map: Record<string, string[]> = {
    pelayanan: [
      "Mengikuti bimtek peningkatan standar prima pelayanan publik.",
      "Menyusun matriks responsivitas penanganan pengaduan.",
      "Meningkatkan konsistensi keramahan dalam koordinasi eksternal."
    ],
    akuntabel: [
      "Membuat agenda laporan output terjadwal berkala.",
      "Melakukan dokumentasi digitalisasi rekap dokumen pertanggungjawaban.",
      "Meningkatkan kepatuhan teknis SOP pelayanan internal."
    ],
    kompeten: [
      "Menyusun program mandiri microlearning via platform digital.",
      "Mengambil sertifikasi keahlian fungsional pendukung.",
      "Menginisiasi forum sharing session internal di sub-bidang."
    ],
    harmonis: [
      "Menghadiri coaching penyelesaian perbedaan pandangan organisasi.",
      "Membantu memfasilitasi program teamwork & keakraban kelompok.",
      "Meningkatkan keterbukaan terhadap masukan rekan sejawat."
    ],
    loyal: [
      "Mengikuti penguatan materi nilai-nilai luhur kepatuhan kebangsaan.",
      "Menjaga kerahasiaan otorisasi data instansi (cyber hygiene).",
      "Mendorong penguatan komitmen implementasi visi misi bupati."
    ],
    adaptif: [
      "Mempelajari fungsionalitas sistem aplikasi kepegawaian baru Kabupaten.",
      "Menyusun solusi automasi spreadsheet kerja harian.",
      "Bersikap proaktif mengusulkan penyederhanaan birokrasi tugas."
    ],
    kolaboratif: [
      "Meningkatkan frekuensi pendelegasian silang urusan antar seksi.",
      "Melibatkan rekan dari bidang fungsional dalam tim kerja taktis.",
      "Membuka jalur kerja sama multipihak dalam pengolahan data."
    ],
    kepemimpinan: [
      "Mengikuti program pembinaan manajemen kepemimpinan fungsional.",
      "Melakukan agenda evaluasi bawahan secara berkala dan terdokumentasi.",
      "Membantu penentuan prioritas sasaran sasaran kerja tahunan tim."
    ],
  };
  return map[key || ""] || ["Data penilaian belum lengkap untuk memformulasikan rekomendasi IDP."];
}

export function Results({ state, user }: { state: AppState; user: DemoAccount }) {
  const current = state.employees.find((e) => e.id === user.userId) || state.employees[0];
  const [selectedId, setSelectedId] = useState<number>(current.id);
  
  const canChoose = !!current?.hasSub;
  const options = canChoose ? state.employees.filter((e) => e.atasanId === current.id) : [current];
  const employee = state.employees.find((e) => e.id === selectedId) || current;

  const result = calculateResult(employee, state.assignments, state.responses, state.period, state.dimensions);
  const dims = dimensionScores(employee, state.assignments, state.responses, state.period, state.dimensions);
  
  const scoredDims = dims.filter((d) => d.score > 0);
  const weakest = scoredDims.length > 0 ? [...scoredDims].sort((a, b) => a.score - b.score)[0] : undefined;
  const strongest = scoredDims.length > 0 ? [...scoredDims].sort((a, b) => b.score - a.score)[0] : undefined;
  const recommendations = recommendationFor(weakest?.key);

  const currentComments = state.assignments
    .filter((a) => a.evalueeId === employee.id && a.approved && a.periodId === state.period.id)
    .map((a) => state.responses.find((r) => r.assignmentId === a.id)?.comments)
    .filter((c): c is string => !!c);

  return (
    <div className="space-y-6">
      {canChoose && (
        <Card>
          <Field label="Pilih Bawahan untuk Menampilkan Hasil 360">
            <select
              className="w-full rounded-xl border p-3"
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              <option value={current.id}>{current.nama} (Diri Sendiri)</option>
              {options.map((o) => (
                <option value={o.id} key={o.id}>{o.nama}</option>
              ))}
            </select>
          </Field>
        </Card>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <div className="flex gap-3">
          <EyeOff className="h-5 w-5 text-blue-700" />
          <p className="text-sm leading-6 text-blue-900">
            Hasil kuesioner merupakan representasi dari evaluasi terintegrasi. Identitas evaluator dirahasiakan total.
          </p>
        </div>
      </Card>

      <Card className="border-indigo-200 bg-indigo-50/50 border-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-display">
          <div>
            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
              PERSISTENSI AKTIF EVALUATOR
            </p>
            <h3 className="text-sm font-extrabold text-indigo-950 mt-1 flex items-center gap-1.5">
              <span>⚙️</span> {result.conditionName}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sistem mendeteksi struktur evaluator yang aktif untuk pegawai ini. Rumus perhitungan nilai rata-rata disesuaikan secara otomatis:
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Atasan</div>
              <div className="text-xs font-black text-blue-700 mt-0.5">{result.weightsApplied.Atasan}%</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Sejawat</div>
              <div className="text-xs font-black text-indigo-700 mt-0.5">{result.weightsApplied.Peer}%</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Bawahan</div>
              <div className="text-xs font-black text-emerald-700 mt-0.5">{result.weightsApplied.Bawahan || 0}%</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="bg-slate-950 text-white flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Nilai Akhir Terintegrasi</p>
            <div className="mt-2 text-6xl font-black font-display text-white">{result.final || "-"}</div>
            <Badge className={`mt-4 ${categoryClass(result.category)}`}>{result.category}</Badge>
            
            <div className="mt-5 space-y-2 text-xs border-t border-slate-800 pt-4 text-slate-300 font-sans">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                <span>🧠 Skor Perilaku (360°):</span>
                <span className="font-extrabold text-white text-sm">{result.behaviorScore || "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                <span>📝 Skor Kepatuhan Anda:</span>
                <span className="font-extrabold text-white text-sm">
                  {result.complianceScore}% <span className="text-[10px] font-normal text-slate-400">({result.sudahMenilaiCount}/{result.wajibMenilaiCount} dikerjakan)</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-4 font-sans">
            <p>Pegawai: <b>{employee.nama}</b></p>
            <p>NIP: {employee.nip}</p>
            <p>Jabatan: {employee.jabatan}</p>
            <p>Unit Kerja: {employee.unit}</p>
            <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
              <span>👥</span> Progress Rater Anda: <b>{result.completed}/{result.total}</b> tugas selesai
            </p>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-black font-display">Skor Komparasi Per Dimensi BerAKHLAK</h2>
          <div className="mt-4 space-y-3 font-display">
            {dims.map((d) => (
              <div key={d.key}>
                <div className="mb-1 flex justify-between text-sm font-semibold">
                  <span>{d.icon} {d.name}</span>
                  <span className="text-slate-800">{d.score || "-"}</span>
                </div>
                <ProgressBar value={d.score} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 font-display">
        <Card>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Dimensi Terkuat</h3>
          <p className="mt-2 text-2xl font-black text-emerald-800">{strongest?.name || "Belum tersedia"}</p>
          <p className="text-sm text-slate-500 font-medium">Skor Indeks: {strongest?.score || 0}</p>
        </Card>
        <Card>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Area Prioritas Peningkatan</h3>
          <p className="mt-2 text-2xl font-black text-amber-800">{weakest?.name || "Belum tersedia"}</p>
          <p className="text-sm text-slate-500 font-medium">Skor Indeks: {weakest?.score || 0}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-black font-display mb-3">Rasionalisasi & Rekomendasi Program Individu (IDP)</h2>
        <ul className="space-y-2 text-sm text-slate-700 font-display">
          {recommendations.map((r, i) => (
            <li key={i} className="rounded-xl bg-slate-50 p-3 border border-slate-100 font-medium">
              👉 {r}
            </li>
          ))}
        </ul>
      </Card>

      {currentComments.length > 0 && (
        <Card>
          <h2 className="text-lg font-black font-display mb-3">Catatan Balikan Kualitatif (Anonim)</h2>
          <div className="space-y-2">
            {currentComments.map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-sm">
                "{c}"
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------
// OBJECTIONS PAGE
// ---------------------------------------------
export function Objections({ state, setState, user, toast }: PageProps) {
  const employee = state.employees.find((e) => e.id === user.userId)!;
  const [form, setForm] = useState({ type: "Evaluator belum menilai", reason: "", evidence: "" });

  const visible = user.role === "Admin BKPSDM"
    ? state.objections
    : state.objections.filter((o) => o.evalueeId === employee?.id);

  const submit = () => {
    if (!form.reason.trim()) return toast("Uraian keberatan wajib diisi.");
    setState((s) => ({
      ...s,
      objections: [
        ...s.objections,
        {
          id: Date.now(),
          periodId: s.period.id,
          evalueeId: employee.id,
          type: form.type,
          reason: form.reason.trim(),
          evidence: form.evidence.trim(),
          status: "Diajukan",
          createdAt: new Date().toISOString().slice(0, 10),
          note: "",
        },
      ],
    }));
    setForm({ type: "Evaluator belum menilai", reason: "", evidence: "" });
    toast("Keberatan berhasil diajukan.");
  };

  const updateStatus = (id: number, status: string) => {
    setState((s) => ({
      ...s,
      objections: s.objections.map((o) =>
        o.id === id ? { ...o, status, note: status === "Selesai" ? "Ditindaklanjuti oleh BKPSDM." : o.note } : o
      ),
    }));
    toast(`Status keberatan diperbarui menjadi ${status}.`);
  };

  return (
    <div className="space-y-6">
      {user.role !== "Admin BKPSDM" && (
        <Card>
          <h2 className="text-lg font-black font-display">Ajukan Keberatan Penilaian</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Jenis Keberatan">
              <select className="w-full rounded-xl border p-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Evaluator belum menilai">Evaluator belum menilai (Indikasi Penalti Kepatuhan)</option>
                <option value="Jumlah evaluator tidak terpenuhi">Jumlah rater sejawat tidak memadai</option>
                <option value="Daftar evaluator tidak objektif">Daftar rater memiliki indikasi ketidakobjektifan</option>
                <option value="Dugaan konflik kepentingan">Dugaan konflik kepentingan personal</option>
                <option value="Kendala teknis">Kendala teknis (Sistem Error)</option>
              </select>
            </Field>
            <Field label="Uraian Rinci Keberatan">
              <textarea
                className="min-h-24 w-full rounded-xl border p-3"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Deskripsikan keberatan Anda secara faktual."
              />
            </Field>
            <Field label="Bukti atau Penjelasan Tambahan (URL / Deskripsi)">
              <input
                className="w-full rounded-xl border p-3"
                value={form.evidence}
                onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                placeholder="Masukkan link dokumen pendukung jika ada"
              />
            </Field>
            <Button onClick={submit}>Kirim Keberatan Resmi</Button>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-black font-display">Log Pengajuan Keberatan</h2>
        <div className="mt-4 space-y-3 font-display">
          {visible.map((o) => {
            const ev = state.employees.find((e) => e.id === o.evalueeId);
            return (
              <div key={o.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <b>{ev?.nama || "Dihapus"}</b>
                    <div className="text-xs text-slate-500 font-medium">Jenis: {o.type} • Diajukan: {o.createdAt}</div>
                  </div>
                  <Badge className={statusClass(o.status)}>{o.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed font-semibold">"{o.reason}"</p>
                {o.evidence && <p className="mt-1 text-xs text-slate-500">Bukti: {o.evidence}</p>}
                {o.note && <p className="mt-2 text-xs bg-slate-50 p-2 rounded border text-slate-600"> BKPSDM Note: {o.note}</p>}
                
                {user.role === "Admin BKPSDM" && o.status === "Diajukan" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => updateStatus(o.id, "Diproses")}>Proses</Button>
                    <Button variant="success" onClick={() => updateStatus(o.id, "Selesai")}>Selesaikan</Button>
                    <Button variant="danger" onClick={() => updateStatus(o.id, "Ditolak")}>Tolak</Button>
                  </div>
                )}
              </div>
            );
          })}
          {visible.length === 0 && (
            <Empty title="Belum ada catatan keberatan" text="Setiap berkas keberatan yang didaftarkan akan tampil pada tabel ini." />
          )}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------
// PROGRESS PAGE
// ---------------------------------------------
export function ProgressPage({ state }: { state: AppState }) {
  const [query, setQuery] = useState("");
  const stats = unitStats(state).filter((u) => u.unit.toLowerCase().includes(query.toLowerCase()));

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black font-display">Progress Pengisian Per Unit Kerja</h2>
          <p className="text-sm text-slate-500">Instrumen monitoring real-time kepatuhan penilaian pegawai.</p>
        </div>
        <div className="relative font-display">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            className="rounded-xl border py-2 pl-9 pr-3"
            placeholder="Cari unit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-auto font-display">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3">Unit Kerja</th>
              <th>Total ASN</th>
              <th>Survei Wajib</th>
              <th>Selesai</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((u) => (
              <tr key={u.unit} className="border-b border-slate-100">
                <td className="py-4 font-bold text-slate-900">{u.unit}</td>
                <td>{u.totalAsn}</td>
                <td>{u.totalAssignments}</td>
                <td>{u.completed}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={u.pct} className="w-40" />
                    <b>{u.pct}%</b>
                  </div>
                </td>
                <td>
                  <Badge className={statusClass(u.pct >= 85 ? "Selesai" : u.pct >= 70 ? "Sedang Diisi" : "Belum Mulai")}>
                    {u.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ---------------------------------------------
// REPORTS & ANOMALY PAGE
// ---------------------------------------------
export function UnitProgress({ state, compact = false, period }: { state: AppState; compact?: boolean; period?: Period }) {
  const stats = unitStats(state, period);
  return (
    <div className="space-y-3 font-display">
      {stats.slice(0, compact ? 5 : stats.length).map((u) => (
        <div key={u.unit} className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <b className="text-sm text-slate-900">{u.unit}</b>
            <div className="flex items-center gap-2">
              <Badge className={statusClass(u.pct >= 85 ? "Selesai" : u.pct >= 70 ? "Sedang Diisi" : "Belum Mulai")}>
                {u.status}
              </Badge>
              <span className="text-sm font-black text-slate-950">{u.pct}%</span>
            </div>
          </div>
          <ProgressBar value={u.pct} />
          <div className="mt-2 text-xs text-slate-500 font-medium">
            {u.completed}/{u.totalAssignments} penilaian selesai • Kepatuhan Nilai rata-rata {u.avg || "-"}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Reports({ state, toast }: { state: AppState; toast: (msg: string) => void }) {
  const [tab, setTab] = useState("individu");

  // Multi-period lists and selection state
  const periodsList = state.periods && state.periods.length > 0 ? state.periods : [state.period];
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(state.period);

  React.useEffect(() => {
    const found = (state.periods || []).find(p => p.id === state.period.id) || state.period;
    setSelectedPeriod(found);
  }, [state.period, state.periods]);

  const anomalies = buildAnomalies(state, selectedPeriod);

  // Stats mapped to the selected period range
  const periodAssignments = state.assignments.filter(a => a.periodId === selectedPeriod.id);
  const periodResponses = state.responses.filter(r => periodAssignments.some(a => a.id === r.assignmentId));

  const downloadCSV = () => {
    let title = "";
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tab === "individu") {
      title = `Rekap_Laporan_Perilaku_Individu_ASN_Periode_${selectedPeriod.id}`;
      headers = ["No", "Nama Pegawai", "NIP", "Jabatan", "Unit Kerja", "Progres Rater Selesai", "Skor Perilaku (360°)", "Kepatuhan Anda Menilai", "Nilai Atasan", "Nilai Peer", "Nilai Bawahan", "Nilai Diri", "Nilai Akhir Terintegrasi", "Kategori", "Kondisi Struktur Evaluator", "Konfigurasi Bobot"];
      rows = state.employees.map((e, idx) => {
        const result = calculateResult(e, state.assignments, state.responses, selectedPeriod, state.dimensions);
        return [
          (idx + 1).toString(),
          e.nama,
          e.nip,
          e.jabatan,
          e.unit,
          `${result.completed}/${result.total}`,
          result.behaviorScore.toString(),
          `${result.complianceScore}% (${result.sudahMenilaiCount}/${result.wajibMenilaiCount})`,
          result.atasan.toString(),
          result.peer.toString(),
          result.bawahan.toString(),
          result.self.toString(),
          (result.final || 0).toString(),
          result.category,
          result.conditionName,
          `Atasan:${result.weightsApplied.Atasan}%, Sejawat:${result.weightsApplied.Peer}%, Bawahan:${result.weightsApplied.Bawahan || 0}%`
        ];
      });
    } else if (tab === "unit") {
      title = `Laporan_Kepatuhan_Unit_Kerja_Periode_${selectedPeriod.id}`;
      headers = ["No", "Nama Unit", "Total ASN", "Total Target Penilaian", "Penilaian Selesai", "Selesai (%)", "Kepatuhan Nilai Rata-rata", "Status Kepatuhan"];
      const stats = unitStats(state, selectedPeriod);
      rows = stats.map((u, idx) => [
        (idx + 1).toString(),
        u.unit,
        u.totalAsn.toString(),
        u.totalAssignments.toString(),
        u.completed.toString(),
        u.pct.toString(),
        u.avg.toString(),
        u.status
      ]);
    } else if (tab === "bkpsdm") {
      title = `Ringkasan_Eksekutif_Lembaga_BKPSDM_Periode_${selectedPeriod.id}`;
      headers = ["Metrik", "Nilai/Jumlah"];
      rows = [
        ["Periode Penilaian", `${selectedPeriod.name} (${selectedPeriod.type || "Kustom"})`],
        ["Rentang Filter Tanggal", `${selectedPeriod.start} s.d ${selectedPeriod.end}`],
        ["Total Pegawai Terdaftar", `${state.employees.length} Pegawai`],
        ["Jumlah Kuesioner Terisi Pada Periode Ini", `${periodResponses.length} Kuesioner`],
        ["Target Penilaian yang Belum Diisi Pada Periode Ini", `${periodAssignments.length - periodResponses.length} Target`]
      ];
    } else if (tab === "anomali") {
      title = `Audit_Hasil_Penilaian_Flag_Anomali_Periode_${selectedPeriod.id}`;
      headers = ["No", "Nama Pegawai", "Tipe Anomali", "Total Pengisian", "Tingkat Keparahan", "Saran Tindak Lanjut"];
      rows = anomalies.map((a, idx) => {
        const ev = state.employees.find((e) => e.id === Number(a.id));
        return [
          (idx + 1).toString(),
          ev?.nama || "Dihapus",
          a.type,
          a.count.toString(),
          a.severity,
          "Lakukan peninjauan format objektif penilai/evaluator bersangkutan"
        ];
      });
    }

    // Convert array to CSV string with standard Excel-friendly semicolon separator and BOM
    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const formattedDate = currentDate.split(", ")[1] || currentDate;

    const paddingSize = Math.max(1, headers.length - 4);
    const emptyRow = Array(headers.length).fill("");
    const makeSigRow = (text: string) => {
      const row = Array(headers.length).fill("");
      row[paddingSize] = text;
      return row;
    };

    const sigRows = [
      emptyRow,
      emptyRow,
      makeSigRow(`Sidikalang, ${formattedDate}`),
      makeSigRow("Kepala Badan Kepegawaian dan Pengembangan"),
      makeSigRow("Sumber Daya Manusia Kabupaten Dairi"),
      emptyRow,
      emptyRow,
      emptyRow,
      makeSigRow("Yon Henrik, AP, M.Si"),
      makeSigRow("Pembina Utama Muda"),
      makeSigRow("NIP. 19731019 199311 1 001")
    ];

    const csvContent = "\uFEFF" + [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";"),
      ...rows.map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(";")),
      ...sigRows.map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Berhasil mengunduh laporan ${tab.toUpperCase()} periode ${selectedPeriod.name} dalam format CSV 📊`);
  };

  const downloadExcel = () => {
    let title = "";
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tab === "individu") {
      title = `Rekap Laporan Perilaku Individu ASN (${selectedPeriod.name})`;
      headers = ["No", "Nama Pegawai", "NIP", "Jabatan", "Unit Kerja", "Progres Rater Selesai", "Skor Perilaku (360°)", "Kepatuhan Anda Menilai", "Nilai Atasan", "Nilai Peer", "Nilai Bawahan", "Nilai Diri", "Nilai Akhir Terintegrasi", "Kategori", "Kondisi Struktur Evaluator", "Konfigurasi Bobot"];
      rows = state.employees.map((e, idx) => {
        const result = calculateResult(e, state.assignments, state.responses, selectedPeriod, state.dimensions);
        return [
          (idx + 1).toString(),
          e.nama,
          e.nip,
          e.jabatan,
          e.unit,
          `${result.completed}/${result.total}`,
          result.behaviorScore.toString(),
          `${result.complianceScore}% (${result.sudahMenilaiCount}/${result.wajibMenilaiCount})`,
          result.atasan.toString(),
          result.peer.toString(),
          result.bawahan.toString(),
          result.self.toString(),
          (result.final || 0).toString(),
          result.category,
          result.conditionName,
          `Atasan:${result.weightsApplied.Atasan}%, Sejawat:${result.weightsApplied.Peer}%, Bawahan:${result.weightsApplied.Bawahan || 0}%`
        ];
      });
    } else if (tab === "unit") {
      title = `Laporan Kepatuhan Unit Kerja (${selectedPeriod.name})`;
      headers = ["No", "Nama Unit", "Total ASN", "Total Target Penilaian", "Penilaian Selesai", "Selesai (%)", "Kepatuhan Nilai Rata-rata", "Status Kepatuhan"];
      const stats = unitStats(state, selectedPeriod);
      rows = stats.map((u, idx) => [
        (idx + 1).toString(),
        u.unit,
        u.totalAsn.toString(),
        u.totalAssignments.toString(),
        u.completed.toString(),
        u.pct.toString(),
        u.avg.toString(),
        u.status
      ]);
    } else if (tab === "bkpsdm") {
      title = `Ringkasan Eksekutif Lembaga BKPSDM (${selectedPeriod.name})`;
      headers = ["Metrik", "Nilai/Jumlah"];
      rows = [
        ["Periode Penilaian", `${selectedPeriod.name} (${selectedPeriod.type || "Kustom"})`],
        ["Rentang Filter Tanggal", `${selectedPeriod.start} s.d ${selectedPeriod.end}`],
        ["Total Pegawai Terdaftar", `${state.employees.length} Pegawai`],
        ["Jumlah Kuesioner Terisi Pada Periode Ini", `${periodResponses.length} Kuesioner`],
        ["Target Penilaian yang Belum Diisi Pada Periode Ini", `${periodAssignments.length - periodResponses.length} Kuesioner`]
      ];
    } else if (tab === "anomali") {
      title = `Audit Hasil Penilaian Flag Anomali (${selectedPeriod.name})`;
      headers = ["No", "Nama Pegawai", "Tipe Anomali", "Total Pengisian", "Tingkat Keparahan", "Saran Tindak Lanjut"];
      rows = anomalies.map((a, idx) => {
        const ev = state.employees.find((e) => e.id === Number(a.id));
        return [
          (idx + 1).toString(),
          ev?.nama || "Dihapus",
          a.type,
          a.count.toString(),
          a.severity,
          "Lakukan peninjauan format objektif penilai/evaluator bersangkutan"
        ];
      });
    }

    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const formattedDate = currentDate.split(", ")[1] || currentDate;
    const colSpanLeft = Math.max(1, headers.length - 4);
    const colSpanRight = Math.min(headers.length, 4);

    const tabName = tab.toUpperCase().slice(0, 30);
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${tabName}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          th { background-color: #3B82F6; color: #FFFFFF; font-weight: bold; border: 1px solid #CBD5E1; padding: 10px; }
          td { border: 1px solid #E2E8F0; padding: 8px; }
          .nip-text { mso-number-format:"\\@"; }
          tr:nth-child(even) { background-color: #F8FAFC; }
          .title { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="title">${title}</div>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map((cell, cellIdx) => {
              const isNip = headers[cellIdx]?.toLowerCase() === "nip" || /^\d{15,22}$/.test(cell);
              const attrs = isNip ? ' class="nip-text" style="mso-number-format:\'\\@\'"' : '';
              return `<td${attrs}>${cell}</td>`;
            }).join("")}</tr>`).join("")}
          </tbody>
        </table>
        <br/><br/>
        <table style="border: none; width: 100%;">
          <tr style="border: none; background: none;">
            <td colspan="${colSpanLeft}" style="border: none; background: none;"></td>
            <td colspan="${colSpanRight}" style="border: none; background: none; text-align: left; padding: 10px; font-size: 11px; font-family: Arial, sans-serif;">
              Sidikalang, ${formattedDate}<br/>
              Kepala Badan Kepegawaian dan Pengembangan<br/>
              Sumber Daya Manusia Kabupaten Dairi<br/><br/><br/><br/>
              <strong>Yon Henrik, AP, M.Si</strong><br/>
              Pembina Utama Muda<br/>
              NIP. 19731019 199311 1 001
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Berhasil mengunduh laporan ${tab.toUpperCase()} periode ${selectedPeriod.name} dalam format Excel 💚`);
  };

  const downloadPDF = () => {
    let title = "";
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tab === "individu") {
      title = "Rekap Laporan Perilaku Individu ASN";
      headers = ["No", "Nama Pegawai", "Jabatan", "Unit Kerja", "Progres Rater", "Skor Perilaku 360", "Kepatuhan Menilai", "Nilai Akhir", "Kategori"];
      rows = state.employees.map((e, idx) => {
        const result = calculateResult(e, state.assignments, state.responses, selectedPeriod, state.dimensions);
        return [
          (idx + 1).toString(),
          `${e.nama} (NIP. ${e.nip})`,
          e.jabatan,
          e.unit,
          `${result.completed}/${result.total}`,
          result.behaviorScore.toString(),
          `${result.complianceScore}% (${result.sudahMenilaiCount}/${result.wajibMenilaiCount})`,
          result.final.toString(),
          result.category
        ];
      });
    } else if (tab === "unit") {
      title = "Laporan Kepatuhan Pengisian Per Unit";
      headers = ["No", "Nama Unit", "Total ASN", "Total Target", "Selesai", "Kepatuhan %", "Rata-rata Nilai", "Status"];
      const stats = unitStats(state, selectedPeriod);
      rows = stats.map((u, idx) => [
        (idx + 1).toString(),
        u.unit,
        u.totalAsn.toString(),
        u.totalAssignments.toString(),
        u.completed.toString(),
        u.pct.toString() + "%",
        u.avg.toString(),
        u.status
      ]);
    } else if (tab === "bkpsdm") {
      title = "Ringkasan Eksekutif Lembaga BKPSDM";
      headers = ["Metrik", "Nilai / Jumlah"];
      rows = [
        ["Total Pegawai Terdaftar", `${state.employees.length} Pegawai`],
        ["Jumlah Kuesioner Terisi Pada Periode ini", `${periodResponses.length} Kuesioner`],
        ["Target Penilaian yang Belum Diisi Pada Periode ini", `${periodAssignments.length - periodResponses.length} Target`]
      ];
    } else if (tab === "anomali") {
      title = "Audit Hasil Penilaian - Flag Anomali";
      headers = ["No", "Nama Pegawai", "Tipe Anomali", "Total Pengisian", "Tingkat Keparahan", "Saran Tindak Lanjut"];
      rows = anomalies.map((a, idx) => {
        const ev = state.employees.find((e) => e.id === Number(a.id));
        return [
          (idx + 1).toString(),
          `${ev?.nama || "Dihapus"} (${ev?.nip || "-"})`,
          a.type,
          a.count.toString(),
          a.severity,
          "Lakukan peninjauan format objektif penilai/evaluator bersangkutan"
        ];
      });
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) {
      toast("Gagal memproses cetak PDF.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const printHtml = `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1e293b;
            margin: 40px;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #475569;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 11px;
          }
          th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            border: 1px solid #cbd5e1;
            padding: 10px 8px;
            text-align: left;
          }
          td {
            border: 1px solid #e2e8f0;
            padding: 8px;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
            font-size: 11px;
          }
          .signature-box {
            text-align: left;
            width: 320px;
            line-height: 1.45;
          }
          .signature-name {
            font-weight: bold;
            margin-top: 65px;
          }
          @media print {
            @page {
              size: A4 portrait;
              margin: 20mm;
            }
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 5px;">
            <tr style="border: none; background: none;">
              <td style="width: 14%; text-align: center; vertical-align: middle; border: none; padding: 0;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Dairi_Regency_Emblem.png" style="width: 100px; height: auto; max-width: 100%; display: block; margin: 0 auto;" referrerPolicy="no-referrer" />
              </td>
              <td style="width: 86%; text-align: center; vertical-align: middle; border: none; padding: 0 10px 0 0;">
                <div style="font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #000; margin: 0; line-height: 1.25;">PEMERINTAH KABUPATEN DAIRI</div>
                <div style="font-family: Arial, sans-serif; font-size: 16.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2px; color: #000; margin: 2px 0 0 0; line-height: 1.25;">BADAN KEPEGAWAIAN DAN PENGEMBANGAN</div>
                <div style="font-family: Arial, sans-serif; font-size: 16.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2px; color: #000; margin: 0; line-height: 1.25;">SUMBER DAYA MANUSIA</div>
                <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: normal; color: #000; margin: 4px 0 0 0; line-height: 1.3;">Jalan Ki Hajar Dewantara No. 1 Sidikalang 22211</div>
                <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: normal; color: #000; margin: 1px 0 0 0; line-height: 1.3;">Telepon (0627) 23787 Faksimile (0627) 23787</div>
                <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: normal; color: #000; margin: 1px 0 0 0; line-height: 1.3;">Website : www.dairikab.go.id</div>
              </td>
            </tr>
          </table>
          <div style="border-bottom: 3.5px solid #000; margin-top: 5px; width: 100%;"></div>
          <div style="border-bottom: 1.2px solid #000; margin-top: 2px; margin-bottom: 15px; width: 100%;"></div>

          <div class="title">${title}</div>
          <div style="font-size: 11px; margin-top: 5px; color: #475569; font-weight: bold;">Periode: ${selectedPeriod.name} (${selectedPeriod.start} s.d ${selectedPeriod.end})</div>
        </div>

        <div class="meta-info">
          <div>Program: <strong>Penilaian Perilaku Kerja ASN - 360 Degree Appraisal</strong></div>
          <div>Tanggal Cetak: <strong>${currentDate}</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <p style="margin: 0;">Sidikalang, ${currentDate.split(", ")[1] || currentDate}</p>
            <p style="margin: 0;">Kepala Badan Kepegawaian dan Pengembangan</p>
            <p style="margin: 0;">Sumber Daya Manusia Kabupaten Dairi</p>
            <p class="signature-name" style="margin: 65px 0 0 0; font-weight: bold;">Yon Henrik, AP, M.Si</p>
            <p style="margin: 0;">Pembina Utama Muda</p>
            <p style="margin: 0;">NIP. 19731019 199311 1 001</p>
          </div>
        </div>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(printHtml);
    iframeDoc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);

    toast(`Membuka menu cetak PDF ${title} untuk periode ${selectedPeriod.name} 📄`);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Period Filter Bar */}
      <Card className="border border-sky-100 bg-sky-50/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-display">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-sky-600 stroke-[2.5]" />
              Saringan Berdasarkan Periode
            </h3>
            <p className="text-xs text-slate-500 font-medium">Ubah pilihan saringan periode di bawah ini untuk menampilkan rekap, statistik kelulusan, audit anomali, s.d cetak laporan sesuai sasaran.</p>
          </div>
          <div className="w-full md:w-[320px]">
            <select
              className="w-full rounded-xl border border-slate-200 p-3 font-semibold text-sm bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500"
              value={selectedPeriod.id}
              onChange={(e) => {
                const found = periodsList.find(p => p.id === Number(e.target.value));
                if (found) setSelectedPeriod(found);
              }}
            >
              {periodsList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type || "Custom"})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t pt-3 text-xs text-slate-500 font-medium">
          <div>Tipe Rentang: <span className="font-extrabold text-slate-800">{selectedPeriod.type || "Custom / Manual"}</span></div>
          <div>Mulai Selesai: <span className="font-extrabold text-slate-800">{selectedPeriod.start} s.d {selectedPeriod.end}</span></div>
          <div>Status Penilaian: <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
            selectedPeriod.status === "Aktif" ? "bg-emerald-100 text-emerald-800" :
            selectedPeriod.status === "Final" ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-800"
          }`}>{selectedPeriod.status}</span></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          {([
            ["individu", "Laporan Individu"],
            ["unit", "Laporan Kepatuhan Unit"],
            ["bkpsdm", "Lembaga BKPSDM"],
            ["anomali", "Flag Anomali Nilai"]
          ] as const).map(([k, l]) => (
            <Button key={k} variant={tab === k ? "primary" : "secondary"} onClick={() => setTab(k)}>
              {l}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-black font-display text-slate-900">
            {tab === "individu"
              ? "Rekap Laporan Perilaku Individu ASN"
              : tab === "unit"
              ? "Status Penyerapan Pengisian Unit"
              : tab === "anomali"
              ? "Audit Hasil Penilaian - Flag Anomali"
              : "Ringkasan Eksekutif Kepegawaian"}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={downloadPDF}>Formulir PDF</Button>
            <Button variant="secondary" onClick={downloadExcel}>Rekap Excel</Button>
            <Button variant="secondary" onClick={downloadCSV}>Data CSV</Button>
          </div>
        </div>

        {tab === "individu" && (
          <div className="overflow-auto font-display">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3">Nama Pegawai / Jabatan</th>
                  <th>Unit Kerja</th>
                  <th>Progres Rater</th>
                  <th>Kepatuhan Menilai (Anda)</th>
                  <th>Kondisi & Bobot</th>
                  <th>Skor Perilaku (360)</th>
                  <th>Nilai Akhir</th>
                  <th>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {state.employees.map((e) => {
                  const result = calculateResult(e, state.assignments, state.responses, selectedPeriod, state.dimensions);
                  return (
                    <tr key={e.id} className="border-b border-slate-100 text-xs text-slate-700">
                      <td className="py-3 pr-2">
                        <div className="font-extrabold text-slate-900 leading-normal">{e.nama}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {e.nip}</div>
                        <div className="text-[10px] text-indigo-600 font-medium leading-normal mt-0.5">{e.jabatan}</div>
                      </td>
                      <td className="max-w-[150px] truncate" title={e.unit}>{e.unit}</td>
                      <td>
                        <div className="font-bold text-slate-800">{result.completed}/{result.total}</div>
                        <div className="text-[10px] text-slate-400">Rater Selesai</div>
                      </td>
                      <td>
                        <div className="font-extrabold text-slate-800">{result.complianceScore}%</div>
                        <div className="text-[10px] text-slate-500">({result.sudahMenilaiCount}/{result.wajibMenilaiCount} Dinilai)</div>
                      </td>
                      <td>
                        <div className="text-[11px] font-extrabold text-indigo-950">Code {result.conditionCode}</div>
                        <div className="text-[10px] bg-slate-100/80 text-slate-800 px-1.5 py-0.5 mt-1 rounded border font-mono font-bold inline-block">
                          {result.weightsApplied.Atasan}/{result.weightsApplied.Peer}/{result.weightsApplied.Bawahan || 0}
                        </div>
                      </td>
                      <td className="font-bold text-center">{result.behaviorScore || "-"}</td>
                      <td className="font-black text-center text-[13px] text-slate-950">{result.final || "-"}</td>
                      <td>
                        <Badge className={`${categoryClass(result.category)} font-bold text-[10px] pr-2`}>{result.category}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "unit" && <UnitProgress state={state} period={selectedPeriod} />}

        {tab === "bkpsdm" && (
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={Users} label="Total Pegawai Terdaftar" value={state.employees.length} />
            <StatCard icon={CheckCircle2} label="Jumlah Kuesioner Terisi (Periode)" value={periodResponses.length} tone="emerald" />
            <StatCard icon={AlertTriangle} label="Target Penilaian yang Belum Diisi (Periode)" value={periodAssignments.length - periodResponses.length} tone="red" />
          </div>
        )}

        {tab === "anomali" && (
          <div className="space-y-3 font-display">
            {anomalies.map((a) => {
              const ev = state.employees.find((e) => e.id === Number(a.id));
              return (
                <div key={`${a.id}-${a.type}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <b className="text-slate-900">{ev?.nama || "Dihapus"}</b>
                      <div className="text-sm text-slate-500 font-semibold">{a.type} • {a.count} pengisian dilakukan</div>
                    </div>
                    <Badge className={statusClass(a.severity === "Anomali" ? "Belum Mulai" : "Sedang Diisi")}>
                      {a.severity}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                    Saran Tindak Lanjut: Lakukan peninjauan format objektif penilai/evaluator bersangkutan untuk menguji kejujuran.
                  </p>
                </div>
              );
            })}
            {anomalies.length === 0 && (
              <Empty title="Aman dari anomali" text="Belum ada indikasi pengisian tidak seimbang (pemberian nilai sempurna tanpa deviasi)." />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------
// CHANGE PASSWORD PAGE
// ---------------------------------------------
interface ChangePasswordProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  user: DemoAccount;
  setUser: React.Dispatch<React.SetStateAction<DemoAccount | null>>;
  toast: (msg: string) => void;
}

export function ChangePasswordPage({ state, setState, user, setUser, toast }: ChangePasswordProps) {
  const isAdmin = user.role === "Admin BKPSDM";
  const employee = !isAdmin ? state.employees.find((e) => e.id === user.userId) : null;
  const adminAccount = isAdmin ? (state.admins || []).find((a) => a.username === (user.username || "admin")) : null;

  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);

  const save = () => {
    if (!confirm("Apakah Anda yakin ingin memperbarui dan menyimpan password baru Anda?")) {
      return;
    }
    if (isAdmin) {
      if (!adminAccount) return toast("Sesi admin tidak ditemukan.");
      const currentPassword = adminAccount.password || "admin123";
      if (form.current !== currentPassword) return toast("Password lama anda keliru.");
      if (!form.next || form.next.length < 6) return toast("Password baru harus minimal 6 karakter.");
      if (form.next !== form.confirm) return toast("Password konfirmasi anda belum sama.");
      if (form.next === currentPassword) return toast("Password baru tidak boleh sama dengan password lama.");

      setState((s) => ({
        ...s,
        admins: (s.admins || []).map((a) => (a.username === adminAccount.username ? { ...a, password: form.next } : a)),
      }));
      setUser({ ...user, password: form.next });
      setForm({ current: "", next: "", confirm: "" });
      toast("Password Admin berhasil diperbarui.");
    } else {
      if (!employee) return toast("Sesi akun tidak valid.");
      const currentPassword = employee.password || "admin123";
      if (form.current !== currentPassword) return toast("Password lama anda keliru.");
      if (!form.next || form.next.length < 6) return toast("Password baru harus minimal 6 karakter.");
      if (form.next !== form.confirm) return toast("Password konfirmasi anda belum sama.");
      if (form.next === currentPassword) return toast("Password baru tidak boleh sama dengan password lama.");

      setState((s) => ({
        ...s,
        employees: s.employees.map((e) => (e.id === employee.id ? { ...e, password: form.next } : e)),
      }));
      setUser({ ...user, password: form.next });
      setForm({ current: "", next: "", confirm: "" });
      toast("Password Anda berhasil diperbarui.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <div className="flex gap-3">
          <Lock className="mt-1 h-5 w-5 text-blue-700" />
          <div>
            <h2 className="font-black text-blue-950 font-display">Ubah Kredensial Pengguna</h2>
            <p className="mt-1 text-sm leading-6 text-blue-900">
              Silakan amankan password login periodik anda secara konsisten.
            </p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="mb-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Akun Berjalan</p>
          <h3 className="mt-1 font-black text-slate-900 font-display">{employee?.nama || user.name}</h3>
          <p className="text-sm text-slate-500">Username: {employee?.username || employee?.nip || user.nip} • Role: {user.role}</p>
        </div>
        
        <div className="space-y-4">
          <Field label="Password Lama">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-xl border p-3"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              placeholder="Sandi lama Anda"
            />
          </Field>
          <Field label="Password Baru">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-xl border p-3"
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
              placeholder="Minimal 6 karakter"
            />
          </Field>
          <Field label="Ulangi Password Baru">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-xl border p-3"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Ulangi isian"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 font-display">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> 
            Tampilkan sandi tulisan
          </label>
        </div>
        
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={save}>Kunci Password Baru</Button>
          <Button variant="secondary" onClick={() => setForm({ current: "", next: "", confirm: "" })}>Bersihkan</Button>
        </div>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { AppState, DemoAccount, Period, Assignment, Employee } from "./types";
import { initialState } from "./data";
import { ThemeStyles, Toast, Card, Field, Button, Badge } from "./components/UIComponents";
import { Login, Sidebar, Topbar } from "./components/AuthComponents";
import { DashboardView } from "./components/DashboardView";
import { DeadlineWarningBanner } from "./components/DeadlineWarningBanner";
import { syncMandatoryAssignments, assignmentsEqual, isEligiblePeer } from "./utils";
import {
  Profile,
  RaterManagement,
  Verification,
  Assessment,
  Results,
  ProgressPage,
  Reports,
  ChangePasswordPage,
} from "./components/UserPages";
import { DataASNPage, UnitCrudPage, JobCrudPage, DimensionCrudPage } from "./components/AdminPages";
import { UserManualPage } from "./components/UserManualPage";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveRemoteState,
  fetchRemoteState,
  getSupabaseSQLScript,
  checkServerConfig
} from "./utils/supabase";
import { Database, CloudLightning, Copy, Check, Server, RefreshCw, AlertCircle, HelpCircle, Calendar, Trash2, Plus, RotateCcw } from "lucide-react";

const STORAGE_KEY = "bkpsdm-dairi-360-app-v2";

const MONTHS_LIST = [
  { value: "01", name: "Januari" },
  { value: "02", name: "Februari" },
  { value: "03", name: "Maret" },
  { value: "04", name: "April" },
  { value: "05", name: "Mei" },
  { value: "06", name: "Juni" },
  { value: "07", name: "Juli" },
  { value: "08", name: "Agustus" },
  { value: "09", name: "September" },
  { value: "10", name: "Oktober" },
  { value: "11", name: "November" },
  { value: "12", name: "Desember" }
];

const QUARTERS_LIST = [
  { value: "Q1", name: "Triwulan I (Januari - Maret)", start: "01-01", end: "03-31" },
  { value: "Q2", name: "Triwulan II (April - Juni)", start: "04-01", end: "06-30" },
  { value: "Q3", name: "Triwulan III (Juli - September)", start: "07-01", end: "09-30" },
  { value: "Q4", name: "Triwulan IV (Oktober - Desember)", start: "10-01", end: "12-31" }
];

const getLastDayOfMonth = (year: number, monthStr: string) => {
  const m = parseInt(monthStr, 10);
  return new Date(year, m, 0).getDate();
};

// ---------------------------------------------
// SETTINGS PAGE
// ---------------------------------------------
interface SettingsPageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
}

function SettingsPage({ state, setState, toast }: SettingsPageProps) {
  const [period, setPeriod] = useState<Period>(() => ({
    type: "Custom",
    selectedMonth: "05",
    selectedQuarter: "Q2",
    selectedYear: 2026,
    ...state.period
  }));

  const [copyDemoData, setCopyDemoData] = useState(true);
  const [activeWeightTab, setActiveWeightTab] = useState<"cond1" | "cond2" | "cond3" | "cond4" | "cond5">("cond1");

  // Supabase states
  const [dbConfig, setDbConfig] = useState(() => getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; text: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form field inputs
  const [urlInput, setUrlInput] = useState(dbConfig.url);
  const [anonKeyInput, setAnonKeyInput] = useState(dbConfig.anonKey);
  const [tableInput, setTableInput] = useState(dbConfig.tableName);
  const [enabledInput, setEnabledInput] = useState(dbConfig.isEnabled);

  const setPeriodType = (type: "Bulanan" | "Triwulan" | "Custom") => {
    const year = period.selectedYear || 2026;
    let name = period.name;
    let start = period.start;
    let end = period.end;
    let selectedMonth = period.selectedMonth || "05";
    let selectedQuarter = period.selectedQuarter || "Q2";

    if (type === "Bulanan") {
      const monthObj = MONTHS_LIST.find(m => m.value === selectedMonth) || MONTHS_LIST[4];
      const lastDay = getLastDayOfMonth(year, monthObj.value);
      start = `${year}-${monthObj.value}-01`;
      end = `${year}-${monthObj.value}-${lastDay < 10 ? '0' : ''}${lastDay}`;
      name = `Periode Bulanan ${monthObj.name} ${year}`;
    } else if (type === "Triwulan") {
      const qObj = QUARTERS_LIST.find(q => q.value === selectedQuarter) || QUARTERS_LIST[1];
      const startParts = qObj.start.split("-");
      const endParts = qObj.end.split("-");
      start = `${year}-${startParts[0]}-${startParts[1]}`;
      end = `${year}-${endParts[0]}-${endParts[1]}`;
      name = `Periode ${qObj.name} ${year}`;
    }

    setPeriod({
      ...period,
      type,
      name,
      start,
      end,
      selectedMonth,
      selectedQuarter,
      selectedYear: year
    });
  };

  const handleMonthChange = (monthVal: string) => {
    const year = period.selectedYear || 2026;
    const monthObj = MONTHS_LIST.find(m => m.value === monthVal) || MONTHS_LIST[4];
    const lastDay = getLastDayOfMonth(year, monthVal);
    const start = `${year}-${monthVal}-01`;
    const end = `${year}-${monthVal}-${lastDay < 10 ? '0' : ''}${lastDay}`;
    const name = `Periode Bulanan ${monthObj.name} ${year}`;

    setPeriod({
      ...period,
      selectedMonth: monthVal,
      name,
      start,
      end
    });
  };

  const handleQuarterChange = (quarterVal: string) => {
    const year = period.selectedYear || 2026;
    const qObj = QUARTERS_LIST.find(q => q.value === quarterVal) || QUARTERS_LIST[1];
    const startParts = qObj.start.split("-");
    const endParts = qObj.end.split("-");
    const start = `${year}-${startParts[0]}-${startParts[1]}`;
    const end = `${year}-${endParts[0]}-${endParts[1]}`;
    const name = `Periode ${qObj.name} ${year}`;

    setPeriod({
      ...period,
      selectedQuarter: quarterVal,
      name,
      start,
      end
    });
  };

  const handleYearChange = (yearVal: number) => {
    let name = period.name;
    let start = period.start;
    let end = period.end;

    if (period.type === "Bulanan") {
      const monthVal = period.selectedMonth || "05";
      const monthObj = MONTHS_LIST.find(m => m.value === monthVal) || MONTHS_LIST[4];
      const lastDay = getLastDayOfMonth(yearVal, monthVal);
      start = `${yearVal}-${monthVal}-01`;
      end = `${yearVal}-${monthVal}-${lastDay < 10 ? '0' : ''}${lastDay}`;
      name = `Periode Bulanan ${monthObj.name} ${yearVal}`;
    } else if (period.type === "Triwulan") {
      const quarterVal = period.selectedQuarter || "Q2";
      const qObj = QUARTERS_LIST.find(q => q.value === quarterVal) || QUARTERS_LIST[1];
      const startParts = qObj.start.split("-");
      const endParts = qObj.end.split("-");
      start = `${yearVal}-${startParts[0]}-${startParts[1]}`;
      end = `${yearVal}-${endParts[0]}-${endParts[1]}`;
      name = `Periode ${qObj.name} ${yearVal}`;
    }

    setPeriod({
      ...period,
      selectedYear: yearVal,
      name,
      start,
      end
    });
  };

  const saveConfig = () => {
    const updated = {
      url: urlInput.trim(),
      anonKey: anonKeyInput.trim(),
      tableName: tableInput.trim() || "bkpsdm_360_state",
      isEnabled: enabledInput,
    };
    saveSupabaseConfig(updated);
    setDbConfig(updated);
    toast("Konfigurasi DB Supabase berhasil disimpan secara lokal.");
  };

  const handleTestConnection = async () => {
    const url = urlInput.trim();
    const key = anonKeyInput.trim();
    const table = tableInput.trim() || "bkpsdm_360_state";

    if (!url || !key) {
      setTestResult({
        success: false,
        text: "Gagal: Masukkan URL Supabase dan API Anon Key terlebih dahulu.",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(url, key, table);
      setTestResult({
        success: res.success,
        text: res.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        text: `Error sewaktu menghubungkan: ${err?.message || err}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleExportDataNow = async () => {
    const url = urlInput.trim();
    const key = anonKeyInput.trim();
    const table = tableInput.trim() || "bkpsdm_360_state";

    if (!url || !key) {
      toast("Harap hubungkan dan simpan konfigurasi database Anda terlebih dahulu.");
      return;
    }

    if (
      !confirm(
        `Lanjutkan ekspor data? Seluruh state penilai, ASN (${state.employees.length} orang), dan rekap penilaian akan dipindahkan ke cloud Supabase Anda di tabel '${table}'.`
      )
    ) {
      return;
    }

    setExporting(true);
    try {
      const success = await saveRemoteState(state);
      if (success) {
        toast("Sukses besar! Seluruh data simulasi BKPSDM berhasil diunggah dan sinkron di Cloud Supabase. ☁️⚡");
      } else {
        toast("Gagal melakukan penulisan. Pastikan Anda telah menjalankan script SQL pembuatan tabel di Supabase.");
      }
    } catch (err: any) {
      toast(`Gagal: ${err?.message || err}`);
    } finally {
      setExporting(false);
    }
  };

  const sqlScript = getSupabaseSQLScript(tableInput || "bkpsdm_360_state");

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
    toast("Script SQL berhasil disalin ke clipboard!");
  };

  const save = () => {
    const w = period.weightsWithSub;
    const n = period.weightsNoSub;
    const c3 = period.weightsCond3 || { Atasan: 75, Peer: 0, Bawahan: 25 };
    const c4 = period.weightsCond4 || { Atasan: 100, Peer: 0, Bawahan: 0 };
    const c5 = period.weightsCond5 || { Atasan: 0, Peer: 0, Bawahan: 100 };

    if (w.Atasan + w.Peer + (w.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 1 (Ada Atasan, Ada Sejawat, Ada Bawahan) harus 100%.");
    }
    if (n.Atasan + n.Peer !== 100) {
      return toast("Total bobot Kondisi 2 (Ada Atasan, Ada Sejawat, Tanpa Bawahan) harus 100%.");
    }
    if (c3.Atasan + (c3.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 3 (Ada Atasan, Tanpa Sejawat, Ada Bawahan) harus 100%.");
    }
    if (c4.Atasan !== 100) {
      return toast("Total bobot Kondisi 4 (Ada Atasan, Tanpa Sejawat, Tanpa Bawahan) harus 100% pada Atasan.");
    }
    if ((c5.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 5 (Tanpa Atasan, Tanpa Sejawat, Ada Bawahan) harus 100% pada Bawahan.");
    }
    if (period.minPeer < 1 || period.maxPeer > 12 || period.minPeer > period.maxPeer) {
      return toast("Aturan rekan sejawat (Peer) harus valid (Minimal 1, maksimal 12).");
    }
    if (!period.maxBawahan || period.maxBawahan < 1 || period.maxBawahan > 30) {
      return toast("Batas maksimal bawahan penilai atasannya wajib bernilai 1 s.d. 30.");
    }
    if (period.end <= period.start) {
      return toast("Tanggal selesai harus melampaui tanggal mulai.");
    }

    const compiledPeriodObj = {
      ...period,
      weightsCond3: c3,
      weightsCond4: c4,
      weightsCond5: c5
    };

    setState((s) => {
      const currentList = s.periods || [];
      const existsIndex = currentList.findIndex(p => p.id === period.id);
      let updatedList = [...currentList];

      if (existsIndex >= 0) {
        updatedList[existsIndex] = compiledPeriodObj;
      } else {
        updatedList.push(compiledPeriodObj);
      }

      const isActiveEdited = s.period.id === period.id;
      return {
        ...s,
        period: isActiveEdited ? compiledPeriodObj : s.period,
        periods: updatedList
      };
    });

    toast(`Setelan periodik '${period.name}' berhasil disimpan.`);
  };

  const saveAsNew = () => {
    const w = period.weightsWithSub;
    const n = period.weightsNoSub;
    const c3 = period.weightsCond3 || { Atasan: 75, Peer: 0, Bawahan: 25 };
    const c4 = period.weightsCond4 || { Atasan: 100, Peer: 0, Bawahan: 0 };
    const c5 = period.weightsCond5 || { Atasan: 0, Peer: 0, Bawahan: 100 };

    if (w.Atasan + w.Peer + (w.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 1 (Ada Atasan, Ada Sejawat, Ada Bawahan) harus 100%.");
    }
    if (n.Atasan + n.Peer !== 100) {
      return toast("Total bobot Kondisi 2 (Ada Atasan, Ada Sejawat, Tanpa Bawahan) harus 100%.");
    }
    if (c3.Atasan + (c3.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 3 (Ada Atasan, Tanpa Sejawat, Ada Bawahan) harus 100%.");
    }
    if (c4.Atasan !== 100) {
      return toast("Total bobot Kondisi 4 (Ada Atasan, Tanpa Sejawat, Tanpa Bawahan) harus 100% pada Atasan.");
    }
    if ((c5.Bawahan || 0) !== 100) {
      return toast("Total bobot Kondisi 5 (Tanpa Atasan, Tanpa Sejawat, Ada Bawahan) harus 100% pada Bawahan.");
    }
    if (period.minPeer < 1 || period.maxPeer > 12 || period.minPeer > period.maxPeer) {
      return toast("Aturan rekan sejawat (Peer) harus valid (Minimal 1, maksimal 12).");
    }
    if (!period.maxBawahan || period.maxBawahan < 1 || period.maxBawahan > 30) {
      return toast("Batas maksimal bawahan penilai atasannya wajib bernilai 1 s.d. 30.");
    }
    if (period.end <= period.start) {
      return toast("Tanggal selesai harus melampaui tanggal mulai.");
    }

    const currentList = state.periods || [];
    const newId = Math.max(0, ...currentList.map(p => p.id)) + 1;
    const newPeriodObj = {
      ...period,
      weightsCond3: c3,
      weightsCond4: c4,
      weightsCond5: c5,
      id: newId
    };

    setState((s) => {
      const updatedList = [...(s.periods || []), newPeriodObj];
      let newAssignments = [...s.assignments];
      let newResponses = [...s.responses];

      if (copyDemoData) {
        const sourcePeriodId = s.period.id;
        const subset = s.assignments.filter(a => a.periodId === sourcePeriodId);
        
        subset.forEach((sub) => {
          const newAssId = Math.max(0, ...newAssignments.map(x => x.id)) + 1;
          newAssignments.push({
            ...sub,
            id: newAssId,
            periodId: newId
          });

          const resp = s.responses.find(r => r.assignmentId === sub.id);
          if (resp) {
            newResponses.push({
              ...resp,
              assignmentId: newAssId
            });
          }
        });
      }

      return {
        ...s,
        period: newPeriodObj,
        periods: updatedList,
        assignments: newAssignments,
        responses: newResponses
      };
    });

    setPeriod(newPeriodObj);
    toast(`Periode baru '${newPeriodObj.name}' berhasil disimpan dan dijadikan periode aktif!`);
  };

  const makeActive = (p: Period) => {
    setState((s) => ({
      ...s,
      period: p
    }));
    setPeriod(p);
    toast(`Periode '${p.name}' sekarang aktif dan digunakan secara global.`);
  };

  const deletePeriod = (p: Period) => {
    if (p.id === state.period.id) {
      return toast("Tidak dapat menghapus periode yang saat ini sedang aktif secara global.");
    }
    if (!confirm(`Hapus periode '${p.name}' beserta seluruh target penilaian & respons di dalamnya?`)) {
      return;
    }

    setState((s) => {
      const updatedList = (s.periods || []).filter(item => item.id !== p.id);
      const updatedAssignments = s.assignments.filter(a => a.periodId !== p.id);
      const updatedResponses = s.responses.filter(r => !s.assignments.some(a => a.periodId === p.id && a.id === r.assignmentId));
      return {
        ...s,
        periods: updatedList,
        assignments: updatedAssignments,
        responses: updatedResponses
      };
    });

    toast(`Periode '${p.name}' berhasil dihapus.`);
  };

  const resetPeriodData = () => {
    if (!confirm(`⚠️ PERINGATAN: Apakah Anda yakin ingin mereset seluruh penilaian, kuesioner, hasil nilai, dan daftar nama evaluator sejawat (Peer) untuk periode "${period.name}" ke kondisi awal?\n\nTindakan ini menghapus seluruh jawaban kuesioner dan usulan rater sejawat pada periode ini. Tindakan ini permanen dan tidak dapat dibatalkan.`)) {
      return;
    }

    setState((s) => {
      const targetAssignmentIds = new Set(
        s.assignments
          .filter((a) => a.periodId === period.id)
          .map((a) => a.id)
      );

      const nextResponses = s.responses.filter((r) => !targetAssignmentIds.has(r.assignmentId));

      const nextAssignments = s.assignments
        .filter((a) => !(a.periodId === period.id && a.type === "Peer"))
        .map((a) => {
          if (a.periodId === period.id) {
            return { ...a, status: "Belum Mulai" };
          }
          return a;
        });

      return {
        ...s,
        responses: nextResponses,
        assignments: nextAssignments,
        pendingRaters: []
      };
    });

    toast(`Sukses! Semua kuesioner dan usulan rater pada periode '${period.name}' telah di-reset ke awal.`);
  };

  const activePeriodsList = state.periods || [];

  return (
    <div className="space-y-6">
      {/* SECTION 1: SYSTEM PERIOD SETTINGS */}
      <Card>
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-700" />
              Setelan Periode & Kepatuhan
            </h2>
            <p className="text-xs text-slate-500 font-medium">Atur tipe periode penilaian: triwulanan, bulanan, atau tentukan rentang tanggal sendiri.</p>
          </div>
          <Badge className="bg-sky-100 text-sky-800 border-none text-xs font-bold leading-none py-1.5 px-2.5">
            Periode Aktif ID: {state.period.id}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Field label="Tipe Periode">
            <select
              className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
              value={period.type || "Custom"}
              onChange={(e) => setPeriodType(e.target.value as any)}
            >
              <option value="Custom">Manual (Rentang Tanggal Kustom)</option>
              <option value="Bulanan">Bulanan (Dropdown Bulan & Tahun)</option>
              <option value="Triwulan">Triwulan (Dropdown Akumulasi 3 Bulan)</option>
            </select>
          </Field>

          <Field label="Status Operasional">
            <select
              className="w-full rounded-xl border p-3 font-semibold text-sm bg-white animate-scale-up"
              value={period.status}
              onChange={(e) => setPeriod({ ...period, status: e.target.value })}
            >
              <option value="Draft">Draft</option>
              <option value="Aktif">Aktif</option>
              <option value="Ditutup">Ditutup</option>
              <option value="Final">Final (Laporan Dikunci)</option>
            </select>
          </Field>

          {/* Conditional Controls based on selected type */}
          {period.type === "Bulanan" && (
            <>
              <Field label="Pilih Bulan">
                <select
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={period.selectedMonth || "05"}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m.value} value={m.value}>{m.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pilih Tahun">
                <input
                  type="number"
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={period.selectedYear || 2026}
                  onChange={(e) => handleYearChange(parseInt(e.target.value, 10) || 2026)}
                />
              </Field>
            </>
          )}

          {period.type === "Triwulan" && (
            <>
              <Field label="Pilih Kuartal / Triwulan">
                <select
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={period.selectedQuarter || "Q2"}
                  onChange={(e) => handleQuarterChange(e.target.value)}
                >
                  {QUARTERS_LIST.map((q) => (
                    <option key={q.value} value={q.value}>{q.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pilih Tahun">
                <input
                  type="number"
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={period.selectedYear || 2026}
                  onChange={(e) => handleYearChange(parseInt(e.target.value, 10) || 2026)}
                />
              </Field>
            </>
          )}

          <Field label="Judul Periode">
            <input
              className={`w-full rounded-xl border p-3 font-semibold text-sm ${period.type !== "Custom" ? "bg-slate-50 text-slate-600" : ""}`}
              value={period.name}
              disabled={period.type !== "Custom"}
              onChange={(e) => setPeriod({ ...period, name: e.target.value })}
              placeholder="Masukkan judul untuk tipe manual"
            />
          </Field>

          {period.type === "Custom" && (
            <>
              <Field label="Mulai Tanggal">
                <input
                  type="date"
                  className="w-full rounded-xl border p-3 font-semibold text-sm"
                  value={period.start}
                  onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                />
              </Field>
              <Field label="Selesai Tanggal">
                <input
                  type="date"
                  className="w-full rounded-xl border p-3 font-semibold text-sm"
                  value={period.end}
                  onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                />
              </Field>
            </>
          )}

          {period.type !== "Custom" && (
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-amber-50 md:p-4 p-3 border border-amber-100 flex items-start gap-2.5 font-display text-sm text-amber-800">
              <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                Rentang Pengisian Periode ini: <strong>{period.start}</strong> s.d <strong>{period.end}</strong> (Otomatis berdasarkan pilihan drop down).
              </div>
            </div>
          )}

          <Field label="Minimal Peer Rater (Rekan Sejawat)">
            <input
              type="number"
              className="w-full rounded-xl border p-3 font-semibold text-sm"
              value={period.minPeer}
              onChange={(e) => setPeriod({ ...period, minPeer: Number(e.target.value) })}
            />
          </Field>
          <Field label="Maksimal Peer Rater (Rekan Sejawat)">
            <input
              type="number"
              className="w-full rounded-xl border p-3 font-semibold text-sm"
              value={period.maxPeer}
              onChange={(e) => setPeriod({ ...period, maxPeer: Number(e.target.value) })}
            />
          </Field>
          <Field label="Maksimal Bawahan Penilai Atasan">
            <input
              type="number"
              className="w-full rounded-xl border p-3 font-semibold text-sm animate-scale-up"
              value={period.maxBawahan || 5}
              onChange={(e) => setPeriod({ ...period, maxBawahan: Number(e.target.value) })}
            />
          </Field>

          <div className="col-span-1 md:col-span-3 pt-2 grid gap-4 grid-cols-1 md:grid-cols-3 border-t border-slate-100 mt-2">
            <div className="rounded-xl border p-4 bg-slate-50 border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 mt-1 cursor-pointer"
                  checked={!!period.enforceMaxBawahan}
                  onChange={(e) => setPeriod({ ...period, enforceMaxBawahan: e.target.checked })}
                />
                <div className="font-display">
                  <span className="block font-bold text-sm text-slate-900">Batasi Jumlah Bawahan</span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Aktifkan batas rater bawahan ({period.maxBawahan || 5} orang per atasan). Jika dinonaktifkan (default saat ini), seluruh bawahan otomatis berhak mengisi kuesioner tanpa dibatasi.
                  </span>
                </div>
              </label>
            </div>

            <div className="rounded-xl border p-4 bg-slate-50 border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 mt-1 cursor-pointer"
                  checked={period.autoFillPeers !== false}
                  onChange={(e) => setPeriod({ ...period, autoFillPeers: e.target.checked })}
                />
                <div className="font-display">
                  <span className="block font-bold text-sm text-slate-900">Penilaian Sejawat (Peer) Otomatis</span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Generate rater rekan sejawat secara otomatis jika pegawai belum mengusulkan sendiri secara manual. Sangat berguna agar kuesioner rekan sejawat tidak dibiarkan kosong.
                  </span>
                </div>
              </label>
            </div>

            <div className="rounded-xl border p-4 bg-slate-50 border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 mt-1 cursor-pointer"
                  checked={!!period.randomizePeers}
                  onChange={(e) => setPeriod({ ...period, randomizePeers: e.target.checked })}
                />
                <div className="font-display">
                  <span className="block font-bold text-sm text-slate-900">Acak Rater Rekan Sejawat</span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Sistem akan menggenerate nama rater rekan sejawat secara acak (bukan berurutan ID) dan langsung berstatus disetujui (Approved) tanpa memerlukan verifikasi/persetujuan dari atasan.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: PERCENTAGE WEIGHTS */}
      <Card>
        <div className="border-b pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900">Bobot Persentase Penilai (360°)</h2>
            <p className="text-xs text-slate-500 font-medium">Konfigurasi bobot pengali secara presisi untuk 5 kondisi ketersediaan evaluator di lapangan.</p>
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl border-2 border-slate-900 bg-slate-50 text-slate-900 font-mono text-center">
            Mode Multi-Kondisi Aktif (1 s.d. 5)
          </span>
        </div>

        {/* PRESET SYSTEM CHIPS */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-display">
          <div>
            <span className="block font-bold text-xs text-slate-900">⚡ Preset Pembobotan Otomatis (Semua Kondisi)</span>
            <span className="block text-[11px] text-slate-500">Sesuaikan instan seluruh rumus pembobotan berdasarkan standardisasi regulasi.</span>
          </div>
          <div className="flex flex-wrap gap-1.5 self-stretch sm:self-auto justify-start">
            <button
              type="button"
              onClick={() => {
                setPeriod({
                  ...period,
                  weightsWithSub: { Atasan: 60, Peer: 20, Bawahan: 20 },
                  weightsNoSub: { Atasan: 60, Peer: 40 },
                  weightsCond3: { Atasan: 75, Peer: 0, Bawahan: 25 },
                  weightsCond4: { Atasan: 100, Peer: 0, Bawahan: 0 },
                  weightsCond5: { Atasan: 0, Peer: 0, Bawahan: 100 }
                });
                toast("Preset Regulasi Terbaru Permenpan RB 6/2022 diterapkan ke semua kondisi!");
              }}
              className="px-3 py-1.5 text-[10px] font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm cursor-pointer"
            >
              ⭐ Regulasi BKN Terbaru (60-20-20 %)
            </button>
            <button
              type="button"
              onClick={() => {
                setPeriod({
                  ...period,
                  weightsWithSub: { Atasan: 60, Peer: 15, Bawahan: 25 },
                  weightsNoSub: { Atasan: 60, Peer: 40 },
                  weightsCond3: { Atasan: 70, Peer: 0, Bawahan: 30 },
                  weightsCond4: { Atasan: 100, Peer: 0, Bawahan: 0 },
                  weightsCond5: { Atasan: 0, Peer: 0, Bawahan: 100 }
                });
                toast("Preset BKPSDM Klasik diterapkan ke semua kondisi!");
              }}
              className="px-3 py-1.5 text-[10px] font-extrabold bg-white hover:bg-slate-100 text-slate-800 border rounded-lg transition-all shadow-sm cursor-pointer"
            >
              BKPSDM Klasik (60-15-25 %)
            </button>
            <button
              type="button"
              onClick={() => {
                setPeriod({
                  ...period,
                  weightsWithSub: { Atasan: 50, Peer: 25, Bawahan: 25 },
                  weightsNoSub: { Atasan: 50, Peer: 50 },
                  weightsCond3: { Atasan: 50, Peer: 0, Bawahan: 50 },
                  weightsCond4: { Atasan: 100, Peer: 0, Bawahan: 0 },
                  weightsCond5: { Atasan: 0, Peer: 0, Bawahan: 100 }
                });
                toast("Preset Sama Rata diterapkan ke semua kondisi!");
              }}
              className="px-3 py-1.5 text-[10px] font-extrabold bg-white hover:bg-slate-100 text-slate-800 border rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Sama Rata (50-25-25 %)
            </button>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 font-display">
          {[
            {
              id: "cond1",
              num: "1",
              title: "Atasan + Peer + Sub",
              desc: "Ada Atasan, Sejawat & Bawahan",
              total: period.weightsWithSub.Atasan + period.weightsWithSub.Peer + (period.weightsWithSub.Bawahan || 0)
            },
            {
              id: "cond2",
              num: "2",
              title: "Atasan + Peer",
              desc: "Ada Atasan & Sejawat (Tanpa Bawahan)",
              total: period.weightsNoSub.Atasan + period.weightsNoSub.Peer
            },
            {
              id: "cond3",
              num: "3",
              title: "Atasan + Sub",
              desc: "Ada Atasan & Bawahan (Tanpa Sejawat)",
              total: (period.weightsCond3?.Atasan ?? 75) + (period.weightsCond3?.Bawahan ?? 25)
            },
            {
              id: "cond4",
              num: "4",
              title: "Atasan Sahaja",
              desc: "Hanya Ada Atasan Langsung",
              total: period.weightsCond4?.Atasan ?? 100
            },
            {
              id: "cond5",
              num: "5",
              title: "Bawahan Sahaja",
              desc: "Hanya Ada Bawahan (Asessor Khusus)",
              total: period.weightsCond5?.Bawahan ?? 100
            }
          ].map((tab) => {
            const isActive = activeWeightTab === tab.id;
            const isValid = tab.total === 100;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveWeightTab(tab.id as any)}
                className={`p-3 rounded-2xl text-left transition-all relative border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-100 ring-2 ring-slate-800 ring-offset-1"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"
                  }`}>
                    Kondisi {tab.num}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isValid
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white animate-pulse"
                  }`}>
                    {tab.total}%
                  </span>
                </div>
                <span className="block font-bold text-xs truncate">{tab.title}</span>
                <span className={`block text-[10px] leading-tight select-none truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB LAYOUT */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-display">
          {activeWeightTab === "cond1" && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Kondisi 1: Ada Atasan, Ada Sejawat, Ada Bawahan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Diterapkan untuk ASN pemangku jabatan struktural/kepemimpinan yang kuesionernya telah diisi lengkap oleh ketiga rumpun.</p>
                </div>
                <span className="text-xs font-bold text-slate-600">Total penjumlahan wajib 100%</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Atasan Langsung (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsWithSub.Atasan}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsWithSub: { ...period.weightsWithSub, Atasan: Number(e.target.value) },
                      })
                    }
                  />
                </Field>
                <Field label="Rekan Sejawat (Peer) (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsWithSub.Peer}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsWithSub: { ...period.weightsWithSub, Peer: Number(e.target.value) },
                      })
                    }
                  />
                </Field>
                <Field label="Bawahan Langsung (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsWithSub.Bawahan || 0}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsWithSub: { ...period.weightsWithSub, Bawahan: Number(e.target.value) },
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {activeWeightTab === "cond2" && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Kondisi 2: Ada Atasan, Ada Sejawat, Tidak Ada Bawahan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Diterapkan untuk ASN staf pelaksana atau jabatan fungsional murni yang tidak mengampu bawahan di organisasinya.</p>
                </div>
                <span className="text-xs font-bold text-slate-600">Total penjumlahan wajib 100%</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Atasan Langsung (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsNoSub.Atasan}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsNoSub: { ...period.weightsNoSub, Atasan: Number(e.target.value) },
                      })
                    }
                  />
                </Field>
                <Field label="Rekan Sejawat (Peer) (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsNoSub.Peer}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsNoSub: { ...period.weightsNoSub, Peer: Number(e.target.value) },
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {activeWeightTab === "cond3" && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Kondisi 3: Ada Atasan, Tidak Ada Sejawat, Ada Bawahan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Diterapkan bila ASN memiliki bawahan namun berada di unit kerja tunggal tanpa rekan sejawat yang selevel.</p>
                </div>
                <span className="text-xs font-bold text-slate-600">Total penjumlahan wajib 100%</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Atasan Langsung (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsCond3?.Atasan ?? 75}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsCond3: {
                          Atasan: Number(e.target.value),
                          Peer: 0,
                          Bawahan: period.weightsCond3?.Bawahan ?? 25
                        }
                      })
                    }
                  />
                </Field>
                <Field label="Bawahan Langsung (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                    value={period.weightsCond3?.Bawahan ?? 25}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        weightsCond3: {
                          Atasan: period.weightsCond3?.Atasan ?? 75,
                          Peer: 0,
                          Bawahan: Number(e.target.value)
                        }
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {activeWeightTab === "cond4" && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Kondisi 4: Ada Atasan, Tidak Ada Sejawat, Tidak Ada Bawahan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Diterapkan bagi ASN di unit terkecil/isolasi yang hanya dinilai langsung oleh pimpinannya saja secara penuh.</p>
                </div>
                <span className="text-xs font-bold text-slate-600">Mutlak wajib diset 100%</span>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Field label="Atasan Langsung (%) - Atasan murni memegang kendali">
                  <input
                    type="number"
                    min="100"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
                    value={period.weightsCond4?.Atasan ?? 100}
                    disabled
                  />
                </Field>
              </div>
            </div>
          )}

          {activeWeightTab === "cond5" && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Kondisi 5: Tidak Ada Atasan, Tidak Ada Sejawat, Ada Bawahan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Diterapkan jika pimpinan berhalangan tetap atau kosong, dan penilaian murni diaudit oleh staf bawahan langsung.</p>
                </div>
                <span className="text-xs font-bold text-slate-600">Mutlak wajib diset 100%</span>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Field label="Bawahan Langsung (%) - Bawahan murni memegang kendali">
                  <input
                    type="number"
                    min="100"
                    max="100"
                    className="w-full rounded-xl border p-2.5 font-bold text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
                    value={period.weightsCond5?.Bawahan ?? 100}
                    disabled
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2.1: INTEGRASI KEPATUHAN & PENALTIES (NILAI AKHIR ASN) */}
        <div className="mt-6 border-t pt-5 border-slate-200">
          <div className="mb-4">
            <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-widest flex items-center gap-2">
              ⚖️ Integrasi Penalti Kepatuhan & Rumusan Nilai Akhir
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              Tentukan porsi kontribusi (%) antara Skor Perilaku Hasil Evaluasi 360° dengan Skor Kepatuhan Pengisian Kuesioner (Sanksi bagi yang lalai menilai). Total persentase harus tepat 100%.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-display">
            <Field label="Porsi Skor Perilaku 360° (%)">
              <input
                type="number"
                min="0"
                max="100"
                className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                value={period.weightBehavior ?? 80}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPeriod({
                    ...period,
                    weightBehavior: val,
                    weightCompliance: 100 - val
                  });
                }}
              />
              <span className="text-[10px] text-slate-400 mt-1 block font-sans">
                Bobot utama hasil kuesioner dari Atasan, Peer, dan Bawahan.
              </span>
            </Field>

            <Field label="Porsi Skor Kepatuhan Penilai (%)">
              <input
                type="number"
                min="0"
                max="100"
                className="w-full rounded-xl border p-2.5 font-bold text-sm bg-white"
                value={period.weightCompliance ?? 20}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPeriod({
                    ...period,
                    weightCompliance: val,
                    weightBehavior: 100 - val
                  });
                }}
              />
              <span className="text-[10px] text-slate-400 mt-1 block font-sans">
                Sanksi porsi kepatuhan penyelesaian tugas menilai orang lain.
              </span>
            </Field>
          </div>
          
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100/80 rounded-xl text-[11px] text-indigo-950 font-medium font-display leading-relaxed">
            💡 <b>Logika Rumus Terpadu:</b> Nilai Akhir Pegawai = (Skor Perilaku × <b>{(period.weightBehavior ?? 80)}%</b>) + (Skor Kepatuhan × <b>{(period.weightCompliance ?? 20)}%</b>). <br/>
            Jika pegawai tidak memiliki kewajiban menilai (wajib dinilai = 0), maka Skor Kepatuhan otomatis bernilai <b>100%</b> sehingga tidak ada sanksi pengurangan nilai.
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="copy_demo"
              className="w-4.5 h-4.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              checked={copyDemoData}
              onChange={(e) => setCopyDemoData(e.target.checked)}
            />
            <label htmlFor="copy_demo" className="text-xs font-bold text-slate-700 font-display select-none cursor-pointer">
              Salin data rater & kuesioner dari periode default (sangat dianjurkan untuk pengujian instan)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={resetPeriodData} variant="danger" className="text-white flex items-center gap-1.5 font-bold">
              <RotateCcw className="w-4 h-4" />
              Reset Data Periode
            </Button>
            <Button onClick={save} variant="secondary">Simpan Setelan</Button>
            <Button onClick={saveAsNew} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Buat & Aktifkan Periode Baru
            </Button>
          </div>
        </div>
      </Card>

      {/* SECTION 2.5: LIST OF STORED PERIODS */}
      <Card>
        <div className="border-b pb-3 mb-4">
          <h2 className="text-md font-black font-display text-slate-900">Daftar Manajemen Periode (Riwayat Sistem)</h2>
          <p className="text-xs text-slate-500 font-medium">Lihat seluruh periode bulanan, triwulan, maupun custom yang tersimpan dalam sistem. Rekap laporan dapat diambil berdasarkan salah satu periode berikut.</p>
        </div>

        <div className="overflow-auto max-h-[300px] font-display">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b uppercase tracking-wide text-slate-400 font-black">
                <th className="py-2.5">Nama Periode</th>
                <th>Tipe</th>
                <th>Mulai s.d Selesai</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activePeriodsList.map((p) => {
                const isActive = p.id === state.period.id;
                return (
                  <tr key={p.id} className={`border-b transition-colors hover:bg-slate-50 ${isActive ? "bg-sky-50/50" : ""}`}>
                    <td className="py-3 font-extrabold text-slate-950 flex items-center gap-1.5">
                      {p.name}
                      {isActive && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Aktif Global
                        </span>
                      )}
                    </td>
                    <td className="font-bold text-slate-500">{p.type || "Custom"}</td>
                    <td className="font-black text-slate-800">{p.start} s.d {p.end}</td>
                    <td>
                      <span className={`inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                        p.status === "Aktif" ? "bg-emerald-500/10 text-emerald-600" :
                        p.status === "Final" ? "bg-slate-500/10 text-slate-600" :
                        p.status === "Draft" ? "bg-amber-500/10 text-amber-600" : "bg-sky-500/10 text-sky-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isActive ? (
                          <>
                            <button
                              onClick={() => makeActive(p)}
                              className="px-2.5 py-1 text-[10px] font-black bg-white hover:bg-slate-100 border text-slate-800 rounded-md transition-all shadow-sm"
                            >
                              Aktifkan
                            </button>
                            <button
                              onClick={() => deletePeriod(p)}
                              className="p-1 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                              title="Hapus periode"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setPeriod(p)}
                            className="px-2.5 py-1 text-[10px] font-black bg-slate-900 text-white rounded-md transition-all"
                          >
                            Edit Setelan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {activePeriodsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400 font-bold">
                    Tidak ada log riwayat periode tersimpan. Hubungkan Supabase atau simpan setelan untuk mencatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 3: SUPABASE INTEGRATION HUB */}
      <Card className="border-t-4 border-sky-500 overflow-hidden relative">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <Database className="w-24 h-24 text-sky-900" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-3">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <CloudLightning className="w-5 h-5 text-sky-500 stroke-[2.5]" />
              Hub Integrasi Cloud (Supabase SDK)
            </h2>
            <p className="text-xs text-slate-500">
              Sinkronisasikan data indeks perilaku 360° Anda ke cloud server. Data tidak lagi disimpan eksklusif pada penyimpanan lokal perorangan.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Integrasi Cloud:</span>
            <button
              type="button"
              onClick={() => setEnabledInput(!enabledInput)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabledInput ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enabledInput ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className={`p-4 rounded-xl mb-4 border flex items-start gap-3 text-xs leading-relaxed ${
          enabledInput 
            ? "bg-slate-50 text-slate-800 border-slate-200" 
            : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        >
          <Server className="w-5 h-5 text-indigo-500 shrink-0 stroke-[2]" />
          <div>
            <span className="font-extrabold block mb-0.5 text-slate-900 uppercase">
              {enabledInput ? "Status: Sinkronisasi Cloud Aktif" : "Status: Sinkronisasi Cloud Tidak Aktif"}
            </span>
            {enabledInput ? (
              <p>
                Setiap pemutakhiran data, pengisian rater kuesioner, hingga perubahan status ASN akan **secara langsung disalin ke Supabase** di samping penyimpanan local backup browser. Ini mempermudah integrasi Vercel + Github nantinya.
              </p>
            ) : (
              <p>
                Aplikasi saat ini beroperasi penuh dalam **Mode Demo Offline (LocalStorage)**. Perubahan data di simpan sementara di browser Anda dan akan hilang jika cache dikosongkan. Sangat cocok untuk menguji fungsionalitas lokal di AI Studio.
              </p>
            )}
          </div>
        </div>

        {/* SETUP FORM */}
        <div className="grid gap-4 md:grid-cols-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <Field label="Supabase Endpoint URL">
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              className="w-full rounded-xl border p-2.5 font-mono text-xs bg-white text-slate-900"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </Field>
          <Field label="Supabase API Anon Key">
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border p-2.5 font-mono text-xs bg-white text-slate-900"
              value={anonKeyInput}
              onChange={(e) => setAnonKeyInput(e.target.value)}
            />
          </Field>
          <Field label="Nama Tabel Supabase Target">
            <input
              type="text"
              className="w-full rounded-xl border p-2.5 font-mono text-xs bg-white text-slate-900"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
            />
          </Field>
          <div className="flex items-end justify-start gap-2 h-full pb-1">
            <Button onClick={saveConfig}>
              Simpan Konfigurasi
            </Button>
            <Button variant="secondary" onClick={handleTestConnection} disabled={testing}>
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  Menguji...
                </>
              ) : (
                "Uji Koneksi Database"
              )}
            </Button>
          </div>
        </div>

        {/* TEST RESULT */}
        {testResult && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-bold leading-relaxed flex items-start gap-2.5 ${
            testResult.success 
              ? "bg-emerald-50 text-emerald-950 border-emerald-200" 
              : "bg-rose-50 text-rose-950 border-rose-200"
            }`}
          >
            {testResult.success ? (
              <span className="text-emerald-600 font-extrabold">✔️</span>
            ) : (
              <span className="text-rose-600 font-extrabold">❌</span>
            )}
            <span>{testResult.text}</span>
          </div>
        )}

        {/* ACTION CARDS */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4 border-t pt-4">
          <div className="border border-slate-200/65 rounded-2xl p-4 bg-slate-50/25">
            <h3 className="font-black text-xs text-slate-800 mb-1 flex items-center gap-1.5 font-display uppercase tracking-wide">
              <span>🚀</span> Migrasikan / Push Data Lokal Ke Cloud
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5 leading-relaxed">
              Tekan tombol di bawah untuk menyalin seluruh draft ASN BKPSDM yang saat ini aktif di PC Anda ke Supabase Anda. Cocok disaat melakukan inisialisasi awal.
            </p>
            <Button 
              className="w-full justify-center text-xs h-10 font-black tracking-wide"
              onClick={handleExportDataNow}
              disabled={exporting}
            >
              {exporting ? "Memindahkan Data..." : "Ekspor & Sinkronkan Data ke Supabase"}
            </Button>
          </div>

          <div className="border border-slate-200/65 rounded-2xl p-4 bg-slate-50/25">
            <h3 className="font-black text-xs text-slate-800 mb-1 flex items-center gap-1.5 font-display uppercase tracking-wide">
              <span>🧾</span> Script Rujukan SQL Supabase
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5 leading-relaxed">
              Dapatkan query SQL pembuatan database tables yang efisien beserta kebijakan keamanan (RLS) siap salin untuk Anda jalankan di Dasbor Supabase.
            </p>
            <Button 
              variant="secondary" 
              className="w-full text-xs h-10 font-bold"
              onClick={() => setShowSql(!showSql)}
            >
              {showSql ? "Sembunyikan SQL Script" : "Lihat SQL Run Script"}
            </Button>
          </div>
        </div>

        {/* SQL SCRIPT DISPLAY CONTENT */}
        {showSql && (
          <div className="mt-4 border border-slate-200 bg-slate-900 rounded-2xl p-4 font-mono relative text-[11px] shadow-inner text-slate-300">
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="p-1 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:translate-y-0.5 text-xs transition-all flex items-center gap-1 font-sans"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 stroke-[2]" />
                    Salin Script
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-yellow-400 mb-3 font-semibold font-sans">
              * Salin perintah query di bawah, masuk ke Supabase Console &gt; SQL Editor &gt; New Query &gt; Tempel dan jalankan (Run).
            </p>
            <pre className="overflow-x-auto whitespace-pre p-2 rounded bg-slate-950 text-emerald-400 font-mono tracking-tight leading-relaxed max-h-[220px]">
              {sqlScript}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------
// MAIN ORCHESTRATOR APP
// ---------------------------------------------
export default function App() {
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed = raw ? JSON.parse(raw) : initialState;
      if (!parsed.employees || parsed.employees.length === 0) {
        parsed = initialState;
      }
      if (!parsed.admins) {
        parsed.admins = initialState.admins;
      }
      if (!parsed.dimensions || parsed.dimensions.length === 0) {
        parsed.dimensions = initialState.dimensions;
      }
      const synced = syncMandatoryAssignments(
        parsed.employees, 
        parsed.assignments, 
        parsed.period?.maxBawahan || 5, 
        parsed.period?.id || 2, 
        parsed.period?.maxPeer || 4,
        !!parsed.period?.enforceMaxBawahan,
        parsed.period?.autoFillPeers !== false,
        !!parsed.period?.randomizePeers
      );
      return { ...parsed, assignments: synced };
    } catch {
      const synced = syncMandatoryAssignments(
        initialState.employees, 
        initialState.assignments, 
        initialState.period?.maxBawahan || 5, 
        initialState.period?.id || 2, 
        initialState.period?.maxPeer || 4,
        !!initialState.period?.enforceMaxBawahan,
        initialState.period?.autoFillPeers !== false,
        !!initialState.period?.randomizePeers
      );
      return { ...initialState, admins: initialState.admins, assignments: synced };
    }
  });

  // Synchronise with Cloud on startup or on demand
  const forceFetchFromCloud = async () => {
    setLoadingCloud(true);
    setCloudError(null);
    try {
      await checkServerConfig();
      const config = getSupabaseConfig();
      if (config.isEnabled) {
        const remote = await fetchRemoteState();
        if (remote) {
          setState(remote);
          setCloudSynced(true);
          toast("Berhasil memperbarui data terbaru dari database Supabase! ☁️");
        } else {
          setCloudError("Tabel Supabase kosong atau data belum terekspor.");
        }
      } else {
        setCloudLoaded(true);
      }
    } catch (err: any) {
      console.error("Gagal sinkronisasi data cloud:", err);
      setCloudError(err?.message || "Kesalahan koneksi.");
      toast(`Gagal memuat dari cloud: ${err?.message || "Koneksi terputus ke Supabase"}`);
    } finally {
      setLoadingCloud(false);
      setCloudLoaded(true);
    }
  };

  useEffect(() => {
    forceFetchFromCloud();
  }, []);

  useEffect(() => {
    const synced = syncMandatoryAssignments(
      state.employees, 
      state.assignments, 
      state.period?.maxBawahan || 5, 
      state.period?.id || 2, 
      state.period?.maxPeer || 4,
      !!state.period?.enforceMaxBawahan,
      state.period?.autoFillPeers !== false,
      !!state.period?.randomizePeers
    );
    
    // Sinkronkan juga pendingRaters agar proposedIds hanya berisi peer setingkat (jenis)
    // yang masih valid di employees saat ini.
    let pendingRatersChanged = false;
    const syncedPendingRaters = state.pendingRaters.map((pr) => {
      const evaluee = state.employees.find((e) => e.id === pr.evalueeId);
      if (!evaluee) return pr;

      const validProposedIds = pr.proposedIds.filter((pid) => {
        const peer = state.employees.find((e) => e.id === pid);
        return peer && isEligiblePeer(peer, evaluee);
      });

      if (validProposedIds.length !== pr.proposedIds.length) {
        pendingRatersChanged = true;
        const minPeer = state.period.minPeer;
        const status = validProposedIds.length < minPeer ? "Ditolak" : pr.status;
        const rejectionReason = validProposedIds.length < minPeer
          ? "Sistem mendeteksi perubahan jabatan atau unit kerja. Jumlah rater sejawat satu unit tidak lagi memenuhi batas minimum."
          : pr.rejectionReason;

        return {
          ...pr,
          proposedIds: validProposedIds,
          status,
          rejectionReason,
        };
      }
      return pr;
    });

    const isAssignmentsEqual = assignmentsEqual(state.assignments, synced);
    const isPendingRatersEqual = !pendingRatersChanged;

    if (!isAssignmentsEqual || !isPendingRatersEqual) {
      setState((s) => ({
        ...s,
        assignments: synced,
        pendingRaters: syncedPendingRaters,
      }));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      // Save changes to cloud asynchronously if loaded and not currently loading, using a 1-second debounce
      if (cloudLoaded && !loadingCloud) {
        const config = getSupabaseConfig();
        if (config.isEnabled && config.url && config.anonKey) {
          setSyncing(true);
          setSyncError(null);

          const delayDebounceFn = setTimeout(async () => {
            try {
              const success = await saveRemoteState(state);
              if (success) {
                setCloudSynced(true);
                setSyncError(null);
              } else {
                setSyncError("Gagal menyimpan ke database cloud (periksa jaringan/tabel Supabase).");
              }
            } catch (err: any) {
              setSyncError(err?.message || "Masalah jaringan.");
            } finally {
              setSyncing(false);
            }
          }, 1000); // 1-second debounce to merge adjustments cleanly

          return () => clearTimeout(delayDebounceFn);
        }
      }
    }
  }, [state, loadingCloud, cloudLoaded]);

  const [user, setUser] = useState<DemoAccount | null>(() => {
    try {
      const stored = localStorage.getItem("bkpsdm-dairi-360-user-session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("bkpsdm-dairi-360-user-session", JSON.stringify(user));
      } else {
        localStorage.removeItem("bkpsdm-dairi-360-user-session");
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const [active, setActive] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const toast = (msg: string) => setToastMsg(msg);
  
  const reset = () => {
    setState(initialState);
    toast("Seluruh data simulasi berhasil direset ke kondisi awal.");
  };

  const titles: Record<string, string> = {
    dashboard: "Dashboard Utama",
    profile: "Profil ASN",
    raters: "Manajemen Evaluator",
    verification: "Verifikasi Atasan",
    assessment: "Formulir Kuesioner",
    results: "Laporan Indeks Penilaian 360",
    progress: "Mata Kepatuhan Unit Kerja",
    reports: "Rekap Laporan",
    dataAsn: "Master Data ASN",
    unitCrud: "Master Unit Kerja",
    jobCrud: "Master Jabatan",
    dimensionCrud: "Pengaturan Butir Dimensi Kuesioner",
    settings: "Setelan Sistem",
    changePassword: "Ganti Kata Sandi",
    userManual: "Panduan Aplikasi",
  };

  if (!user) {
    return <Login state={state} onLogin={(u) => { setUser(u); setActive("dashboard"); }} />;
  }

  const renderActiveView = () => {
    const pageProps = { state, setState, user, toast };
    switch (active) {
      case "profile":
        return <Profile {...pageProps} />;
      case "raters":
        return <RaterManagement {...pageProps} />;
      case "verification":
        return <Verification {...pageProps} />;
      case "assessment":
        return <Assessment {...pageProps} />;
      case "results":
        return <Results state={state} user={user} />;
      case "progress":
        return <ProgressPage state={state} />;
      case "reports":
        return <Reports state={state} toast={toast} />;
      case "dataAsn":
        return <DataASNPage {...pageProps} />;
      case "unitCrud":
        return <UnitCrudPage {...pageProps} />;
      case "jobCrud":
        return <JobCrudPage {...pageProps} />;
      case "dimensionCrud":
        return <DimensionCrudPage state={state} setState={setState} toast={toast} />;
      case "settings":
        return <SettingsPage state={state} setState={setState} toast={toast} />;
      case "changePassword":
        return (
          <ChangePasswordPage
            state={state}
            setState={setState}
            user={user}
            setUser={setUser}
            toast={toast}
          />
        );
      case "userManual":
        return <UserManualPage state={state} user={user} toast={toast} />;
      default:
        return <DashboardView state={state} user={user} setActive={setActive} />;
    }
  };

  return (
    <>
      <ThemeStyles />
      <div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800">
        <Topbar
          title={titles[active] || "Dashboard"}
          user={user}
          setOpen={setSidebarOpen}
          syncing={syncing}
          cloudSynced={cloudSynced}
          syncError={syncError}
          cloudError={cloudError}
          onRefreshCloud={forceFetchFromCloud}
        />
        {loadingCloud && (
          <div className="bg-sky-500 text-white text-center py-2 text-xs font-black uppercase flex items-center justify-center gap-2 tracking-wider border-b-2 border-slate-950 shadow-inner animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 stroke-[2.5]" />
            MENSINKRONISASIKAN DATABASE CLOUD SUPABASE, MOHON TUNGGU SEBENTAR...
          </div>
        )}
        {cloudError && (
          <div className="bg-amber-500 text-slate-950 text-center py-2 text-xs font-black uppercase flex items-center justify-center gap-2 tracking-wider border-b-2 border-slate-950 shadow-inner">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            {cloudError} (Sistem beroperasi dalam mode offline lokal)
          </div>
        )}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            user={user}
            active={active}
            setActive={setActive}
            onLogout={() => { setUser(null); }}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            state={state}
          />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full min-w-0">
            <div className="mx-auto max-w-7xl w-full">
              <DeadlineWarningBanner state={state} user={user} setActive={setActive} />
              {renderActiveView()}
            </div>
          </main>
        </div>
        <Toast message={toastMsg} onClose={() => setToastMsg("")} />
      </div>
    </>
  );
}

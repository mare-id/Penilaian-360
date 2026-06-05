import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  History, 
  Timer, 
  HelpCircle, 
  Save, 
  CalendarCheck, 
  CalendarPlus, 
  RefreshCw, 
  Sliders,
  Trash2,
  Plus,
  RotateCcw,
  Users,
  Settings,
  Star,
  FileText
} from "lucide-react";
import { AppState, Period } from "../types";
import { Card, Badge, Button, Field, StatCard } from "./UIComponents";
import { formatIndoDate } from "./DeadlineWarningBanner";

interface DeadlineConfigPageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
}

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

export function DeadlineConfigPage({ state, setState, toast }: DeadlineConfigPageProps) {
  // Use currently active period as default editor state
  const activePeriod = state.period;
  
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(activePeriod.id);
  
  // Find currently editing period
  const allPeriods = state.periods || [activePeriod];
  const editingPeriod = allPeriods.find(p => p.id === selectedPeriodId) || activePeriod;

  // Local state copy for unified editing
  const [period, setPeriod] = useState<Period>(() => ({
    type: "Custom",
    selectedMonth: "05",
    selectedQuarter: "Q2",
    selectedYear: 2026,
    ...editingPeriod
  }));

  const [copyDemoData, setCopyDemoData] = useState(true);
  const [activeWeightTab, setActiveWeightTab] = useState<"cond1" | "cond2" | "cond3" | "cond4" | "cond5" >("cond1");
  
  // Live dynamic countdown tracker
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  // Whenever the active or selected period changes, load its values
  useEffect(() => {
    setPeriod({
      type: "Custom",
      selectedMonth: "05",
      selectedQuarter: "Q2",
      selectedYear: 2026,
      ...editingPeriod
    });
  }, [selectedPeriodId, editingPeriod]);

  // Update live countdown timer every second based on manual BATAS AKHIR (period.deadlineEnd or period.end)
  useEffect(() => {
    const updateTimer = () => {
      const targetEnd = period.deadlineEnd || period.end;
      if (!targetEnd) return;
      const today = new Date();
      
      // Assume deadline is end of day 23:59:59 local time for precise countdown
      const deadlineDate = new Date(`${targetEnd}T23:59:59`);
      const diffMs = deadlineDate.getTime() - today.getTime();
      
      if (diffMs <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
      } else {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);
        setTimeRemaining({ days, hours, minutes, seconds, isOver: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [period.deadlineEnd, period.end]);

  // Period setup event handlers
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
      selectedYear: year,
      deadlineStart: start,
      deadlineEnd: end
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
      end,
      deadlineStart: start,
      deadlineEnd: end
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
      end,
      deadlineStart: start,
      deadlineEnd: end
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
      end,
      deadlineStart: start,
      deadlineEnd: end
    });
  };

  // Handle extension presets (Extends the BATAS WAKTU pengisian, not the nominal period)
  const handleExtendDays = (daysToAdd: number) => {
    const currentDeadlineEnd = period.deadlineEnd || period.end || new Date().toISOString().split("T")[0];
    const currentEnd = new Date(currentDeadlineEnd);
    currentEnd.setDate(currentEnd.getDate() + daysToAdd);
    
    const yyyy = currentEnd.getFullYear();
    const mm = String(currentEnd.getMonth() + 1).padStart(2, "0");
    const dd = String(currentEnd.getDate()).padStart(2, "0");
    
    const newEndStr = `${yyyy}-${mm}-${dd}`;
    setPeriod({
      ...period,
      deadlineEnd: newEndStr
    });
    toast(`Batas waktu pengisian kuesioner berhasil diperpanjang +${daysToAdd} hari di form (Batas Pengisian Baru: ${formatIndoDate(newEndStr)}). Klik Simpan untuk menerapkan.`);
  };

  // Set manual deadline to today
  const handleSetToToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setPeriod({
      ...period,
      deadlineStart: todayStr,
      deadlineEnd: todayStr
    });
    toast("Rentang batas waktu pengisian disesuaikan ke Hari Ini di editor.");
  };

  // Save changes to system state
  const handleSaveDeadline = () => {
    const w = period.weightsWithSub;
    const n = period.weightsNoSub;
    const c3 = period.weightsCond3 || { Atasan: 75, Peer: 0, Bawahan: 25 };
    const c4 = period.weightsCond4 || { Atasan: 100, Peer: 0, Bawahan: 0 };
    const c5 = period.weightsCond5 || { Atasan: 0, Peer: 0, Bawahan: 100 };

    if (!period.start || !period.end) {
      return toast("Tanggal mulai dan selesai Periode Penilaian nominal wajib diisi.");
    }
    const dStart = period.deadlineStart || period.start;
    const dEnd = period.deadlineEnd || period.end;
    
    if (new Date(period.end) < new Date(period.start)) {
      return toast("Tanggal akhir periode nominal tidak boleh mendahului tanggal mulai.");
    }
    if (new Date(dEnd) < new Date(dStart)) {
      return toast("Tanggal batas akhir pengisian kuesioner tidak boleh mendahului tanggal mulainya.");
    }

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

    const updatedPeriodObj: Period = {
      ...period,
      deadlineStart: dStart,
      deadlineEnd: dEnd,
      weightsCond3: c3,
      weightsCond4: c4,
      weightsCond5: c5
    };

    setState((s) => {
      const currentList = s.periods || [s.period];
      const existsIndex = currentList.findIndex(p => p.id === selectedPeriodId);
      let updatedList = [...currentList];
      
      if (existsIndex >= 0) {
        updatedList[existsIndex] = updatedPeriodObj;
      } else {
        updatedList.push(updatedPeriodObj);
      }

      // Check if we are modifying the currently active global period
      const isActiveEdited = s.period.id === selectedPeriodId;
      
      return {
        ...s,
        period: isActiveEdited ? updatedPeriodObj : s.period,
        periods: updatedList
      };
    });

    toast(`Sukses! Data Periode, Kepatuhan & Batas Waktu untuk '${period.name}' berhasil disimpan.`);
  };

  // Quick Action to activate a period directly
  const handleActivatePeriodDirect = (p: Period) => {
    setState((s) => ({
      ...s,
      period: p
    }));
    setSelectedPeriodId(p.id);
    toast(`Periode '${p.name}' telah diaktifkan secara global.`);
  };

  const handleSaveAsNew = () => {
    const w = period.weightsWithSub;
    const n = period.weightsNoSub;
    const c3 = period.weightsCond3 || { Atasan: 75, Peer: 0, Bawahan: 25 };
    const c4 = period.weightsCond4 || { Atasan: 100, Peer: 0, Bawahan: 0 };
    const c5 = period.weightsCond5 || { Atasan: 0, Peer: 0, Bawahan: 100 };

    if (!period.start || !period.end) {
      return toast("Tanggal mulai dan selesai Periode Penilaian nominal wajib diisi.");
    }
    if (period.end <= period.start) {
      return toast("Tanggal selesai harus melampaui tanggal mulai.");
    }
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

    const currentList = state.periods || [];
    const newId = Math.max(0, ...currentList.map(p => p.id)) + 1;
    const dStart = period.deadlineStart || period.start;
    const dEnd = period.deadlineEnd || period.end;

    const newPeriodObj: Period = {
      ...period,
      id: newId,
      deadlineStart: dStart,
      deadlineEnd: dEnd,
      weightsCond3: c3,
      weightsCond4: c4,
      weightsCond5: c5
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

    setSelectedPeriodId(newId);
    toast(`Periode baru '${newPeriodObj.name}' berhasil disimpan dan dijadikan periode aktif!`);
  };

  const handleDeletePeriod = (p: Period) => {
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

    if (selectedPeriodId === p.id) {
      setSelectedPeriodId(state.period.id);
    }
    toast(`Periode '${p.name}' berhasil dihapus.`);
  };

  const handleResetPeriodData = () => {
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

  // Colors & visual classes based on time remaining status
  const urgencyMode = timeRemaining.isOver 
    ? "danger" 
    : timeRemaining.days <= 5 
      ? "warning" 
      : "emerald"; 

  const urgencyStyles = {
    danger: {
      border: "border-red-500 bg-red-50",
      badge: "bg-red-500 text-white animate-pulse",
      text: "text-red-800",
      alert: "Tenggat Waktu Telah Berakhir (Ditutup)"
    },
    warning: {
      border: "border-amber-400 bg-amber-50",
      badge: "bg-amber-500 text-slate-950 animate-bounce",
      text: "text-amber-800",
      alert: "MENDESAK! Batas akhir tinggal sebentar lagi"
    },
    emerald: {
      border: "border-emerald-500 bg-emerald-50",
      badge: "bg-emerald-500 text-white",
      text: "text-emerald-800",
      alert: "Waktu Pengisian Berjalan Normal"
    }
  };

  return (
    <div className="space-y-6 font-display">
      {/* SECTION 1: HEADER SUMMARY STATS */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-down">
        <StatCard 
          icon={Calendar} 
          label="Periode Evaluasi Kinerja (Nominal)" 
          value={`${formatIndoDate(activePeriod.start)} s.d ${formatIndoDate(activePeriod.end)}`} 
          tone="blue"
          note={`PERIODE: ${activePeriod.name}`}
        />
        <StatCard 
          icon={Timer} 
          label="Tenggat Batas Pengisian Kuesioner" 
          value={formatIndoDate(activePeriod.deadlineEnd || activePeriod.end)} 
          tone={urgencyMode === "danger" ? "red" : urgencyMode === "warning" ? "yellow" : "emerald"}
          note={timeRemaining.isOver ? "Gerbang pengisian ditutup" : `Hitung mundur: ${timeRemaining.days} Hari ${timeRemaining.hours} Jam lagi`}
        />
        <StatCard 
          icon={Clock} 
          label="Status Operasional Sistem" 
          value={activePeriod.status} 
          tone={activePeriod.status === "Aktif" ? "emerald" : "slate"}
          note="Status Akses Input Kuesioner ASN"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        {/* COLUMN 1: EDITOR PANEL */}
        <div className="space-y-6">
          <Card className="border-1 border-slate-950/15">
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Konfigurasi Rentang Periode &amp; Tenggat Pengisian
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Atur jangka waktu kerja yang dievaluasi terpisah dari toleransi tenggat waktu pengisian kuesioner.
                </p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-900 border-none text-[10px] font-black uppercase py-1 px-2.5">
                ID PERIODE: {period.id}
              </Badge>
            </div>

            {/* Quick Warning Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs mb-4 leading-relaxed ${urgencyStyles[urgencyMode].border}`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 stroke-[2.5] ${urgencyStyles[urgencyMode].text}`} />
              <div>
                <span className={`font-black uppercase block mb-0.5 ${urgencyStyles[urgencyMode].text}`}>
                  {period.id === activePeriod.id ? "KONFIGURASI PERIODE AKTIF" : "KONFIGURASI ARSIP PERIODE"}
                </span>
                <p className="text-slate-800">
                  {period.id === activePeriod.id 
                    ? `Perubahan tenggat langsung memengaruhi sisa hari pengisian kuesioner bagi seluruh pegawai rater secara instan. Batas rater saat ini adalah ${formatIndoDate(period.deadlineEnd || period.end)}.`
                    : `Anda sedang menyunting data dari periode alternatif: "${period.name}". Ini tidak memengaruhi hitung mundur utama sampai Anda mengaktifkan periode ini.`
                  }
                </p>
              </div>
            </div>

            {/* Editor fields */}
            <div className="space-y-6">
              
              {/* SECTION I: SETUP UMUM & JENIS PERIODE */}
              <div className="grid gap-4 md:grid-cols-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="col-span-1 md:col-span-2">
                  <span className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">
                    🛠️ LOGIKA & JENIS PERIODE SISTEM
                  </span>
                </div>
                
                <Field label="Tipe Periode">
                  <select
                    className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                    value={period.type || "Custom"}
                    onChange={(e) => setPeriodType(e.target.value as any)}
                  >
                    <option value="Custom">Manual (Rentang Tanggal Kustom)</option>
                    <option value="Bulanan">Bulanan (Dropdown Bulan & Tahun)</option>
                    <option value="Triwulan">Triwulan (Dropdown Akumulasi 3 Bulan)</option>
                  </select>
                </Field>

                <Field label="Status Operasional Periode">
                  <select
                    className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                    value={period.status}
                    onChange={(e) => setPeriod({ ...period, status: e.target.value })}
                  >
                    <option value="Draft">Draft (Belum dibuka)</option>
                    <option value="Aktif">Aktif (Kuesioner Terbuka)</option>
                    <option value="Ditutup">Ditutup (Ditutup sementara)</option>
                    <option value="Final">Final (Laporan Terkunci)</option>
                  </select>
                </Field>

                {period.type === "Bulanan" && (
                  <Field label="Pilih Bulan">
                    <select
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.selectedMonth || "05"}
                      onChange={(e) => handleMonthChange(e.target.value)}
                    >
                      {MONTHS_LIST.map((m) => (
                        <option key={m.value} value={m.value}>{m.name}</option>
                      ))}
                    </select>
                  </Field>
                )}

                {period.type === "Triwulan" && (
                  <Field label="Pilih Kuartal / Triwulan">
                    <select
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.selectedQuarter || "Q2"}
                      onChange={(e) => handleQuarterChange(e.target.value)}
                    >
                      {QUARTERS_LIST.map((q) => (
                        <option key={q.value} value={q.value}>{q.name}</option>
                      ))}
                    </select>
                  </Field>
                )}

                {(period.type === "Bulanan" || period.type === "Triwulan") && (
                  <Field label="Tahun Penilaian">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.selectedYear || 2026}
                      onChange={(e) => handleYearChange(parseInt(e.target.value, 10) || 2026)}
                    />
                  </Field>
                )}

                <div className="col-span-1 md:col-span-2">
                  <Field label="Nama Periode Penilaian (Judul)">
                    <input
                      type="text"
                      className={`w-full rounded-xl border p-2.5 font-semibold text-xs ${period.type !== "Custom" ? "bg-slate-100 text-slate-500" : "bg-white"}`}
                      value={period.name}
                      disabled={period.type !== "Custom"}
                      onChange={(e) => setPeriod({ ...period, name: e.target.value })}
                      placeholder="Misal: Periode Bulanan Mei 2026"
                    />
                  </Field>
                </div>
              </div>

              {/* SECTION A: EVAL LOG nominal */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">
                  📅 A. Rentang Jangka Waktu Kerja yang Dievaluasi (Nominal Periode)
                </span>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Tanggal Mulai Kerja">
                    <input
                      type="date"
                      className={`w-full rounded-xl border p-2.5 font-semibold text-xs ${period.type !== "Custom" ? "bg-slate-100 text-slate-500" : "bg-white"}`}
                      value={period.start}
                      disabled={period.type !== "Custom"}
                      onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                    />
                  </Field>

                  <Field label="Tanggal Selesai Kerja">
                    <input
                      type="date"
                      className={`w-full rounded-xl border p-2.5 font-semibold text-xs ${period.type !== "Custom" ? "bg-slate-100 text-slate-500" : "bg-white"}`}
                      value={period.end}
                      disabled={period.type !== "Custom"}
                      onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                    />
                  </Field>
                </div>
                <span className="block text-[10px] text-slate-400 mt-2 font-medium">
                  * Rentang waktu resmi sasaran kinerja yang dinilai (Misal: 01 April s.d 30 Juni).
                </span>
              </div>

              {/* SECTION B: DEADLINE SETTINGS manual */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <span className="block text-[10.5px] uppercase font-black tracking-wider text-indigo-900 mb-2">
                  🔒 B. Batas Waktu Aktivitas Sistem (Tenggat Pengisian Kuesioner)
                </span>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Tanggal Pengisian Mulai Dibuka">
                    <input
                      type="date"
                      className="w-full rounded-xl border border-indigo-200 p-2.5 font-bold text-xs bg-white text-indigo-950"
                      value={period.deadlineStart || period.start}
                      onChange={(e) => setPeriod({ ...period, deadlineStart: e.target.value })}
                    />
                  </Field>

                  <Field label="Tanggal Akhir Ditutup (Deadline)">
                    <input
                      type="date"
                      className="w-full rounded-xl border border-indigo-200 p-2.5 font-bold text-xs bg-white text-indigo-950"
                      value={period.deadlineEnd || period.end}
                      onChange={(e) => setPeriod({ ...period, deadlineEnd: e.target.value })}
                    />
                  </Field>
                </div>
                <span className="block text-[10.5px] text-indigo-700/80 mt-2 font-bold leading-normal">
                  * Admin dapat menyesuaikan tanggal ini secara manual kapan saja tanpa mengganggu rentang tanggal kinerja asli. Seluruh instrumen kuesioner perilaku 360° akan terkunci begitu ia melewati batas akhir di atas.
                </span>

                {/* QUICK CONTROL PRESETS CONTAINER */}
                <div className="mt-3 pt-3 border-t border-indigo-100">
                  <span className="block text-[9.5px] font-black uppercase tracking-wider text-slate-500 mb-2">
                    ⚡ Perpanjang Batas Pengisian Kuesioner Secara Instan:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => handleExtendDays(1)}
                      className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold bg-white"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      +1 Hari
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleExtendDays(3)}
                      className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold bg-white"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      +3 Hari
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleExtendDays(7)}
                      className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold bg-white"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      +7 Hari
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleExtendDays(14)}
                      className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold bg-white"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      +14 Hari
                    </Button>
                    <Button 
                      variant="warning" 
                      onClick={handleSetToToday}
                      className="flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Set Hari Ini
                    </Button>
                  </div>
                </div>
              </div>

              {/* SECTION C: KEPATUHAN & ATURAN RATER */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-3">
                  ⚖️ C. Batasan Jumlah & Sifat Verifikasi Rater (Aturan Kepatuhan)
                </span>
                
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <Field label="Min Peer Rater">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.minPeer}
                      min="1"
                      max="12"
                      onChange={(e) => setPeriod({ ...period, minPeer: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Max Peer Rater">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.maxPeer}
                      min="1"
                      max="12"
                      onChange={(e) => setPeriod({ ...period, maxPeer: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Max Bawahan">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2.5 font-semibold text-xs bg-white"
                      value={period.maxBawahan || 5}
                      min="1"
                      max="30"
                      onChange={(e) => setPeriod({ ...period, maxBawahan: Number(e.target.value) })}
                    />
                  </Field>
                </div>

                <div className="grid gap-3 grid-cols-1 border-t border-slate-200 pt-3 mt-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5 cursor-pointer"
                      checked={!!period.enforceMaxBawahan}
                      onChange={(e) => setPeriod({ ...period, enforceMaxBawahan: e.target.checked })}
                    />
                    <div className="font-display">
                      <span className="block font-bold text-[11px] text-slate-900 leading-tight">Batasi Jumlah Bawahan Penilai Atasan</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5 leading-normal">
                        Bila aktif, atasan dibatasi maksimal {period.maxBawahan || 5} bawahan penilai. Bila mati, semua bawahan otomatis ikut sebagai penilai standar.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5 cursor-pointer"
                      checked={!!period.randomizePeers}
                      onChange={(e) => setPeriod({ ...period, randomizePeers: e.target.checked })}
                    />
                    <div className="font-display">
                      <span className="block font-bold text-[11px] text-slate-900 leading-tight">Acak Rater Rekan Sejawat &amp; Auto-Approve</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5 leading-normal">
                        Sistem memilih sejawat secara acak sistematis dan langsung berstatus Disetujui (Approved) tanpa verifikasi atasan untuk mempercepat pengisian.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="copy-demo-local"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                    checked={copyDemoData}
                    onChange={(e) => setCopyDemoData(e.target.checked)}
                  />
                  <label htmlFor="copy-demo-local" className="text-[10px] font-bold text-slate-500 cursor-pointer select-none">
                    Salin Target/Respons Demo (Dianjurkan bagi Simulasi instan)
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {period.id !== activePeriod.id && (
                    <Button 
                      variant="secondary" 
                      onClick={() => handleActivatePeriodDirect(period)}
                      className="text-slate-800 text-xs py-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      Aktifkan Periode
                    </Button>
                  )}
                  <Button 
                    variant="primary" 
                    onClick={handleSaveDeadline}
                    className="flex items-center gap-1 py-1.5 text-xs font-black"
                  >
                    <Save className="w-3.5 h-3.5 font-bold" />
                    Simpan Aturan &amp; Tenggat
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleSaveAsNew}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 py-1.5 text-xs font-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Buat Periode Baru
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* CARD 2: BOBOT PERSENTASE PENILAI (360°) */}
          <Card className="border-1 border-slate-950/15">
            <div className="border-b pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Bobot Persentase Penilai &amp; Penalti Kepatuhan (360°)
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-normal">
                  Konfigurasikan pembobotan evaluator berdasarkan ketersediaan rater di lapangan beserta rasio penalti kepatuhan rater.
                </p>
              </div>
            </div>

            {/* PRESET SYSTEM CHIPS */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-display">
              <div>
                <span className="block font-bold text-xs text-slate-900">⚡ Opsi Preset Pembobotan Otomatis</span>
                <span className="block text-[11px] text-slate-500">Sesuaikan instan seluruh rumus pembobotan berdasarkan standardisasi regulasi nasional.</span>
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
                    toast("Preset Regulasi Terbaru Permenpan RB 6/2022 (60-20-20 %) berhasil diterapkan!");
                  }}
                  className="px-2 py-1.5 text-[9px] font-extrabold bg-[#1e3a8a] text-white rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  ⭐ Regulasi BKN Terbaru (60-20-20)
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
                    toast("Preset BKPSDM Klasik (60-15-25 %) diterapkan ke semua kondisi!");
                  }}
                  className="px-2 py-1.5 text-[9px] font-extrabold bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-all cursor-pointer"
                >
                  BKPSDM Klasik (60-15-25)
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
                    toast("Preset Sama Rata (50-25-25 %) diterapkan ke semua kondisi!");
                  }}
                  className="px-2 py-1.5 text-[9px] font-extrabold bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-all cursor-pointer"
                >
                  Sama Rata (50-25-25)
                </button>
              </div>
            </div>

            {/* TABS SELECTOR */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 font-display">
              {[
                {
                  id: "cond1",
                  num: "1",
                  title: "Atasan+Sejawat+Bawahan",
                  desc: "Kondisi Komplet",
                  total: period.weightsWithSub.Atasan + period.weightsWithSub.Peer + (period.weightsWithSub.Bawahan || 0)
                },
                {
                  id: "cond2",
                  num: "2",
                  title: "Atasan+Sejawat",
                  desc: "Tanpa Rater Bawahan",
                  total: period.weightsNoSub.Atasan + period.weightsNoSub.Peer
                },
                {
                  id: "cond3",
                  num: "3",
                  title: "Atasan+Bawahan",
                  desc: "Tanpa Rekan Sejawat",
                  total: (period.weightsCond3?.Atasan ?? 75) + (period.weightsCond3?.Bawahan ?? 25)
                },
                {
                  id: "cond4",
                  num: "4",
                  title: "Hanya Atasan",
                  desc: "Evaluasi Tunggal",
                  total: period.weightsCond4?.Atasan ?? 100
                },
                {
                  id: "cond5",
                  num: "5",
                  title: "Hanya Bawahan",
                  desc: "Umpan Balik Khusus",
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
                    className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? "bg-slate-900 border-slate-950 text-white shadow-sm ring-1 ring-slate-850"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[8.5px] uppercase font-bold px-1 py-0.5 rounded ${
                        isActive ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"
                      }`}>
                        K- {tab.num}
                      </span>
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isValid
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white animate-pulse"
                      }`}>
                        {tab.total}%
                      </span>
                    </div>
                    <span className="block font-bold text-[10.5px] truncate">{tab.title}</span>
                    <span className={`block text-[9px] leading-tight truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE TAB LAYOUT */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 font-display text-xs">
              {activeWeightTab === "cond1" && (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-dashed border-slate-200 pb-2">
                    <div>
                      <h3 className="font-extrabold text-[#1e3a8a] uppercase text-[10.5px]">Kondisi 1: Ada Atasan, Ada Sejawat, Ada Bawahan</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Diterapkan untuk ASN pemangku jabatan struktural/kepemimpinan.</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded-md">Total Pengali = 100%</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Field label="Atasan Langsung (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                  <div className="flex items-center justify-between mb-3 border-b border-dashed border-slate-200 pb-2">
                    <div>
                      <h3 className="font-extrabold text-[#1e3a8a] uppercase text-[10.5px]">Kondisi 2: Ada Atasan, Ada Sejawat, Tanpa Bawahan</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Diterapkan untuk ASN pelaksana mandiri atau jabatan fungsional murni.</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded-md">Total Pengali = 100%</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Atasan Langsung (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                  <div className="flex items-center justify-between mb-3 border-b border-dashed border-slate-200 pb-2">
                    <div>
                      <h3 className="font-extrabold text-[#1e3a8a] uppercase text-[10.5px]">Kondisi 3: Ada Atasan, Tanpa Sejawat, Ada Bawahan</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Diterapkan bila ASN memiliki bawahan namun tidak mempunyai rekan selevel.</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded-md">Total Pengali = 100%</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Atasan Langsung (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                        className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                  <div className="flex items-center justify-between mb-3 border-b border-[#1e3a8a] pb-2 text-[10.5px]">
                    <h3 className="font-extrabold text-[#1e3a8a] uppercase">Kondisi 4: Hanya Ada Atasan Langsung</h3>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded font-black text-[9.5px]">Mutlak 100%</span>
                  </div>
                  <Field label="Porsi Atasan (%)">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2 font-bold text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                      value={100}
                      disabled
                    />
                  </Field>
                </div>
              )}

              {activeWeightTab === "cond5" && (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#1e3a8a] pb-2 text-[10.5px]">
                    <h3 className="font-extrabold text-[#1e3a8a] uppercase">Kondisi 5: Hanya Ada Bawahan Langsung (Asessor)</h3>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded font-black text-[9.5px]">Mutlak 100%</span>
                  </div>
                  <Field label="Porsi Bawahan (%)">
                    <input
                      type="number"
                      className="w-full rounded-xl border p-2 font-bold text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                      value={100}
                      disabled
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* INTEGRASI PENALTI KEPATUHAN */}
            <div className="mt-5 border-t pt-4 border-slate-200">
              <span className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2.5">
                ⚖️ KONTRIBUSI SKOR AKHIR &amp; SANKSI KELALAIAN
              </span>
              <div className="grid gap-4 md:grid-cols-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 leading-normal text-xs font-display">
                <Field label="Porsi Skor Perilaku 360° (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Bobot murni kuesioner dari rumpun evaluator (atasan, peer, bawahan).
                  </span>
                </Field>

                <Field label="Porsi Skor Kepatuhan Penilai (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border p-2 font-bold text-xs bg-white"
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
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sanksi porsi kepatuhan penyelesaian tugas menilai orang lain bagi rater.
                  </span>
                </Field>

                <div className="col-span-1 md:col-span-2 mt-2 p-3 bg-indigo-50 border border-indigo-100/90 rounded-xl text-[10.5px] text-indigo-950 font-medium">
                  💡 <b>Logika Rumus Terpadu:</b> Nilai Akhir Perilaku = (Skor Perilaku × <b>{period.weightBehavior ?? 80}%</b>) + (Skor Kepatuhan × <b>{period.weightCompliance ?? 20}%</b>)
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMN 2: PERIOD DEADLINE TABLE LIST */}
        <div className="space-y-6">
          {/* REAL TIME ANIMATED COUNTDOWN DISPLAY CARD */}
          <Card className="border-t-4 border-indigo-600 bg-gradient-to-br from-indigo-50/40 to-white overflow-hidden relative border-1 border-slate-950/15">
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
              <Clock className="w-24 h-24 text-indigo-950 animate-spin" style={{ animationDuration: "120s" }} />
            </div>

            <h3 className="font-black text-[10.5px] uppercase tracking-widest text-indigo-950 flex items-center gap-1.5 mb-3">
              <Timer className="w-4 h-4 text-indigo-600 animate-pulse" />
              HITUNG MUNDUR BATAS PENGISIAN LIVE (DEADLINE)
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center my-2 select-none">
              <div className="bg-slate-950 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-xl sm:text-2xl font-black text-white">{timeRemaining.days}</div>
                <div className="text-[9px] font-black uppercase text-indigo-300">Hari</div>
              </div>
              <div className="bg-slate-950 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-xl sm:text-2xl font-black text-white">{String(timeRemaining.hours).padStart(2, "0")}</div>
                <div className="text-[9px] font-black uppercase text-indigo-300">Jam</div>
              </div>
              <div className="bg-slate-950 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-xl sm:text-2xl font-black text-white">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                <div className="text-[9px] font-black uppercase text-indigo-300">Menit</div>
              </div>
              <div className="bg-slate-950 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-300">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                <div className="text-[9px] font-black uppercase text-indigo-300">Detik</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs border-t border-dashed border-slate-200 pt-3">
              <span className="font-semibold text-slate-500">Status Akses Loket Penginputan:</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-slate-950 ${
                timeRemaining.isOver 
                  ? "bg-red-500 text-white" 
                  : timeRemaining.days <= 5 
                    ? "bg-amber-400 text-slate-950" 
                    : "bg-emerald-500 text-white"
              }`}>
                {urgencyStyles[urgencyMode].alert}
              </span>
            </div>
          </Card>

          <Card className="border-1 border-slate-950/15">
            <div className="border-b pb-3 mb-4">
              <h2 className="text-md font-black font-display text-slate-900 flex items-center gap-1.5">
                <History className="w-5 h-5 text-indigo-600" />
                Daftar Riwayat Periode &amp; Tenggat
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Daftar seluruh periode penilaian di sistem. Klik salah satu untuk menyesuaikan tenggat sisa harinya.
              </p>
            </div>

            <div className="overflow-auto max-h-[480px]">
              <table className="w-full text-left text-xs text-slate-700 border-collapse table-auto">
                <thead>
                  <tr className="bg-[#1e3a8a] text-white">
                    <th className="py-2.5 px-2.5">Nama &amp; Jenis</th>
                    <th className="px-2">Detail Tanggal</th>
                    <th className="text-center px-1">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {allPeriods.map((p) => {
                    const isActive = p.id === activePeriod.id;
                    const isBeingEdited = p.id === selectedPeriodId;
                    
                    return (
                      <tr 
                        key={p.id} 
                        className={`transition-colors border-b text-[11px] ${
                          isBeingEdited 
                            ? "bg-indigo-50 hover:bg-indigo-100 font-medium" 
                            : isActive 
                              ? "bg-sky-50/40 hover:bg-sky-50/80" 
                              : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-2.5 px-2">
                          <div className="font-extrabold text-slate-950 flex flex-col gap-0.5">
                            <span className="flex items-center gap-1">
                              {p.name}
                              {isActive && (
                                <span className="text-[7.5px] font-black uppercase text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded border border-emerald-300">
                                  Global Aktif
                                </span>
                              )}
                            </span>
                            <span className="text-[9.5px] text-slate-400 font-bold uppercase">{p.type || "Custom"}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 leading-tight">
                          <div className="text-slate-500">
                            📦 Periode Kerja: <br />
                            <b className="text-slate-800">{formatIndoDate(p.start)} s.d {formatIndoDate(p.end)}</b>
                          </div>
                          <div className="text-indigo-950 mt-1 border-t border-dashed border-slate-200 pt-1">
                            🔒 Tenggat Isi: <br />
                            <b className="text-indigo-800 font-extrabold">{formatIndoDate(p.deadlineStart || p.start)} s.d {formatIndoDate(p.deadlineEnd || p.end)}</b>
                          </div>
                        </td>
                        <td className="text-center px-1">
                          <div className="flex flex-col items-stretch gap-1">
                            {isBeingEdited ? (
                              <span className="text-[8px] font-black uppercase bg-indigo-600 text-white px-1.5 py-1 rounded border border-slate-950 block text-center shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] select-none">
                                Sedang Diedit
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedPeriodId(p.id)}
                                className="px-1.5 py-1 text-[8.5px] font-black uppercase bg-white hover:bg-slate-100 border-2 border-slate-950 rounded transition-all shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                              >
                                Edit Aturan
                              </button>
                            )}

                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => handleDeletePeriod(p)}
                                className="p-1 text-red-600 hover:bg-red-50 text-center rounded text-[9.5px] transition-colors flex items-center justify-center gap-0.5"
                                title="Hapus periode"
                              >
                                <Trash2 className="w-3 h-3" />
                                Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* RESET PERIODE DATA */}
            <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="block font-black text-[9.5px] text-slate-800 uppercase tracking-wide">⚠️ Menu Pemulihan Data</span>
                <span className="block text-[9px] text-slate-400 mt-0.5 leading-normal">Hapus seluruh respons dan usulan rater bagi periode ini.</span>
              </div>
              <Button 
                onClick={handleResetPeriodData} 
                variant="danger" 
                className="text-white text-[9.5px] font-black uppercase py-1 px-2.5 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                Reset Data Periode
              </Button>
            </div>

            <div className="mt-3 p-2.5 bg-slate-100 border border-slate-200 rounded-xl leading-relaxed text-[10px] text-slate-600">
              📌 <b>Tips:</b> Hubungan logis yang terjalin erat antara Batas Tenggat dan Aturan Kepatuhan mengharuskan perubahan terpadu dilakukan serentak pada halaman ini demi sinkronisasi sistem secara instan.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

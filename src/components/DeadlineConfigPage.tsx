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
  Sliders
} from "lucide-react";
import { AppState, Period } from "../types";
import { Card, Badge, Button, Field, StatCard } from "./UIComponents";
import { formatIndoDate } from "./DeadlineWarningBanner";

interface DeadlineConfigPageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
}

export function DeadlineConfigPage({ state, setState, toast }: DeadlineConfigPageProps) {
  // Use currently active period as default editor state
  const activePeriod = state.period;
  
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(activePeriod.id);
  
  // Find currently editing period
  const allPeriods = state.periods || [activePeriod];
  const editingPeriod = allPeriods.find(p => p.id === selectedPeriodId) || activePeriod;

  // Local state for the editor inputs
  const [startDate, setStartDate] = useState(editingPeriod.start);
  const [endDate, setEndDate] = useState(editingPeriod.end);
  const [status, setStatus] = useState(editingPeriod.status);
  const [name, setName] = useState(editingPeriod.name);
  
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
    setStartDate(editingPeriod.start);
    setEndDate(editingPeriod.end);
    setStatus(editingPeriod.status);
    setName(editingPeriod.name);
  }, [selectedPeriodId, editingPeriod]);

  // Update live countdown timer every second
  useEffect(() => {
    const updateTimer = () => {
      if (!endDate) return;
      const today = new Date();
      
      // Assume deadline is end of day 23:59:59 local time for precise countdown
      const deadlineDate = new Date(`${endDate}T23:59:59`);
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
  }, [endDate]);

  // Handle extension presets
  const handleExtendDays = (daysToAdd: number) => {
    const currentEnd = new Date(endDate || new Date());
    currentEnd.setDate(currentEnd.getDate() + daysToAdd);
    
    const yyyy = currentEnd.getFullYear();
    const mm = String(currentEnd.getMonth() + 1).padStart(2, "0");
    const dd = String(currentEnd.getDate()).padStart(2, "0");
    
    const newEndStr = `${yyyy}-${mm}-${dd}`;
    setEndDate(newEndStr);
    toast(`Tenggat berhasil diperpanjang sebanyak +${daysToAdd} hari di form editor (Batas Baru: ${formatIndoDate(newEndStr)}). Simpan untuk menerapkan.`);
  };

  // Set to today
  const handleSetToToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setStartDate(todayStr);
    setEndDate(todayStr);
    toast("Tenggat pengisian disesuaikan ke Hari Ini di editor.");
  };

  // Save changes to system state
  const handleSaveDeadline = () => {
    if (!startDate || !endDate) {
      return toast("Tanggal mulai dan tanggal selesai wajib diisi.");
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      return toast("Tanggal batas akhir (selesai) tidak boleh mendahului tanggal mulai.");
    }

    const updatedPeriodObj: Period = {
      ...editingPeriod,
      name,
      start: startDate,
      end: endDate,
      status
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

    toast(`Sukses! Batas waktu & tanggal pengisian periode '${name}' berhasil diperbarui.`);
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
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          icon={Calendar} 
          label="Masa Aktif Penilaian" 
          value={formatIndoDate(activePeriod.end)} 
          tone={urgencyMode === "danger" ? "red" : urgencyMode === "warning" ? "yellow" : "blue"}
          note={`PERIODE: ${activePeriod.name}`}
        />
        <StatCard 
          icon={Timer} 
          label="Sisa Waktu Penilaian" 
          value={timeRemaining.isOver ? "TUTUP" : `${timeRemaining.days} H, ${timeRemaining.hours} J`} 
          tone={urgencyMode === "danger" ? "red" : urgencyMode === "warning" ? "yellow" : "emerald"}
          note={timeRemaining.isOver ? "Penilaian telah dikunci" : "Hitung mundur tenggat aktif"}
        />
        <StatCard 
          icon={Clock} 
          label="Status Operasional" 
          value={activePeriod.status} 
          tone={activePeriod.status === "Aktif" ? "emerald" : "slate"}
          note="Status Kontrol Distribusi Rater"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        {/* COLUMN 1: EDITOR PANEL */}
        <div className="space-y-6">
          <Card>
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Formulir Atur Batas Waktu & Rentang Tanggal
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Sesuaikan rentang pengisian kuesioner dan tenggat batas waktu pengisian di bawah.
                </p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-900 border-none text-[10px] font-black uppercase py-1 px-2">
                ID PERIODE: {editingPeriod.id}
              </Badge>
            </div>

            {/* Quick Warning Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs mb-4 leading-relaxed ${urgencyStyles[urgencyMode].border}`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 stroke-[2.5] ${urgencyStyles[urgencyMode].text}`} />
              <div>
                <span className={`font-black uppercase block mb-0.5 ${urgencyStyles[urgencyMode].text}`}>
                  {editingPeriod.id === activePeriod.id ? "PERINGATAN TENGGAT DARI PERIODE AKTIF" : "PERINGATAN ARSIP PERIODE"}
                </span>
                <p className="text-slate-800">
                  {editingPeriod.id === activePeriod.id 
                    ? `Perubahan di sini langsung berimplikasi pada sisa hari pengerjaan instrumen bagi seluruh pegawai. Batas aktif saat ini adalah ${formatIndoDate(editingPeriod.end)}.`
                    : `Anda sedang mengedit tenggat dari periode alternatif: "${editingPeriod.name}". Ini tidak memengaruhi hitung mundur utama sampai Anda mengaktifkan periode ini.`
                  }
                </p>
              </div>
            </div>

            {/* Editor fields */}
            <div className="space-y-4">
              <Field label="Nama Periode">
                <input
                  type="text"
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Periode Bulanan Mei 2026"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tanggal Mulai Pengerjaan">
                  <input
                    type="date"
                    className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Field>

                <Field label="Tanggal Selesai (Batas Akhir / Deadline)">
                  <input
                    type="date"
                    className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Status Operasional">
                <select
                  className="w-full rounded-xl border p-3 font-semibold text-sm bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Draft">Draft (Belum dibuka)</option>
                  <option value="Aktif">Aktif (Kuesioner Terbuka)</option>
                  <option value="Ditutup">Ditutup (Ditutup sementara)</option>
                  <option value="Final">Final (Laporan Terkunci)</option>
                </select>
              </Field>

              {/* QUICK CONTROL PRESETS CONTAINER */}
              <div className="pt-3 border-t border-slate-100">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  ⚡ Opsi Reset & Perpanjangan Instan (Quick Presets)
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleExtendDays(1)}
                    className="flex items-center gap-1 py-1.5 px-3 text-[10px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    +1 Hari
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleExtendDays(3)}
                    className="flex items-center gap-1 py-1.5 px-3 text-[10px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    +3 Hari
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleExtendDays(7)}
                    className="flex items-center gap-1 py-1.5 px-3 text-[10px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    +7 Hari
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleExtendDays(14)}
                    className="flex items-center gap-1 py-1.5 px-3 text-[10px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    +14 Hari
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={handleSetToToday}
                    className="flex items-center gap-1 py-1.5 px-3 text-[10px]"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Set Hari Ini
                  </Button>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                {editingPeriod.id !== activePeriod.id && (
                  <Button 
                    variant="secondary" 
                    onClick={() => handleActivatePeriodDirect(editingPeriod)}
                    className="text-white"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Aktifkan Periode Ini secara Global
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  onClick={handleSaveDeadline}
                  className="flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan Batas Waktu
                </Button>
              </div>
            </div>
          </Card>

          {/* REAL TIME ANIMATED COUNTDOWN DISPLAY CARD */}
          <Card className="border-t-4 border-indigo-600 bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden relative">
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
              <Clock className="w-24 h-24 text-indigo-900 animate-spin" style={{ animationDuration: "120s" }} />
            </div>

            <h3 className="font-black text-xs uppercase tracking-widest text-indigo-950 flex items-center gap-1.5 mb-3">
              <Timer className="w-4 h-4 text-indigo-600 animate-pulse" />
              HITUNG MUNDUR TENGGAT AKTIF (LIVE COUNTDOWN)
            </h3>

            <div className="grid grid-cols-4 gap-3 text-center my-2">
              <div className="bg-slate-900 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-3xl font-black">{timeRemaining.days}</div>
                <div className="text-[10px] font-black uppercase text-indigo-300">Hari</div>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-3xl font-black">{String(timeRemaining.hours).padStart(2, "0")}</div>
                <div className="text-[10px] font-black uppercase text-indigo-300">Jam</div>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-3xl font-black">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                <div className="text-[10px] font-black uppercase text-indigo-300">Menit</div>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-3 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-3xl font-black text-amber-300">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                <div className="text-[10px] font-black uppercase text-indigo-300">Detik</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs border-t border-dashed border-slate-200 pt-3">
              <span className="font-semibold text-slate-500">Kondisi Loket Pengisian:</span>
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
        </div>

        {/* COLUMN 2: PERIOD DEADLINE TABLE LIST */}
        <Card>
          <div className="border-b pb-3 mb-4">
            <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-1.5">
              <History className="w-5 h-5 text-indigo-600" />
              Kelola Tanggal Seluruh Periode
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Daftar seluruh periode penilaian di sistem. Klik salah satu untuk menyesuaikan tenggat sisa harinya.
            </p>
          </div>

          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-xs text-slate-700 border-collapse table-auto">
              <thead>
                <tr className="bg-[#1e3a8a] text-white">
                  <th className="py-2.5 px-3">Nama & Jenis</th>
                  <th className="px-3">Batas Akhir (Deadline)</th>
                  <th className="px-3">Status</th>
                  <th className="text-center px-3">Kontrol</th>
                </tr>
              </thead>
              <tbody>
                {allPeriods.map((p) => {
                  const isActive = p.id === activePeriod.id;
                  const isBeingEdited = p.id === selectedPeriodId;
                  
                  return (
                    <tr 
                      key={p.id} 
                      className={`transition-colors border-b ${
                        isBeingEdited 
                          ? "bg-indigo-50 hover:bg-indigo-100" 
                          : isActive 
                            ? "bg-sky-50/40 hover:bg-sky-50/80" 
                            : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-950 flex flex-col gap-0.5">
                          <span className="flex items-center gap-1">
                            {p.name}
                            {isActive && (
                              <span className="text-[8px] font-black uppercase text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded border border-emerald-300">
                                Global Aktif
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{p.type || "Custom"}</span>
                        </div>
                      </td>
                      <td className="px-3 font-extrabold text-slate-800">
                        {formatIndoDate(p.end)}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">Mulai: {formatIndoDate(p.start)}</div>
                      </td>
                      <td className="px-3">
                        <span className={`inline-block text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${
                          p.status === "Aktif" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                          p.status === "Final" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                          p.status === "Draft" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-sky-100 text-sky-700 border border-sky-200"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-center px-3">
                        {isBeingEdited ? (
                          <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-2 py-1.5 rounded-lg border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] block text-center">
                            Sedang Diedit
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedPeriodId(p.id)}
                            className="px-2 py-1 text-[9px] font-black uppercase bg-white hover:bg-slate-100 border-2 border-slate-950 rounded-lg transition-all shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]"
                          >
                            Atur Tenggat
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-[11px] text-slate-600">
            📌 <b>Tips:</b> Ketika Anda mengklik tombol <b>"Atur Tenggat"</b> di samping kanan, detail data ditarik langsung ke form editor di sebelah kiri untuk divalidasi dan diubah secara instan.
          </div>
        </Card>
      </div>
    </div>
  );
}

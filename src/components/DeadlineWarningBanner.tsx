import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Mail, 
  Calendar,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppState, DemoAccount } from "../types";

interface DeadlineWarningBannerProps {
  state: AppState;
  user: DemoAccount;
  setActive: (key: string) => void;
}

export function formatIndoDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${day} ${months[monthIndex]} ${year}`;
}

export function DeadlineWarningBanner({ state, user, setActive }: DeadlineWarningBannerProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("deadline_banner_collapsed");
    return saved === "true";
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleToggle = () => {
    const newVal = !collapsed;
    setCollapsed(newVal);
    localStorage.setItem("deadline_banner_collapsed", String(newVal));
  };

  // Find Employee details
  const employee = state.employees.find(
    (e) => e.id === user.userId || (user.nip && e.nip === user.nip)
  );

  const isAdmin = user.role === "Admin BKPSDM";

  // Calculate current user assignments & progress
  const myAssignments = employee 
    ? state.assignments.filter((a) => a.evaluatorId === employee.id && a.periodId === state.period.id) 
    : [];
  const completed = myAssignments.filter((a) => 
    state.responses.some((r) => r.assignmentId === a.id)
  );
  const unfinished = myAssignments.filter((a) => 
    !state.responses.some((r) => r.assignmentId === a.id)
  );

  const totalAss = myAssignments.length;
  const compAss = completed.length;
  const unfAss = unfinished.length;
  const completionPercentage = totalAss > 0 ? Math.round((compAss / totalAss) * 100) : 100;

  // Calculate days remaining dynamically based on manual deadline input
  const endDateStr = state.period.deadlineEnd || state.period.end;
  const today = new Date();
  
  // Create Date instances reset to midnight to calculate correct integer days remaining
  const todayResetStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const end = new Date(endDateStr);
  const startToday = new Date(todayResetStr);
  
  const diffTime = end.getTime() - startToday.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine warning levels/accents
  let level: "info" | "warning" | "danger" = "info";
  if (diffDays <= 5) {
    level = "danger";
  } else if (diffDays <= 15) {
    level = "warning";
  }

  // Action methods
  const simulateEmailReminder = () => {
    const userEmail = employee?.email || `${user.username || "asn.dairi"}@dairikab.go.id`;
    triggerToast(
      `✉️ Simulasi Pengingat Terkirim! Notifikasi detail kuesioner dan tenggat waktu telah disimulasikan ke email: ${userEmail}.`
    );
  };

  const downloadCalendarReminder = () => {
    const dateFormatted = endDateStr.replace(/-/g, "");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BKPSDM Dairi//E-Kinerja 360//ID
BEGIN:VEVENT
UID:${Date.now()}@dairikab.go.id
DTSTAMP:${dateFormatted}T000000Z
DTSTART:${dateFormatted}T080000Z
DTEND:${dateFormatted}T170000Z
SUMMARY:Deadline Kuesioner E-Kinerja 360 - ${state.period.name}
DESCRIPTION:Pengingat penting untuk melengkapi kuesioner penilaian perilaku 360° di portal E-Kinerja BKPSDM Kabupaten Dairi sebelum ditutup. Link: https://ais-dev-pwiw5guo4rgftwxhwz573i-236772461767.asia-southeast1.run.app
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P2D
DESCRIPTION:Tinggal 2 hari lagi batas akhir pengisian kuesioner
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Batas_Akhir_Ekin_360_${state.period.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("📅 Kalender Pengingat (.ics) berhasil diunduh! Buka file ini untuk menyimpannya di Google Calendar, Outlook, atau Apple Calendar.");
  };

  // Determine styling based on warning severity level
  const borderColors = {
    danger: "border-red-500 bg-red-50 text-red-950 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]",
    warning: "border-amber-400 bg-amber-50 text-amber-950 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]",
    info: "border-blue-500 bg-blue-50 text-blue-950 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]",
  };

  const ringColors = {
    danger: "bg-red-500 text-white animate-pulse",
    warning: "bg-amber-500 text-slate-950",
    info: "bg-blue-600 text-white",
  };

  const textUrgency = {
    danger: "Mendesak! Batas waktu pengisian hampir habis.",
    warning: "Batas pengisian tersisa kurang dari 2 minggu.",
    info: "Masa pengisian sedang berlangsung dengan lancar.",
  };

  return (
    <div className="mb-6 font-display">
      {/* Toast Notifikasi Simulasi */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 max-w-sm rounded-xl border-2 border-slate-950 bg-slate-900 p-4 font-semibold text-[12.5px] text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="flex gap-2">
              <span className="flex-1 leading-normal">{toastMessage}</span>
              <button 
                onClick={() => setShowToast(false)} 
                className="shrink-0 text-slate-400 hover:text-white p-0.5"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        transition={{ duration: 0.2 }}
        className={`rounded-2xl border-2 p-4 transition-all ${borderColors[level]}`}
      >
        {/* Row 1: Header / Title with Toggle Collapse */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shadow-sm ${ringColors[level]}`}>
              {level === "danger" ? (
                <AlertTriangle className="h-4 w-4 animate-bounce" />
              ) : level === "warning" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase bg-slate-950 text-white px-2 py-0.5 rounded-md tracking-wider">
                  PERSISTENSI TIMELINE
                </span>
                <span className="text-[10px] font-black uppercase text-slate-500 font-mono">
                  H-{diffDays > 0 ? diffDays : "0"} Batas Akhir
                </span>
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide mt-0.5 flex items-center gap-1">
                Peringatan Tenggat Waktu Pengisian Kuesioner
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              </h3>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleToggle}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center transition-transform active:translate-y-0.5"
            title={collapsed ? "Tampilkan Detail" : "Sembunyikan"}
          >
            {collapsed ? <ChevronDown className="h-4 w-4 text-slate-700" /> : <ChevronUp className="h-4 w-4 text-slate-700" />}
          </button>
        </div>

        {/* Dynamic Warning Notification Statement Summary (Always Visible even when collapsed) */}
        <div className="mt-2.5 text-xs font-semibold pl-11 flex flex-col gap-2 border-t pt-2 border-slate-200/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 text-slate-700">
              <span>Periode Penilaian Pekerjaan:</span>
              <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {state.period.name} ({formatIndoDate(state.period.start)} s.d {formatIndoDate(state.period.end)})
              </strong>
            </div>

            {!isAdmin && totalAss > 0 && (
              <div className="text-[11.5px] font-bold">
                Tugas Anda: <b className="text-indigo-900">{compAss}/{totalAss} Selesai</b>
                <span className={`inline-block ml-2 px-2 py-0.5 text-[9px] font-extrabold rounded-md ${
                  unfAss > 0 ? "bg-amber-100 text-amber-800 border-2 border-amber-300" : "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                }`}>
                  {unfAss > 0 ? `${unfAss} Menunggu Pengisian` : "Selesai 100%!"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-slate-800 mt-1">
            <span className="flex items-center gap-1 text-indigo-950 font-black">
              🔒 Batas Waktu Penilaian (Pengisian Kuesioner):
            </span>
            <strong className="text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 font-black">
              {formatIndoDate(state.period.deadlineStart || state.period.start)} s.d {formatIndoDate(state.period.deadlineEnd || state.period.end)}
            </strong>
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
              diffDays > 0 ? "bg-amber-150 text-amber-900 animate-pulse bg-yellow-400" : "bg-red-500 text-white"
            }`}>
              {diffDays > 0 ? `Sisa ${diffDays} Hari Lagi` : "Tutup / Selesai"}
            </span>
          </div>
        </div>

        {/* Collapsible Panel with full feature elements */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t pl-0 md:pl-11 pt-4 border-slate-200/60 space-y-4">
                {/* Visual Status Indicator & Progress block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Progress status */}
                  <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      Status Kepatuhan
                    </h4>
                    <p className="text-[11.5px] font-semibold text-slate-700 mt-1">
                      {isAdmin 
                        ? "Anda masuk sebagai Admin BKPSDM. Seluruh ASN sedang menginput kuesioner peer 360° untuk menghasilkan keputusan rater yang kredibel."
                        : unfAss > 0 
                          ? `Mohon segera luangkan waktu untuk melengkapi ${unfAss} butir instrumen tersisa. Input Anda bersifat rahasia dan langsung memengaruhi Nilai Perilaku ASN rekan kerja.`
                          : "Luar biasa! Terima kasih telah berkontribusi menyukseskan evaluasi kuesioner perilaku 360° ini tepat waktu!"
                      }
                    </p>

                    {/* Progress Bar of Completion */}
                    {!isAdmin && totalAss > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-600 mb-1">
                          <span>Progress Pengisian Nilai Anda</span>
                          <span>{completionPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              completionPercentage === 100 ? "bg-emerald-600" : "bg-indigo-600"
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-600 mb-1">
                          <span>Target Partisipasi Instansi (Live)</span>
                          <span>{Math.round((state.responses.length / Math.max(1, state.assignments.length)) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border">
                          <div 
                            className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                            style={{ width: `${(state.responses.length / Math.max(1, state.assignments.length)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Urgency Information and calendar actions */}
                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border-2 border-slate-950 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-bold uppercase text-yellow-300 font-mono tracking-wider">
                          Urgensi Sistem
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          level === "danger" ? "bg-red-600 text-white" : level === "warning" ? "bg-amber-500 text-slate-950" : "bg-blue-600 text-white"
                        }`}>
                          {level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-bold leading-normal mt-1.5 text-slate-200">
                        {textUrgency[level]} Pengisian ditutup pada tanggal <b>{formatIndoDate(endDateStr)} pukul 23:59 WIB</b>.
                      </p>
                    </div>

                    {/* Integrated Tools Row */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button
                        onClick={downloadCalendarReminder}
                        type="button"
                        className="bg-slate-800 hover:bg-slate-700 text-[10.5px] font-black py-1.5 px-2.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all text-white active:translate-y-0.5"
                      >
                        <Calendar className="h-3 w-3 text-cyan-300" />
                        Unduh Kalender .ICS
                      </button>
                      <button
                        onClick={simulateEmailReminder}
                        type="button"
                        className="bg-slate-800 hover:bg-slate-700 text-[10.5px] font-black py-1.5 px-2.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all text-white active:translate-y-0.5"
                      >
                        <Mail className="h-3 w-3 text-yellow-300" />
                        Simulasi Kirim Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Action Banner Button (if regular user has work standard pending) */}
                {!isAdmin && unfAss > 0 && (
                  <div className="bg-indigo-950 text-indigo-50 border-2 border-slate-950 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✍️</span>
                      <div>
                        <div className="text-xs font-black uppercase text-indigo-300">Siap Dikerjakan</div>
                        <p className="text-[11px] font-semibold text-indigo-100">Lengkapi {unfAss} tugas evaluasi kuesioner Anda sekarang juga.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActive("assessment")}
                      className="bg-yellow-300 hover:bg-yellow-200 text-slate-950 text-[11px] font-black uppercase px-4 py-2 rounded-lg border-2 border-slate-950 tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none transition-all active:translate-y-0.5 shrink-0"
                    >
                      Mulai Pengisian Kuesioner
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { Lock, Home, Users, ClipboardCheck, FileText, Star, AlertTriangle, BarChart3, Download, UserCheck, Settings, Menu, LogOut, RefreshCw, Check, HelpCircle } from "lucide-react";
import { DemoAccount, AppState } from "../types";
import { Badge, Card, Button, Field, ThemeStyles } from "./UIComponents";
import { getSupabaseConfig } from "../utils/supabase";
import { BkpsdmLogo } from "./BkpsdmLogo";

// ---------------------------------------------
// LOGIN COMPONENT
// ---------------------------------------------
interface LoginProps {
  onLogin: (user: DemoAccount) => void;
  state: AppState;
}

export function Login({ onLogin, state }: LoginProps) {
  const [nip, setNip] = useState("199001012010011004"); // Defaults to Dewi Lestari Berutu (ASN)
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dynamicAccounts = [
    ...(state?.admins || []).map((da) => ({
      nip: "",
      username: da.username,
      password: da.password || "admin123",
      role: da.role,
      name: da.name,
      userId: 0,
      jabatan: "Administrator Sistem",
      unit: "BKPSDM",
    })),
    ...(state?.employees || []).map((e) => ({
      nip: e.nip,
      username: e.username || e.nip,
      password: e.password || "admin123",
      role: e.role || "ASN",
      name: e.nama,
      userId: e.id,
      jabatan: e.jabatan,
      unit: e.unit,
    })),
  ];

  const sortedAccounts = [...dynamicAccounts].sort((a, b) => {
    if (a.role === "Admin BKPSDM" && b.role !== "Admin BKPSDM") return -1;
    if (a.role !== "Admin BKPSDM" && b.role === "Admin BKPSDM") return 1;
    
    const isKepalaA = a.jabatan?.toLowerCase() === "kepala badan" || a.userId === 1;
    const isKepalaB = b.jabatan?.toLowerCase() === "kepala badan" || b.userId === 1;
    if (isKepalaA && !isKepalaB) return -1;
    if (!isKepalaA && isKepalaB) return 1;
    
    return a.name.localeCompare(b.name);
  });

  const filteredAccounts = sortedAccounts.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      (a.nip && a.nip.includes(term)) ||
      (a.username && a.username.toLowerCase().includes(term)) ||
      (a.jabatan && a.jabatan.toLowerCase().includes(term)) ||
      (a.unit && a.unit.toLowerCase().includes(term))
    );
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const credential = nip.trim();
    if (!credential) {
      setError("Username atau NIP wajib diisi.");
      return;
    }

    const found = dynamicAccounts.find(
      (a) => (a.nip === credential || a.username === credential) && a.password === password
    );

    if (!found) {
      setError("Username/NIP atau password tidak sesuai.");
      return;
    }
    onLogin(found);
  };

  return (
    <>
      <ThemeStyles />
      <div className="min-h-screen bg-slate-100 p-4 text-[#0F172A] font-sans flex items-center justify-center">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_.9fr] py-8">
          <div className="space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="inline-flex items-center rounded-full border-2 border-slate-950 bg-blue-600 text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Penilaian Perilaku ASN 👑
            </span>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <BkpsdmLogo size="lg" variant="colored" className="transform hover:scale-[1.02] transition-transform duration-300" />
              <div className="inline-block mt-3 bg-yellow-300 text-slate-950 border-2 border-slate-950 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest rotate-[-1.5deg] shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                🚀 360° APPRAISAL SYSTEM
              </div>
              <p className="mt-4 max-w-2xl text-md leading-relaxed text-slate-800 font-bold font-display">
                Aplikasi penilaian perilaku berbasis BerAKHLAK yang transparan, anonim, aman, dan memicu rekomendasi pembinaan fungsional secara real-time. 🔥
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-slate-950 bg-amber-100 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black text-slate-950 border-b-2 border-slate-950/25 pb-2 mb-2 text-sm font-display">🛡️ Anonimitas</div>
                <p className="text-[11.5px] text-slate-800 leading-relaxed font-bold">Identitas penilai tetap aman dan tersembunyi secara mutlak.</p>
              </div>
              <div className="rounded-2xl border-2 border-slate-950 bg-emerald-100 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black text-slate-950 border-b-2 border-slate-950/25 pb-2 mb-2 text-sm font-display">📈 Berbobot</div>
                <p className="text-[11.5px] text-slate-800 leading-relaxed font-bold">Formula rater multi-level fungsional sesuai regulasi resmi.</p>
              </div>
              <div className="rounded-2xl border-2 border-slate-950 bg-blue-100 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black text-slate-950 border-b-2 border-slate-950/25 pb-2 mb-2 text-sm font-display">⚡ Inovatif</div>
                <p className="text-[11.5px] text-slate-800 leading-relaxed font-bold">Pengajuan sanggahan & analisis deviasi penilaian real-time.</p>
              </div>
            </div>
          </div>

          <Card className="p-6 border-2 border-slate-950 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-6">
              <h2 className="text-2xl font-black font-display text-slate-950">Masuk Otoritas</h2>
              <p className="text-xs text-slate-700 font-bold mt-1">Gunakan sandi default atau klik tombol akses cepat di bawah! ✨</p>
            </div>
            <form className="space-y-4 font-display" onSubmit={submit}>
              <Field label="Username atau NIP ASN">
                <input
                  value={nip}
                  onChange={(e) => setNip(e.target.value.trim())}
                  className="w-full rounded-xl border-2 border-slate-950 px-4 py-3 outline-none focus:border-blue-600 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Masukkan 18 digit NIP / login"
                />
              </Field>
              <Field label="Kata Sandi">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-xl border-2 border-slate-950 px-4 py-3 outline-none focus:border-blue-600 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Masukkan katasandi"
                />
              </Field>
              {error && (
                <div className="rounded-xl border-2 border-slate-950 bg-rose-200 p-3 text-xs font-black text-rose-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  ⚠️ {error}
                </div>
              )}
              <Button className="w-full py-3.5 rounded-xl text-white font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" type="submit">
                <Lock className="h-4 w-4 stroke-[2.5]" /> Mulai Otorisasi Masuk
              </Button>
            </form>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10.5px] font-black uppercase tracking-wide text-slate-950 font-display">
                  Login Cepat ASN
                </p>
                <span className="text-[9px] bg-slate-200 border-2 border-slate-950 px-2 py-0.5 rounded-full font-black text-slate-700">
                  {filteredAccounts.length} Total
                </span>
              </div>
              
              {/* Search bar for quick selection */}
              <div className="relative mb-3.5">
                <input
                  type="text"
                  placeholder="Cari nama ASN / NIP / Unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-xs font-black placeholder-slate-400 outline-none focus:border-blue-600 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-colors duration-155"
                />
              </div>

              <div className="max-h-72 space-y-2.5 overflow-auto pr-1 select-none">
                {filteredAccounts.length === 0 ? (
                  <p className="text-center text-xs font-bold text-slate-400 py-6 italic">
                    Tidak ada ASN yang cocok
                  </p>
                ) : (
                  filteredAccounts.map((a) => {
                    const isSelected = nip === (a.username || a.nip);
                    return (
                      <button
                        type="button"
                        key={a.nip || a.username}
                        onClick={() => {
                          setNip(a.username || a.nip);
                          setPassword(""); // User requests to just type the password
                          setError("");
                        }}
                        className={`w-full rounded-xl border-2 border-slate-950 p-3.5 text-left text-xs transition-all duration-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none ${
                          isSelected 
                            ? "bg-amber-100 border-amber-950 shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] animate-pulse" 
                            : "bg-white hover:bg-slate-50 border-slate-950"
                        }`}
                      >
                        <div className="font-black text-slate-950 font-display flex items-center justify-between">
                          <span className="uppercase text-[9px] tracking-wider text-slate-500">
                            {a.jabatan || a.role}
                          </span>
                          {isSelected ? (
                            <span className="rounded-full bg-emerald-500 text-white border-2 border-slate-950 px-2 py-0.5 text-[8px] font-black uppercase flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                              <Check className="h-2.5 w-2.5 stroke-[3]" /> AKTIF
                            </span>
                          ) : (
                            a.role === "Admin BKPSDM" && (
                              <span className="rounded-full bg-blue-600 text-white border-2 border-slate-950 px-2 py-0.5 text-[8px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                Sistem
                              </span>
                            )
                          )}
                        </div>
                        <div className="text-[11.5px] text-slate-950 font-extrabold mt-1.5 leading-snug">
                          👤 {a.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {a.nip && (
                            <span className="text-[9px] text-slate-600 font-mono bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-bold">
                              NIP. {a.nip}
                            </span>
                          )}
                          {a.unit && (
                            <span className="text-[9px] text-slate-700 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-bold italic truncate max-w-[180px]">
                              🏢 {a.unit}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------
// SIDEBAR COMPONENT
// ---------------------------------------------
interface SidebarProps {
  user: DemoAccount;
  active: string;
  setActive: (key: string) => void;
  onLogout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  state: AppState;
}

export function Sidebar({ user, active, setActive, onLogout, open, setOpen, state }: SidebarProps) {
  const employee = state?.employees?.find((e) => e.id === user.userId || (user.nip && e.nip === user.nip));
  const isKepalaBadan = user.role !== "Admin BKPSDM" && employee && (employee.jabatan.toLowerCase() === "kepala badan" || employee.id === 1);
  const isAtasan = user.role !== "Admin BKPSDM" && employee && employee.hasSub;

  const menus = [
    { key: "dashboard", label: "Dashboard Utama", icon: Home, show: true },
    { key: "profile", label: "Profil ASN", icon: UserCheck, show: user.role === "ASN" },
    { key: "raters", label: "Manajemen Evaluator", icon: Users, show: user.role === "ASN" && !isKepalaBadan },
    { key: "verification", label: "Verifikasi Atasan", icon: ClipboardCheck, show: user.role === "ASN" && isAtasan },
    { key: "assessment", label: "Kuesioner Penilaian", icon: FileText, show: user.role === "ASN" },
    { key: "results", label: "Indeks Penilaian 360", icon: Star, show: user.role === "ASN" },
    { key: "objections", label: "Sengketa Keberatan", icon: AlertTriangle, show: true },
    { key: "progress", label: "Mata Kepatuhan Unit", icon: BarChart3, show: user.role === "Admin BKPSDM" || isAtasan || isKepalaBadan },
    { key: "reports", label: "Rekap Laporan", icon: Download, show: user.role === "Admin BKPSDM" || isKepalaBadan },
    { key: "dataAsn", label: "Master Data ASN", icon: UserCheck, show: user.role === "Admin BKPSDM" },
    { key: "unitCrud", label: "Master Unit Kerja", icon: Home, show: user.role === "Admin BKPSDM" },
    { key: "jobCrud", label: "Master Jabatan", icon: ClipboardCheck, show: user.role === "Admin BKPSDM" },
    { key: "settings", label: "Setelan Sistem", icon: Settings, show: user.role === "Admin BKPSDM" },
    { key: "userManual", label: "Panduan Aplikasi", icon: HelpCircle, show: true },
    { key: "changePassword", label: "Ganti Kata Sandi", icon: Lock, show: true },
  ].filter((m) => m.show);

  const displayRole = user.role === "Admin BKPSDM"
    ? "Admin BKPSDM"
    : isKepalaBadan
    ? "Kepala Badan"
    : isAtasan
    ? "Atasan Langsung"
    : "Pegawai ASN";

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-56 transform border-r-2 border-slate-950 bg-blue-950 p-3 shadow-xl lg:shadow-none transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} font-display flex flex-col justify-between shrink-0 h-auto lg:h-[calc(100vh-4rem)]`}>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Minimal badge for navigation focus context */}
          <div className="mb-4 rounded-xl bg-yellow-300 border-2 border-slate-950 p-2.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <div className="text-[9px] font-black text-slate-950 uppercase tracking-widest leading-none">Akses Otoritas</div>
            <div className="font-black text-slate-950 text-[10.5px] uppercase tracking-wide mt-1.5 leading-none">⚡ {displayRole}</div>
          </div>
          
          <nav className="space-y-1.5 overflow-y-auto pr-1 flex-1 select-none">
            {menus.map((m) => {
              const Icon = m.icon;
              const isSelected = active === m.key;
              return (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => {
                    setActive(m.key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[10.5px] font-black uppercase tracking-wider transition-all duration-100 border-2 ${
                    isSelected 
                      ? "bg-cyan-300 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" 
                      : "text-blue-100 bg-blue-900/40 border-transparent hover:border-slate-950 hover:bg-blue-900/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" /> 
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
 
        <div className="border-t-2 border-slate-950/20 pt-4 mt-auto">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-500 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all duration-100"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" /> 
            Keluar Sistem
          </button>
          <div className="mt-3 text-[9px] text-blue-300 text-center font-mono font-bold">
            v2.4.2 PREMIUM NAVY ⚡
          </div>
        </div>
      </div>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

// ---------------------------------------------
// TOPBAR COMPONENT
// ---------------------------------------------
interface TopbarProps {
  title: string;
  user: DemoAccount;
  setOpen: (open: boolean) => void;
  syncing?: boolean;
  cloudSynced?: boolean;
  syncError?: string | null;
  cloudError?: string | null;
  onRefreshCloud?: () => void;
}

export function Topbar({
  title,
  user,
  setOpen,
  syncing = false,
  cloudSynced = false,
  syncError = null,
  cloudError = null,
  onRefreshCloud
}: TopbarProps) {
  const cloudConfig = getSupabaseConfig();
  return (
    <header className="h-16 bg-blue-950 border-b-4 border-slate-950 text-white flex items-center justify-between px-4 lg:px-6 shrink-0 select-none font-display shadow-[0_4px_0_0_rgba(15,23,42,1)] z-10">
      <div className="flex items-center gap-3">
        {/* Toggle Menu Button for mobile */}
        <button
          type="button"
          className="rounded-xl border-2 border-slate-950 bg-blue-600 p-1.5 lg:hidden hover:bg-blue-500 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white font-bold"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-4 w-4 text-white stroke-[3]" />
        </button>
        
        {/* Logo and title */}
        <div className="flex items-center gap-2.5">
          <BkpsdmLogo size="sm" variant="light" />
          <div className="h-6 border-r border-blue-900 hidden sm:block" />
          <span className="hidden sm:inline-flex items-center bg-yellow-300 border-2 border-slate-950 text-slate-950 text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            E-KINERJA 360
          </span>
        </div>

        {/* Active view identifier badge */}
        <span className="hidden sm:inline-block ml-4 text-[9px] bg-emerald-400 border-2 border-slate-950 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ✨ {title}
        </span>

        {cloudConfig.isEnabled && (
          <div className="hidden md:flex items-center gap-2">
            {syncing ? (
              <span className="inline-flex items-center gap-1.5 bg-yellow-300 border-2 border-slate-950 text-slate-950 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                <RefreshCw className="h-2.5 w-2.5 animate-spin duration-1000" />
                Mengupdate Server...
              </span>
            ) : syncError ? (
              <span title={syncError} className="inline-flex items-center gap-1 bg-red-400 border-2 border-slate-950 text-white text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ⚠️ Gagal Sync ke Cloud
              </span>
            ) : cloudSynced ? (
              <span className="inline-flex items-center gap-1 bg-emerald-400 border-2 border-slate-950 text-slate-950 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                Tersinkronisasi Cloud
              </span>
            ) : cloudError ? (
              <span className="inline-flex items-center gap-1 bg-amber-400 border-2 border-slate-950 text-slate-950 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Mode Offline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-sky-200 border-2 border-slate-950 text-sky-950 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ☁️ Cloud Supabase
              </span>
            )}

            {onRefreshCloud && (
              <button
                type="button"
                onClick={onRefreshCloud}
                title="Refresh & ambil data terbaru dari cloud"
                className="rounded-lg border-2 border-slate-950 bg-blue-600 p-1 hover:bg-blue-500 active:translate-y-0.5 active:shadow-none shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] text-white hover:text-yellow-200 transition-all cursor-pointer"
              >
                <RefreshCw className="h-2.5 w-2.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="hidden md:flex items-center gap-4 text-[10px] font-black border-r-2 border-slate-950 pr-6">
          <span className="text-slate-300 uppercase">Tahun Anggaran: <span className="text-yellow-300 font-black">2026</span></span>
          <span className="text-slate-300 uppercase">Status: <span className="bg-emerald-400 text-slate-950 border-2 border-slate-950 px-2 py-0.5 rounded-md font-black uppercase animate-pulse shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">AKTIF 🚀</span></span>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="text-right">
            <p className="text-xs font-black leading-tight max-w-[120px] lg:max-w-[180px] truncate text-white uppercase">{user.name}</p>
            <p className="text-[9px] text-blue-300 font-mono font-bold uppercase">{user.nip ? `NIP. ${user.nip}` : user.role}</p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-blue-600 border-2 border-slate-950 flex items-center justify-center font-black text-sm uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

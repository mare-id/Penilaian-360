import React, { useState, useEffect } from "react";
import { AppState, DemoAccount, Period, Assignment, Employee } from "./types";
import { initialState } from "./data";
import { ThemeStyles, Toast, Card, Field, Button } from "./components/UIComponents";
import { Login, Sidebar, Topbar } from "./components/AuthComponents";
import { DashboardView } from "./components/DashboardView";
import { syncMandatoryAssignments, assignmentsEqual } from "./utils";
import {
  Profile,
  RaterManagement,
  Verification,
  Assessment,
  Results,
  Objections,
  ProgressPage,
  Reports,
  ChangePasswordPage,
} from "./components/UserPages";
import { DataASNPage, UnitCrudPage, JobCrudPage } from "./components/AdminPages";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveRemoteState,
  fetchRemoteState,
  getSupabaseSQLScript
} from "./utils/supabase";
import { Database, CloudLightning, Copy, Check, Server, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";

const STORAGE_KEY = "bkpsdm-dairi-360-app-v1";

// ---------------------------------------------
// SETTINGS PAGE
// ---------------------------------------------
interface SettingsPageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
}

function SettingsPage({ state, setState, toast }: SettingsPageProps) {
  const [period, setPeriod] = useState<Period>(state.period);

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

    if (w.Atasan + w.Peer + (w.Bawahan || 0) !== 100) {
      return toast("Total bobot ASN dengan bawahan harus 100%.");
    }
    if (n.Atasan + n.Peer !== 100) {
      return toast("Total bobot ASN tanpa bawahan harus 100%.");
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

    setState((s) => ({ ...s, period }));
    toast("Setelan periodik sistem berhasil diperbarui.");
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: SYSTEM PERIOD SETTINGS */}
      <Card>
        <h2 className="text-lg font-black font-display mb-2 text-slate-900">Setelan Periode & Kepatuhan</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Judul Periode">
            <input
              className="w-full rounded-xl border p-3 font-semibold text-sm"
              value={period.name}
              onChange={(e) => setPeriod({ ...period, name: e.target.value })}
            />
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
              <option value="Final">Final</option>
            </select>
          </Field>
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
        </div>
      </Card>

      {/* SECTION 2: PERCENTAGE WEIGHTS */}
      <Card>
        <h2 className="text-lg font-black font-display mb-3 text-slate-900">Bobot Persentase Penilai</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 font-display">
            <h3 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">Jenis ASN Memiliki Bawahan (%)</h3>
            <div className="space-y-3">
              <Field label="Atasan Langsung">
                <input
                  type="number"
                  className="w-full rounded-xl border p-2.5 font-semibold text-sm bg-white"
                  value={period.weightsWithSub.Atasan}
                  onChange={(e) =>
                    setPeriod({
                      ...period,
                      weightsWithSub: { ...period.weightsWithSub, Atasan: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="Rekan Sejawat (Peer)">
                <input
                  type="number"
                  className="w-full rounded-xl border p-2.5 font-semibold text-sm bg-white"
                  value={period.weightsWithSub.Peer}
                  onChange={(e) =>
                    setPeriod({
                      ...period,
                      weightsWithSub: { ...period.weightsWithSub, Peer: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="Bawahan Langsung">
                <input
                  type="number"
                  className="w-full rounded-xl border p-2.5 font-semibold text-sm bg-white"
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

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 font-display">
            <h3 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">Jenis ASN Tanpa Bawahan (%)</h3>
            <div className="space-y-3">
              <Field label="Atasan Langsung">
                <input
                  type="number"
                  className="w-full rounded-xl border p-2.5 font-semibold text-sm bg-white"
                  value={period.weightsNoSub.Atasan}
                  onChange={(e) =>
                    setPeriod({
                      ...period,
                      weightsNoSub: { ...period.weightsNoSub, Atasan: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="Rekan Sejawat (Peer)">
                <input
                  type="number"
                  className="w-full rounded-xl border p-2.5 font-semibold text-sm bg-white"
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
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={save}>Simpan Setelan Sistem</Button>
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
  const [cloudSynced, setCloudSynced] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

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
      const synced = syncMandatoryAssignments(parsed.employees, parsed.assignments, parsed.period?.maxBawahan || 5);
      return { ...parsed, assignments: synced };
    } catch {
      const synced = syncMandatoryAssignments(initialState.employees, initialState.assignments, initialState.period?.maxBawahan || 5);
      return { ...initialState, admins: initialState.admins, assignments: synced };
    }
  });

  // Synchronise with Cloud on startup
  useEffect(() => {
    async function loadCloudData() {
      const config = getSupabaseConfig();
      if (config.isEnabled && config.url && config.anonKey) {
        setLoadingCloud(true);
        setCloudError(null);
        try {
          const remote = await fetchRemoteState();
          if (remote) {
            setState(remote);
            setCloudSynced(true);
          } else {
            setCloudError("Tabel Supabase kosong. Lakukan ekspor awal dari menu Setelan.");
          }
        } catch (err: any) {
          console.error("Gagal sinkronisasi data cloud:", err);
          setCloudError(err?.message || "Kesalahan koneksi.");
        } finally {
          setLoadingCloud(false);
        }
      }
    }
    loadCloudData();
  }, []);

  useEffect(() => {
    const synced = syncMandatoryAssignments(state.employees, state.assignments, state.period?.maxBawahan || 5);
    
    // Sinkronkan juga pendingRaters agar proposedIds hanya berisi peer setingkat (jenis)
    // yang masih valid di employees saat ini.
    let pendingRatersChanged = false;
    const syncedPendingRaters = state.pendingRaters.map((pr) => {
      const evaluee = state.employees.find((e) => e.id === pr.evalueeId);
      if (!evaluee) return pr;

      const validProposedIds = pr.proposedIds.filter((pid) => {
        const peer = state.employees.find((e) => e.id === pid);
        return peer && peer.jenis === evaluee.jenis;
      });

      if (validProposedIds.length !== pr.proposedIds.length) {
        pendingRatersChanged = true;
        const minPeer = state.period.minPeer;
        const status = validProposedIds.length < minPeer ? "Ditolak" : pr.status;
        const rejectionReason = validProposedIds.length < minPeer
          ? "Sistem mendeteksi perubahan jabatan. Jumlah rater sejawat setingkat tidak lagi memenuhi batas minimum."
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

      // Save changes to cloud asynchronously if not currently loading
      if (!loadingCloud) {
        const config = getSupabaseConfig();
        if (config.isEnabled && config.url && config.anonKey) {
          saveRemoteState(state).catch((err) => {
            console.error("Kesalahan sinkronisasi data ke Supabase:", err);
          });
        }
      }
    }
  }, [state, loadingCloud]);

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
    objections: "Sengketa Keberatan",
    progress: "Mata Kepatuhan Unit Kerja",
    reports: "Rekap Laporan",
    dataAsn: "Master Data ASN",
    unitCrud: "Master Unit Kerja",
    jobCrud: "Master Jabatan",
    settings: "Setelan Sistem",
    changePassword: "Ganti Kata Sandi",
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
      case "objections":
        return <Objections {...pageProps} />;
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
      default:
        return <DashboardView state={state} user={user} setActive={setActive} />;
    }
  };

  return (
    <>
      <ThemeStyles />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Topbar title={titles[active] || "Dashboard"} user={user} setOpen={setSidebarOpen} />
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
            <div className="mx-auto max-w-7xl w-full">{renderActiveView()}</div>
          </main>
        </div>
        <Toast message={toastMsg} onClose={() => setToastMsg("")} />
      </div>
    </>
  );
}

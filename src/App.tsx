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
import { ActivityLogsPage } from "./components/ActivityLogsPage";
import { UserManualPage } from "./components/UserManualPage";
import { DeadlineConfigPage } from "./components/DeadlineConfigPage";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveRemoteState,
  fetchRemoteState,
  getSupabaseSQLScript,
  checkServerConfig
} from "./utils/supabase";
import { Database, CloudLightning, Copy, Check, Server, RefreshCw, AlertCircle, HelpCircle, Calendar, Trash2, Plus, RotateCcw, ClipboardCheck, Users } from "lucide-react";

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
    if (!confirm("Apakah Anda yakin ingin menyimpan konfigurasi database Supabase ini?")) {
      return;
    }
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











  return (
    <div className="space-y-6">
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

      {/* SECTION 4: MENU VERIFICATION CONFIGURATION */}
      <Card className="border-t-4 border-indigo-500 overflow-hidden relative">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <ClipboardCheck className="w-24 h-24 text-indigo-900" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-3 font-display">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-500 stroke-[2.5]" />
              Pengaturan Menu Verifikasi Atasan
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Kontrol visibilitas menu verifikasi rater di dasbor akun atasan langsung (supervisor).
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Status Menu Verifikasi:</span>
            <button
              type="button"
              onClick={() => {
                const updatedVal = !(state.enableSupervisorVerification !== false);
                setState(prev => ({
                  ...prev,
                  enableSupervisorVerification: updatedVal
                }));
                toast(`Menu Verifikasi Atasan berhasil ${updatedVal ? "DIAKTIFKAN" : "DINONAKTIFKAN"} secara global!`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                (state.enableSupervisorVerification !== false) ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  (state.enableSupervisorVerification !== false) ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed font-display ${
          (state.enableSupervisorVerification !== false) 
            ? "bg-slate-50 text-slate-800 border-slate-200" 
            : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        >
          <ClipboardCheck className="w-5 h-5 text-indigo-500 shrink-0 stroke-[2]" />
          <div>
            <span className="font-extrabold block mb-0.5 text-slate-900 uppercase">
              {(state.enableSupervisorVerification !== false) ? "Menu Verifikasi: AKTIF" : "Menu Verifikasi: NONAKTIF"}
            </span>
            {(state.enableSupervisorVerification !== false) ? (
              <p>
                Atasan langsung dapat memeriksa rater rekan sejawat (peer) bawahan melalui sidebar menu **Verifikasi Atasan** dan tombol pintasan di dasbor.
              </p>
            ) : (
              <p>
                Halaman verifikasi dan pintasan usulan disembunyikan dari atasan langsung. Seluruh usulan rater bawahan langsung aktif tanpa memerlukan persetujuan manual.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 5: MENU RATERS CONFIGURATION */}
      <Card className="border-t-4 border-violet-500 overflow-hidden relative">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <Users className="w-24 h-24 text-violet-900" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-3 font-display">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500 stroke-[2.5]" />
              Pengaturan Menu Manajemen Evaluator
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Kontrol visibilitas menu manajemen evaluator (Rekan Sejawat) di sidebar dan halaman utama akun ASN.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Status Menu Evaluator:</span>
            <button
              type="button"
              onClick={() => {
                const updatedVal = !(state.enableRaterManagementMenu !== false);
                setState(prev => ({
                  ...prev,
                  enableRaterManagementMenu: updatedVal
                }));
                toast(`Menu Manajemen Evaluator berhasil ${updatedVal ? "DIAKTIFKAN" : "DINONAKTIFKAN"} secara global bagi akun ASN!`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                (state.enableRaterManagementMenu !== false) ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  (state.enableRaterManagementMenu !== false) ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed font-display ${
          (state.enableRaterManagementMenu !== false) 
            ? "bg-slate-50 text-slate-800 border-slate-200" 
            : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        >
          <Users className="w-5 h-5 text-violet-500 shrink-0 stroke-[2]" />
          <div>
            <span className="font-extrabold block mb-0.5 text-slate-900 uppercase">
              {(state.enableRaterManagementMenu !== false) ? "Menu Manajemen Evaluator: AKTIF" : "Menu Manajemen Evaluator: NONAKTIF"}
            </span>
            {(state.enableRaterManagementMenu !== false) ? (
              <p>
                Seluruh pegawai ASN dapat mengakses menu **Manajemen Evaluator** di sidebar untuk meninjau, mengusulkan, atau memverifikasi rekan sejawat yang akan melakukan audit perilaku 360°.
              </p>
            ) : (
              <p>
                Menu dan akses **Manajemen Evaluator** disembunyikan seluruhnya dari akun ASN. Ini membatasi akses rater manual dan mengarahkan pengguna hanya pada kewajiban pengisian instan.
              </p>
            )}
          </div>
        </div>
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
      if (parsed.enableSupervisorVerification === undefined) {
        parsed.enableSupervisorVerification = true;
      }
      if (parsed.enableRaterManagementMenu === undefined) {
        parsed.enableRaterManagementMenu = true;
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
      return { ...initialState, admins: initialState.admins, assignments: synced, enableSupervisorVerification: true, enableRaterManagementMenu: true };
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

  const logAction = (username: string, name: string, role: string, action: string, details: string) => {
    const newLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      username,
      name,
      role,
      action,
      details,
      ipAddress: "192.168.1." + Math.floor(Math.random() * 254 + 1)
    };
    setState(prev => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || [])]
    }));
  };
  
  const reset = () => {
    if (!confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus seluruh progres dan menyetel ulang semua data simulasi ke kondisi bawaan awal?")) {
      return;
    }
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
    activityLogs: "Log Aktivitas User",
    settings: "Setelan Sistem",
    deadlineConfig: "Pengaturan Batas Waktu Penilaian",
    changePassword: "Ganti Kata Sandi",
    userManual: "Panduan Aplikasi",
  };

  if (!user) {
    return <Login state={state} onLogin={(u) => {
      setUser(u);
      setActive("dashboard");
      const isKepala = u.role !== "Admin BKPSDM" && (state.employees.find(e => e.id === u.userId)?.jabatan?.toLowerCase() === "kepala badan" || u.userId === 1);
      const isAtasan = u.role !== "Admin BKPSDM" && state.employees.find(e => e.id === u.userId)?.hasSub;
      const displayRole = u.role === "Admin BKPSDM"
        ? "Admin BKPSDM"
        : isKepala
        ? "Kepala Badan"
        : isAtasan
        ? "Atasan Langsung"
        : "Pegawai ASN";
      logAction(u.username || u.nip, u.name, displayRole, "Autentikasi", `Berhasil masuk ke aplikasi (Otoritas ${displayRole}).`);
    }} />;
  }

  const renderActiveView = () => {
    const pageProps = { state, setState, user, toast, logAction };
    switch (active) {
      case "profile":
        return <Profile {...pageProps} />;
      case "raters":
        if (state.enableRaterManagementMenu === false) {
          return <DashboardView state={state} user={user} setActive={setActive} />;
        }
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
      case "activityLogs":
        return <ActivityLogsPage {...pageProps} />;
      case "settings":
        return <SettingsPage state={state} setState={setState} toast={toast} />;
      case "deadlineConfig":
        return <DeadlineConfigPage state={state} setState={setState} toast={toast} />;
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

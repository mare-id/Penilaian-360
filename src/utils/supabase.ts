import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppState } from "../types";

const LOCAL_CONFIG_KEY = "bkpsdm-360-supabase-config";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
  isEnabled: boolean;
}

// Default config
const DEFAULT_CONFIG: SupabaseConfig = {
  url: "",
  anonKey: "",
  tableName: "bkpsdm_360_state",
  isEnabled: false,
};

let serverHasConfig = false;

/**
 * Checks server side configuration on initial load to see if environment variables are active.
 */
export async function checkServerConfig(): Promise<boolean> {
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      if (data && data.isEnabled) {
        serverHasConfig = true;
        return true;
      }
    }
  } catch (err) {
    console.error("Gagal memeriksa konfigurasi server:", err);
  }
  return false;
}

/**
 * Gets the consolidated Supabase configuration from environment variables or custom localStorage values.
 */
export function getSupabaseConfig(): SupabaseConfig {
  // 1. If server confirms it has active config, prefer that!
  if (serverHasConfig) {
    return {
      url: "SINKRONISASI_OTOMATIS (Supabase Server-side)",
      anonKey: "SINKRONISASI_OTOMATIS",
      tableName: "bkpsdm_360_state",
      isEnabled: true,
    };
  }

  // 2. Try to get from environment variables (useful for Vercel/production)
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || "";
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";
  
  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      tableName: "bkpsdm_360_state",
      isEnabled: true,
    };
  }

  // 3. Try to get from local configuration (useful for runtime testing in AI Studio or local)
  try {
    const raw = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          tableName: parsed.tableName || "bkpsdm_360_state",
          isEnabled: parsed.isEnabled !== false,
        };
      }
    }
  } catch (err) {
    console.error("Gagal membaca konfigurasi Supabase lokal:", err);
  }

  return DEFAULT_CONFIG;
}

/**
 * Saves runtime Supabase configuration in localStorage.
 */
export function saveSupabaseConfig(config: Partial<SupabaseConfig>) {
  try {
    const current = getSupabaseConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Gagal menyimpan konfigurasi Supabase lokal:", err);
  }
}

/**
 * Instantiates the Supabase client based on the current configuration.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey || !config.isEnabled || config.url === "SINKRONISASI_OTOMATIS (Supabase Server-side)") {
    return null;
  }
  try {
    return createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false, // Kita handle sessi internal di aplikasi
      }
    });
  } catch (err) {
    console.error("Gagal inisialisasi Supabase client:", err);
    return null;
  }
}

/**
 * Tests a pair of credentials directly.
 */
export async function testSupabaseConnection(url: string, anonKey: string, tableName: string = "bkpsdm_360_state"): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/test-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, anonKey, tableName }),
    });
    if (res.ok) {
      const result = await res.json();
      return result;
    }
    if (res.status === 404 || res.status >= 500) {
      throw new Error(`API returned HTTP ${res.status}`);
    }
    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errData.message || `HTTP error ${res.status}: Hubungi administrator.`
    };
  } catch (err: any) {
    try {
      const client = createClient(url, anonKey, { auth: { persistSession: false } });
      const { data, error } = await client
        .from(tableName)
        .select("id")
        .limit(1);

      if (error) {
        if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
          return {
            success: false,
            message: `Koneksi berhasil ke Supabase, namun tabel '${tableName}' belum dibuat atau tidak dapat diakses di database Anda. Silakan jalankan script SQL migrasi terlebih dahulu.`,
          };
        }
        return {
          success: false,
          message: `Koneksi gagal. Detail: ${error.message} (Code: ${error.code})`,
        };
      }

      return {
        success: true,
        message: "Koneksi berhasil langsung dari browser!",
      };
    } catch (clientErr: any) {
      return {
        success: false,
        message: `Gagal menghubungkan. Harap verifikasi URL dan Anon Key Anda. Detail error: ${err?.message || err}`,
      };
    }
  }
}

/**
 * Fetches the application state from Supabase.
 */
export async function fetchRemoteState(): Promise<AppState | null> {
  // 1. Try server-side proxy
  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      const data = await res.json();
      if (data && data.state) {
        return data.state as AppState;
      }
    }
  } catch (err) {
    console.error("Gagal memuat state dari API server, beralih ke direct client-side fallback:", err);
  }

  // 2. Direct client-side fallback if configured locally
  const config = getSupabaseConfig();
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from(config.tableName)
      .select("state")
      .eq("id", "active_state")
      .maybeSingle();

    if (error) {
      console.error("Gagal memuat state dari Supabase:", error);
      return null;
    }

    if (data && data.state) {
      return data.state as AppState;
    }
  } catch (err) {
    console.error("Error tidak terduga saat memuat state dari Supabase:", err);
  }
  return null;
}

/**
 * Saves the application state to Supabase.
 */
export async function saveRemoteState(state: AppState): Promise<boolean> {
  // 1. Try server-side proxy first
  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return true;
      }
    }
  } catch (err) {
    console.error("Gagal menyimpan state ke API server, beralih ke direct client-side fallback:", err);
  }

  // 2. Direct client-side fallback if configured locally
  const config = getSupabaseConfig();
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Upsert the full state in the single-row config table
    const { error } = await client
      .from(config.tableName)
      .upsert({
        id: "active_state",
        state: state,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id"
      });

    if (error) {
      console.error("Gagal menyimpan state ke Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error tidak terduga saat menyimpan state ke Supabase:", err);
    return false;
  }
}

/**
 * SQL script helper that we can show to the admin in the UI.
 */
export function getSupabaseSQLScript(tableName: string = "bkpsdm_360_state"): string {
  return `-- ==========================================
-- SCRIPT SQL PEMBUATAN TABEL SUPABASE BKPSDM 360
-- Jalankan query SQL ini di Supabase SQL Editor Anda
-- ==========================================

-- Buat tabel penyimpanan utama
create table if not exists public.${tableName} (
    id text primary key,
    state jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Atur kebijakan keamanan (RLS / Row Level Security)
-- Agar dapat diakses publik/anonim tanpa login Supabase auth, buat kebijakan berikut:
alter table public.${tableName} enable row level security;

create policy "Izinkan semua akses baca publik" 
on public.${tableName} for select 
using (true);

create policy "Izinkan admin menyisipkan/memperbarui data" 
on public.${tableName} for all 
using (true)
with check (true);

-- Aktifkan replikasi real-time (opsional, untuk instan responsif)
alter table public.${tableName} replica identity full;
`;
}

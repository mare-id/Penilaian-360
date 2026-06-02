import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads up to 10MB (to support full state structure)
  app.use(express.json({ limit: "10mb" }));

  // Supabase Initialisation
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  const tableName = "bkpsdm_360_state";

  console.log("Initializing Supabase check...");
  if (supabaseUrl && supabaseKey) {
    console.log(`Supabase is configured with URL: ${supabaseUrl.substring(0, 20)}...`);
  } else {
    console.warn("⚠️ Warning: Supabase environment variables are missing on the server.");
  }

  const getSupabaseClient = () => {
    // Dynamic initialization so changes in process.env are caught if updated
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    if (!url || !key) return null;
    return createClient(url, key, {
      auth: { persistSession: false }
    });
  };

  // API 1: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API 2: Get server-side configuration status
  app.get("/api/config", (req, res) => {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    res.json({
      isEnabled: !!(url && key),
      url: url ? `${url.substring(0, 25)}...` : "",
      tableName: tableName,
      hasEnvVars: !!(url && key)
    });
  });

  // API 3: Fetch app state from Supabase
  app.get("/api/state", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.status(503).json({
        error: "Supabase is not configured on the server. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env/secrets."
      });
    }

    try {
      const { data, error } = await client
        .from(tableName)
        .select("state")
        .eq("id", "active_state")
        .maybeSingle();

      if (error) {
        console.error("Error fetching state from Supabase:", error);
        return res.status(500).json({ error: error.message });
      }

      if (data && data.state) {
        return res.json({ state: data.state });
      } else {
        return res.json({ state: null, message: "No active state found in database." });
      }
    } catch (err: any) {
      console.error("Unexpected error fetching remote state:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // API 4: Save app state to Supabase
  app.post("/api/state", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.status(503).json({
        error: "Supabase is not configured on the server. Please add environment variables."
      });
    }

    const { state } = req.body;
    if (!state) {
      return res.status(400).json({ error: "Missing state payload." });
    }

    try {
      const { error } = await client
        .from(tableName)
        .upsert({
          id: "active_state",
          state: state,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "id"
        });

      if (error) {
        console.error("Error saving state to Supabase:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Unexpected error saving remote state:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // API 5: Test connection and create table if useful
  app.post("/api/test-db", async (req, res) => {
    const { url, anonKey } = req.body;
    // Use either request parameters (for temporary testing in settings) or default environment vars
    const targetUrl = url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const targetKey = anonKey || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

    if (!targetUrl || !targetKey) {
      return res.status(400).json({ success: false, message: "Harap konfigurasikan URL dan Anon Key Supabase." });
    }

    try {
      const testClient = createClient(targetUrl, targetKey, { auth: { persistSession: false } });
      const { data, error } = await testClient
        .from(tableName)
        .select("id")
        .limit(1);

      if (error) {
        if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
          return res.json({
            success: false,
            message: `Koneksi berhasil ke Supabase, namun tabel '${tableName}' belum dibuat. Silakan jalankan script SQL migrasi terlebih dahulu.`
          });
        }
        return res.json({ success: false, message: `Koneksi gagal: ${error.message} (Code: ${error.code})` });
      }

      return res.json({ success: true, message: "Koneksi ke database Supabase berhasil dan aktif!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: `Gagal menghubungkan: ${err.message || err}` });
    }
  });

  // Hot module replacement workaround for dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to start the express server:", err);
});

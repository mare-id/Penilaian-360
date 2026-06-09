import React, { useState } from "react";
import { Search, User, Shield, Key, Eye, Trash2, Download, Filter, RefreshCw, Smartphone, Monitor } from "lucide-react";
import { AppState, ActivityLog } from "../types";
import { Card, Badge, Button } from "./UIComponents";

interface PageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
}

export function ActivityLogsPage({ state, setState, toast }: PageProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [limit, setLimit] = useState(50);

  const logs: ActivityLog[] = state.activityLogs || [];

  // Filter and search logic
  const filteredLogs = logs.filter((log) => {
    const textSearch = `${log.name} ${log.username} ${log.details} ${log.action}`.toLowerCase();
    const matchesSearch = textSearch.includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || log.role === roleFilter;
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesRole && matchesAction;
  });

  // Get unique action names for filter select
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  const handleClearLogs = () => {
    if (confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin mengosongkan seluruh riwayat log aktivitas pengguna secara permanen?")) {
      setState((prev) => ({
        ...prev,
        activityLogs: []
      }));
      toast("Seluruh riwayat log aktivitas berhasil dibersihkan.");
    }
  };

  // Humanize timestamps nicely
  const formatTime = (isoString: string) => {
    try {
      const dt = new Date(isoString);
      return dt.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "autentikasi":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "konfigurasi sistem":
      case "konfigurasi periode":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "verifikasi rater":
      case "verifikasi atasan":
        return "bg-violet-50 border-violet-200 text-violet-700";
      case "pengisian kuesioner":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      case "master data asn":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "ubah password":
        return "bg-neutral-100 border-neutral-300 text-neutral-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role.includes("Admin")) {
      return "bg-red-500 text-white border-red-600";
    }
    if (role.includes("Kepala")) {
      return "bg-amber-500 text-slate-950 border-amber-600";
    }
    if (role.toLowerCase().includes("atasan")) {
      return "bg-purple-600 text-white border-purple-700";
    }
    return "bg-slate-700 text-white border-slate-800";
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-black font-display text-slate-950 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-600 stroke-[2.5]" />
            Audit Log & Aktivitas Pengguna
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar lengkap rekaman riwayat operasional, modul login, pengisian instrumen, dan penyesuaian penatausahaan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Bersihkan Log
          </Button>
        </div>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Total Entri Log</span>
          <span className="text-2xl font-black font-display text-slate-950">{logs.length}</span>
        </div>
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Aktivitas Hari Ini</span>
          <span className="text-2xl font-black font-display text-emerald-600">{logs.filter(l => l.timestamp.startsWith("2026-06-09") || l.timestamp.startsWith("2026-06-08")).length}</span>
        </div>
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Pelaku Mandiri</span>
          <span className="text-2xl font-black font-display text-indigo-600">
            {Array.from(new Set(logs.map(l => l.username))).length} Pengguna
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <Card className="p-4 border-2 border-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-[11px] font-black uppercase text-slate-950 block mb-1.5 font-display">
              Cari Entri Log
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, NIP, detil operasi, tindakan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border-2 border-slate-950 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-950 block mb-1.5 font-display">
              Filter Otoritas Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2.5 text-sm border-2 border-slate-950 bg-white rounded-xl outline-none font-semibold"
            >
              <option value="ALL">Semua Peran</option>
              <option value="Admin BKPSDM">Admin BKPSDM</option>
              <option value="Atasan Langsung">Atasan Langsung</option>
              <option value="Pegawai ASN">Pegawai ASN</option>
              <option value="Kepala Badan">Kepala Badan</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-950 block mb-1.5 font-display">
              Filter Jenis Tindakan
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full p-2.5 text-sm border-2 border-slate-950 bg-white rounded-xl outline-none font-semibold"
            >
              <option value="ALL">Semua Tindakan</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* LOG LIST / TABLE */}
      <Card className="overflow-hidden border-2 border-slate-950 p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-4 bg-slate-950 border-b-2 border-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs font-black text-white font-display uppercase tracking-wider">
              Rekahan Catatan Aktivitas Real-time
            </span>
          </div>
          <span className="text-[10px] bg-indigo-900 border border-indigo-700 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
            Menampilkan {Math.min(filteredLogs.length, limit)} entri teratas
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-white">
            <Search className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3" />
            <h3 className="text-sm font-black text-slate-700 font-display">Tidak Ada Log yang Cocok</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cobalah untuk mengubah kueri pencarian atau filter peran/tindakan Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-950">
                  <th className="p-3 text-[10px] font-black text-slate-500 uppercase font-mono tracking-wide w-48">Waktu & Tanggal</th>
                  <th className="p-3 text-[10px] font-black text-slate-500 uppercase font-mono tracking-wide w-56">Actor Pengguna</th>
                  <th className="p-3 text-[10px] font-black text-slate-500 uppercase font-mono tracking-wide w-40">Tindakan</th>
                  <th className="p-3 text-[10px] font-black text-slate-500 uppercase font-mono tracking-wide">Keterangan / Detil Aktivitas</th>
                  <th className="p-3 text-[10px] font-black text-slate-500 uppercase font-mono tracking-wide w-32">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filteredLogs.slice(0, limit).map((log) => (
                  <tr key={log.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-600 leading-normal">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 font-display">
                          {log.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          NIP/USN. {log.username}
                        </span>
                        <div className="mt-1">
                          <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wide border ${getRoleBadgeColor(log.role)}`}>
                            {log.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={`border text-[9.5px] font-extrabold uppercase ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 leading-relaxed font-semibold text-slate-700">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[10.5px] font-extrabold text-indigo-500">
                      🖥️ {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredLogs.length > limit && (
          <div className="p-4 bg-slate-50 text-center border-t border-slate-200">
            <button
              onClick={() => setLimit((prev) => prev + 50)}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-2 font-display"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Tampilkan 50 Entri Log Selanjutnya...
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

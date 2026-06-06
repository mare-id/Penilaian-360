import React, { useEffect } from "react";
import { CheckCircle2, LucideIcon, XCircle } from "lucide-react";

export function ThemeStyles() {
  return (
    <style>{`
      :root {
        --theme-primary: #1e3a8a; /* Bold Navy Blue */
        --theme-primary-soft: #eff6ff; /* Soft Light Blue */
        --theme-primary-hover: #172554; /* Deep Ocean Navy */
        --theme-border: #0b1329; /* Slate 900 (Thick outlines) */
        --theme-bg: #f1f5f9; /* Slate 100 base */
        --theme-text-dark: #0b1329; /* Slate 900 */
        --theme-text-medium: #1e293b; /* Slate 800 */
        --theme-text-muted: #475569; /* Slate 600 */
      }

      html, body, #root {
        background-color: #f1f5f9 !important;
        color: var(--theme-text-medium) !important;
        font-family: "Inter", -apple-system, sans-serif;
      }

      body {
        margin: 0;
        font-size: 0.825rem;
      }

      /* Custom scrollbar to look very neat and Navy themed */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
        border: 2px solid #0b1329;
        border-radius: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background: #3b82f6;
        border: 2px solid #0b1329;
        border-radius: 8px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #1d4ed8;
      }

      /* Heading typography & Neo-Brutalist weights */
      h1, h2, h3, h4, h5, h6, .font-display {
        font-family: "Space Grotesk", sans-serif !important;
        font-weight: 850 !important;
        letter-spacing: -0.02em;
        color: #0b1329 !important;
      }

      .logo-dairi-text-light.font-display {
        color: #ffffff !important;
      }

      .logo-dairi-text-colored.font-display {
        color: #0089a3 !important;
      }

      .font-mono {
        font-family: "JetBrains Mono", monospace !important;
      }

      /* Input controls: Neo-brutalist solid borders and focus shadows */
      input, select, textarea {
        font-size: 0.75rem !important;
        padding: 0.5rem 0.75rem !important;
        border-radius: 12px !important;
        border: 2px solid #0b1329 !important;
        background-color: #ffffff !important;
        color: #0b1329 !important;
        box-shadow: 2px 2px 0px 0px #0b1329 !important;
        transition: all 0.1s ease;
      }
      input:focus, select:focus, textarea:focus {
        background-color: #ffffff !important;
        box-shadow: 4px 4px 0px 0px #1e3a8a !important;
        transform: translate(-1.5px, -1.5px);
        outline: none !important;
      }

      /* Tables styling - crisp, bold, playful */
      table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
        width: 100%;
        border: 2px solid #0b1329 !important;
        background: #ffffff !important;
        border-radius: 14px !important;
        overflow: hidden !important;
        box-shadow: 3px 3px 0px 0px #0b1329 !important;
      }
      
      table thead tr {
        background-color: #1e3a8a !important; /* Bold Navy header */
        border-bottom: 2px solid #0b1329 !important;
      }

      table th {
        font-family: "Space Grotesk", sans-serif !important;
        font-size: 10px !important;
        font-weight: 950 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        color: #ffffff !important;
        padding: 0.65rem 0.75rem !important;
        border-right: 2px solid #0b1329 !important;
        border-bottom: 2px solid #0b1329 !important;
      }
      table th:last-child {
        border-right: none !important;
      }

      table td {
        font-size: 0.75rem !important;
        padding: 0.625rem 0.75rem !important;
        color: #1e293b !important;
        border-bottom: 2px solid #0b1329 !important;
        border-right: 2px solid #0b1329 !important;
      }
      table tr:last-child td {
        border-bottom: none !important;
      }
      table td:last-child {
        border-right: none !important;
      }

      /* Hover rows with highlight */
      table tbody tr:hover {
        background-color: #eff6ff !important;
      }
    `}</style>
  );
}

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  return (
    <span className={`inline-flex items-center rounded-full border-2 border-slate-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  return (
    <div className={`rounded-2xl border-2 border-slate-950 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-150 ${className}`}>
      {children}
    </div>
  );
}

interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  key?: React.Key;
}

export function Button({ id, children, variant = "primary", className = "", type = "button", disabled = false, onClick }: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 text-white border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    secondary: "bg-cyan-200 text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-cyan-100 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    danger: "bg-rose-400 text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-rose-300 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    success: "bg-emerald-400 text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-emerald-300 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    warning: "bg-amber-300 text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-amber-250 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    ghost: "bg-transparent text-slate-950 hover:bg-slate-100 border border-transparent",
  };
  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant] || styles.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-900">{label}</span>
      {children}
    </label>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-4 overflow-hidden rounded-full border-2 border-slate-950 bg-slate-100 ${className} shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]`}>
      <div 
        className="h-full rounded-full bg-blue-600 border-r-2 border-slate-950 transition-all font-display" 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
      />
    </div>
  );
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2605);
    return () => clearTimeout(t);
  }, [message, onClose]);
  
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-2xl border-2 border-slate-950 bg-yellow-300 px-5 py-4 text-xs font-black text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-display animate-bounce">
      <div className="flex items-center gap-2">
        <span className="text-base">✨</span>
        {message}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "slate" | "blue" | "emerald" | "yellow" | "red";
  note?: string;
}

export function StatCard({ icon: Icon, label, value, tone = "slate", note }: StatCardProps) {
  const toneClasses = {
    slate: "bg-white border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]",
    blue: "bg-blue-100 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]",
    emerald: "bg-emerald-100 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]",
    yellow: "bg-amber-100 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]",
    red: "bg-rose-100 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]",
  };
  return (
    <div className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all hover:scale-[1.02] ${toneClasses[tone] || toneClasses.slate} duration-150`}>
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none block">{label}</p>
          <div className="p-1 rounded-lg border-2 border-slate-950 bg-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
            <Icon className="h-4 w-4 text-slate-950" />
          </div>
        </div>
        <p className="text-2xl font-black text-slate-900 font-display leading-tight">{value}</p>
      </div>
      {note && (
        <p className="mt-2 text-[10px] text-slate-950 font-bold font-mono uppercase bg-white/70 p-1 rounded-lg border-2 border-slate-950 text-center leading-none">
          {note}
        </p>
      )}
    </div>
  );
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-950 bg-purple-50/50 p-8 text-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
      <XCircle className="mx-auto mb-3 h-10 w-10 text-rose-500 animate-pulse" />
      <h3 className="font-black text-slate-950 font-display text-lg">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-700 font-bold">{text}</p>
    </div>
  );
}

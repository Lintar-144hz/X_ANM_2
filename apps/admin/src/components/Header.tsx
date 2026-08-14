import React, { useState, useEffect } from 'react';
import { Shield, Database, Menu, CheckCircle2, AlertCircle, RefreshCw, Activity, Copy, Check } from 'lucide-react';
import { getSupabaseCredentials, resetSupabaseInstance, checkSupabaseHealth, SupabaseHealthResult } from '@shared/supabaseClient';

interface HeaderProps {
  title: string;
  userEmail?: string;
  onToggleMobileSidebar?: () => void;
}

const SQL_MIGRATION_SCRIPT = `-- SCHEMA DATABASE SUPABASE UNTUK X ANIMASI 2
CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY,
  class_name text NOT NULL,
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  description text NOT NULL,
  hero_image_url text NOT NULL,
  footer_text text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  attendance_number integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('L', 'P')),
  photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.organization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL UNIQUE,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  custom_name text,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'published',
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Buka izin akses Read/Write untuk public/anon
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents DISABLE ROW LEVEL SECURITY;
`;

export const Header: React.FC<HeaderProps> = ({ title, userEmail, onToggleMobileSidebar }) => {
  const { url, key, isConfigured } = getSupabaseCredentials();
  const [openModal, setOpenModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(url);
  const [inputKey, setInputKey] = useState(key);
  const [savedMsg, setSavedMsg] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Live health-check state
  const [health, setHealth] = useState<SupabaseHealthResult | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);

  const runHealthCheck = async () => {
    setTestingHealth(true);
    try {
      const res = await checkSupabaseHealth();
      setHealth(res);
    } catch {
      setHealth({
        ok: false,
        status: 'error',
        message: 'Gagal menjalankan uji koneksi Supabase.',
        timestamp: Date.now()
      });
    } finally {
      setTestingHealth(false);
    }
  };

  useEffect(() => {
    runHealthCheck();

    const handleDataChanged = () => runHealthCheck();
    window.addEventListener('x_animasi_data_changed', handleDataChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleDataChanged);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) return;
    resetSupabaseInstance(inputUrl.trim(), inputKey.trim());
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      setOpenModal(false);
      window.location.reload();
    }, 800);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isActive = health ? health.ok : isConfigured;

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between text-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">{title}</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[180px] sm:max-w-none">
              Content Management System • X ANIMASI 2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active/Inactive Supabase Live Indicator */}
          <button
            onClick={() => {
              setOpenModal(true);
              runHealthCheck();
            }}
            title={
              isActive
                ? `Supabase Aktif (${health?.latencyMs ? `${health.latencyMs}ms - ` : ''}${health?.message || 'Terhubung'})`
                : `Supabase Nonaktif: ${health?.message || 'Belum terhubung'}`
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md cursor-pointer ${
              testingHealth && !health
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/90 shadow-cyan-500/20'
                : isActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/90 shadow-emerald-500/20'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900/90 shadow-rose-500/20'
            }`}
          >
            {/* Blinking Dot Indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  testingHealth && !health ? 'bg-cyan-400' : isActive ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  testingHealth && !health ? 'bg-cyan-500' : isActive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>

            <Database className="w-3.5 h-3.5" />
            <span className="tracking-wide flex items-center gap-1.5">
              {testingHealth && !health ? (
                <span className="text-cyan-300 font-bold">Memeriksa...</span>
              ) : isActive ? (
                <>
                  <span className="text-emerald-300 font-extrabold">Supabase Aktif</span>
                  {health?.latencyMs !== undefined && (
                    <span className="text-[10px] text-emerald-400/80 font-mono hidden sm:inline">
                      {health.latencyMs}ms
                    </span>
                  )}
                </>
              ) : (
                <span className="text-rose-300 font-extrabold">Supabase Nonaktif</span>
              )}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-800">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-200 font-medium truncate max-w-[90px] sm:max-w-[150px]">
              {userEmail || 'admin@animasi2.sch.id'}
            </span>
          </div>
        </div>
      </header>

      {openModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Status & Health Check Supabase</h3>
                  <p className="text-xs text-slate-400">Pusat monitoring dan konfigurasi database Supabase</p>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Health-Check Diagnostics Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">Status Diagnostik Koneksi</span>
                </div>
                <button
                  type="button"
                  onClick={runHealthCheck}
                  disabled={testingHealth}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${testingHealth ? 'animate-spin text-cyan-400' : ''}`} />
                  {testingHealth ? 'Menguji...' : 'Uji Koneksi'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {health?.ok ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Koneksi Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Koneksi Terputus / Nonaktif
                  </span>
                )}

                {health?.latencyMs !== undefined && (
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    Latency: {health.latencyMs} ms
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {health?.message || (isConfigured ? 'Memeriksa kestabilan koneksi instance...' : 'Kredensial belum dikonfigurasi.')}
              </p>
            </div>

            {/* SQL Script Quick Copy */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Butuh script skema tabel Supabase?</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Tersalin!' : 'Salin Script SQL'}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzproject.supabase.co"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  VITE_SUPABASE_ANON_KEY
                </label>
                <textarea
                  rows={3}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              {savedMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Kredensial disimpan! Memuat ulang...
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Simpan & Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

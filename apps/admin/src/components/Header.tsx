import React, { useState } from 'react';
import { User, Shield, Database, Menu, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { getSupabaseCredentials, resetSupabaseInstance } from '@shared/supabaseClient';

interface HeaderProps {
  title: string;
  userEmail?: string;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, userEmail, onToggleMobileSidebar }) => {
  const { url, key, isConfigured } = getSupabaseCredentials();
  const [openModal, setOpenModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(url);
  const [inputKey, setInputKey] = useState(key);
  const [savedMsg, setSavedMsg] = useState(false);

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
          <button
            onClick={() => setOpenModal(true)}
            title={isConfigured ? 'Database Cloud Supabase Terhubung & Aktif' : 'Database Supabase Tidak Aktif (Menggunakan Local Storage)'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md cursor-pointer ${
              isConfigured
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/90 shadow-emerald-500/20'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900/90 shadow-rose-500/20'
            }`}
          >
            {/* Blinking / Flashing Dot Indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConfigured ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isConfigured ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>

            <Database className="w-3.5 h-3.5" />
            <span className="tracking-wide">
              {isConfigured ? (
                <span className="text-emerald-300 font-extrabold">Supabase Aktif</span>
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Status & Konfigurasi Supabase</h3>
                  <p className="text-xs text-slate-400">Hubungkan database Supabase Cloud untuk admin</p>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
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

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Simpan & Hubungkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};



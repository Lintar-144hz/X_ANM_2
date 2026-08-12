import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Key, ExternalLink, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, resetSupabaseInstance } from '@shared/supabaseClient';

interface SupabaseBannerProps {
  onConfigured?: () => void;
}

export const SupabaseBanner: React.FC<SupabaseBannerProps> = ({ onConfigured }) => {
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
      if (onConfigured) onConfigured();
      window.location.reload();
    }, 800);
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Status Supabase:
            </span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                Terhubung ke Supabase Cloud
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full text-[11px]">
                <AlertCircle className="w-3 h-3" />
                Demo / Local Mode (Klik untuk Sambungkan Supabase Cloud)
              </span>
            )}
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:underline text-[11px]"
          >
            <Key className="w-3 h-3" />
            {isConfigured ? 'Ubah Kredensial Supabase' : 'Hubungkan Supabase Database'}
          </button>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Konfigurasi Supabase Project</h3>
                  <p className="text-xs text-slate-400">Hubungkan database Supabase asli untuk aplikasi X ANIMASI 2</p>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
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

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <p className="font-medium text-slate-300">Petunjuk Setup Database:</p>
                <p>1. Buat project baru di Supabase.com</p>
                <p>2. Jalankan SQL migration dari file <code className="text-cyan-400">supabase/migrations/20260812000000_initial_schema.sql</code> di SQL Editor Supabase.</p>
                <p>3. Salin URL dan Anon Key dari Settings &gt; API ke form ini.</p>
              </div>

              {savedMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Kredensial berhasil disimpan! Merefresh aplikasi...
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

import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Users, Award, Calendar, Newspaper, ArrowRight, Zap, CloudUpload, CheckCircle2, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { checkSupabaseHealth, SupabaseHealthResult } from '@shared/supabaseClient';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [orgCount, setOrgCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [health, setHealth] = useState<SupabaseHealthResult | null>(null);

  const loadStats = async () => {
    setLoading(true);
    const [st, cnt, sch, org] = await Promise.all([
      DataStore.getStudents(),
      DataStore.getContents(),
      DataStore.getSchedules(),
      DataStore.getOrganization()
    ]);
    setStudentCount(st.length);
    setContentCount(cnt.length);
    setScheduleCount(sch.length);
    setOrgCount(org.length);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
    checkSupabaseHealth().then(setHealth);

    const handleDataChanged = () => {
      loadStats();
      checkSupabaseHealth().then(setHealth);
    };
    window.addEventListener('x_animasi_data_changed', handleDataChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleDataChanged);
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await DataStore.syncAllLocalDataToSupabase();
      setSyncResult(res);
      await loadStats();
      const h = await checkSupabaseHealth();
      setHealth(h);
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err?.message || 'Gagal sinkronisasi data ke Supabase.'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Ringkasan Sistem Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang di CMS X ANIMASI 2</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Kelola data siswa, struktur organisasi, jadwal piket harian, pengumuman, dan pengaturan website utama dalam satu tempat secara realtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={handleSyncToSupabase}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            <span>{syncing ? 'Menyinkronkan...' : 'Sinkronkan Data HP ke Cloud'}</span>
          </button>

          <button
            onClick={() => onNavigate('/siswa')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 whitespace-nowrap flex items-center gap-1.5"
          >
            Kelola Siswa <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncResult && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
            syncResult.success
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {syncResult.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <div>
              <p className="text-xs font-bold">{syncResult.message}</p>
              {syncResult.success && (
                <p className="text-[11px] text-emerald-400/80">
                  Data siswa, jadwal piket, struktur organisasi, dan konten kini sudah online di Supabase dan dapat dilihat oleh semua teman Anda di perangkat masing-masing.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setSyncResult(null)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/40"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Siswa', count: studentCount, icon: Users, color: 'text-cyan-400', route: '/siswa' },
          { label: 'Pengurus Organisasi', count: orgCount, icon: Award, color: 'text-amber-400', route: '/organisasi' },
          { label: 'Jadwal Piket', count: scheduleCount, icon: Calendar, color: 'text-emerald-400', route: '/piket' },
          { label: 'Pengumuman / Konten', count: contentCount, icon: Newspaper, color: 'text-purple-400', route: '/konten' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.route)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`p-2 rounded-xl bg-slate-800 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                {loading ? '...' : card.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cloud Sync Status Info Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Status Sinkronisasi Cloud Supabase
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                health?.ok ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {health?.ok ? 'Online' : 'Perlu Run SQL / Cek Koneksi'}
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {health?.message || 'Database Supabase terhubung ke project xdptlclwxrcmzalhxtvh.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncToSupabase}
          disabled={syncing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors whitespace-nowrap"
        >
          <CloudUpload className="w-3.5 h-3.5 text-cyan-400" />
          Upload Data HP ke Cloud
        </button>
      </div>

      {/* Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Akses Cepat Pengelolaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            onClick={() => onNavigate('/siswa')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2"
          >
            <h4 className="font-semibold text-white text-sm">Tambah atau Edit Siswa</h4>
            <p className="text-xs text-slate-400">Atur nomor absen, foto profil, dan data jenis kelamin siswa.</p>
          </div>

          <div
            onClick={() => onNavigate('/konten')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2"
          >
            <h4 className="font-semibold text-white text-sm">Buat Pengumuman Baru</h4>
            <p className="text-xs text-slate-400">Publikasikan pengumuman atau artikel kegiatan kelas terbaru.</p>
          </div>

          <div
            onClick={() => onNavigate('/settings')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2"
          >
            <h4 className="font-semibold text-white text-sm">Ubah Tampilan Hero Website</h4>
            <p className="text-xs text-slate-400">Ganti judul hero, gambar banner, dan deskripsi utama website.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

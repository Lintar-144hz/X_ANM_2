import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Users, Award, Calendar, Newspaper, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [orgCount, setOrgCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadStats();

    const handleDataChanged = () => loadStats();
    window.addEventListener('x_animasi_data_changed', handleDataChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleDataChanged);
  }, []);

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

        <button
          onClick={() => onNavigate('/siswa')}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 whitespace-nowrap z-10 flex items-center gap-1.5"
        >
          Kelola Siswa <ArrowRight className="w-4 h-4" />
        </button>
      </div>

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

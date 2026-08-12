import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { SiteSettings, Student, OrganizationMember, ScheduleItem, ContentItem } from '@shared/types';
import { Sparkles, ArrowRight, Users, Award, Calendar, Newspaper, Clapperboard, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (path: string, param?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [org, setOrg] = useState<OrganizationMember[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [st, std, og, sch, cnt] = await Promise.all([
        DataStore.getSettings(),
        DataStore.getStudents(),
        DataStore.getOrganization(),
        DataStore.getSchedules(),
        DataStore.getContents(true)
      ]);
      setSettings(st);
      setStudents(std);
      setOrg(og);
      setSchedules(sch);
      setContents(cnt);
      setLoading(false);
    };

    loadData();

    const handleDataChanged = () => loadData();
    window.addEventListener('x_animasi_data_changed', handleDataChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleDataChanged);
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Memuat website kelas...</span>
        </div>
      </div>
    );
  }

  // Determine today's day for quick piket preview
  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const todayName = days[new Date().getDay() - 1] || 'Senin';
  const todayPiket = schedules.filter(s => s.day === todayName);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section - Apple Style Minimalist Luxury */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-cyan-400 font-medium shadow-xl backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Portal • {settings.class_name}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            {settings.hero_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => onNavigate('/organisasi')}
              className="px-7 py-3.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-semibold text-sm shadow-xl hover:shadow-cyan-500/10 transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              Kenali Kelas Kami
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/siswa')}
              className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Lihat Anggota ({students.length})
            </button>
          </motion.div>
        </div>

        {/* Hero Visual Banner Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group"
        >
          <img
            src={settings.hero_image_url}
            alt={settings.class_name}
            className="w-full h-[320px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
                Tentang Kelas
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow-md">
                {settings.description}
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 text-center">
                <span className="block text-xl font-bold text-white">{students.length}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Siswa</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 text-center">
                <span className="block text-xl font-bold text-cyan-400">9</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Pengurus</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 text-center">
                <span className="block text-xl font-bold text-indigo-400">2026</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Angkatan</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Struktur Organisasi Quick View */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 block mb-1">
              Kepemimpinan & Struktur
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pengurus Kelas {settings.class_name}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/organisasi')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            Lihat Struktur Lengkap
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {org.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                  {member.student?.photo_url ? (
                    <img src={member.student.photo_url} alt={member.student.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                      {member.student?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase block">
                    {member.position}
                  </span>
                  <h3 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {member.student?.name || 'Belum Ditentukan'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Absen #{member.student?.attendance_number || '-'} • Gender: {member.student?.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Preview Siswa Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 bg-slate-950/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 block mb-1">
              Anggota Komunitas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Siswa-Siswi X ANIMASI 2
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/siswa')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
          >
            Lihat Semua {students.length} Siswa
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {students.slice(0, 6).map((student) => (
            <div
              key={student.id}
              onClick={() => onNavigate('/siswa')}
              className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all text-center cursor-pointer group hover:bg-slate-900"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700 group-hover:scale-105 transition-transform">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-lg">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono mb-1">
                Absen {student.attendance_number}
              </span>
              <h4 className="font-medium text-xs text-white truncate group-hover:text-indigo-300">
                {student.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Jadwal Piket Quick Preview & Konten */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 block">
                  Jadwal Piket
                </span>
                <h3 className="text-xl font-bold text-white">Petugas Hari {todayName}</h3>
              </div>
              <button
                onClick={() => onNavigate('/piket')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                Lihat Minggu Ini
              </button>
            </div>

            {todayPiket.length > 0 ? (
              <div className="space-y-3">
                {todayPiket.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {item.student?.attendance_number || '#'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">{item.student?.name || 'Siswa'}</p>
                        <p className="text-[11px] text-slate-400">Petugas Kebersihan Ruang Kertas & Lab</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm bg-slate-950/40 rounded-xl border border-slate-800/60">
                Tidak ada jadwal piket untuk hari ini.
              </div>
            )}
          </div>

          {/* Konten Terbaru */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-400 block">
                  Pengumuman & Berita
                </span>
                <h3 className="text-xl font-bold text-white">Konten Terbaru Kelas</h3>
              </div>
              <button
                onClick={() => onNavigate('/konten')}
                className="text-xs text-purple-400 hover:underline font-medium"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {contents.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('/konten', item.slug)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 group"
                >
                  {item.image_url && (
                    <div className="w-full sm:w-36 h-28 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/50 inline-block">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Terbaru'}
                    </span>
                    <h4 className="font-semibold text-base text-white group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { SiteSettings, Student, OrganizationMember, ScheduleItem, ContentItem } from '@shared/types';
import { Sparkles, ArrowRight, Users, Award, Calendar, Newspaper, Clapperboard, Layers, ChevronRight, CheckCircle2, Zap, Crown } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Memuat portal kelas...</span>
        </div>
      </div>
    );
  }

  // Determine today's day for quick piket preview
  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const todayName = days[new Date().getDay() - 1] || 'Senin';
  const todayPiket = schedules.filter(s => s.day === todayName);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Hero Section - Poster Poster Frame Style */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="bg-white rounded-3xl sm:rounded-[40px] border-4 border-slate-950 p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative overflow-hidden">
          
          {/* Subtle Grid Dot Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Stamp */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-slate-950 text-white text-xs font-black uppercase tracking-widest -rotate-1 shadow-md border border-slate-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL PORTAL • KELAS {settings.class_name}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-950 leading-[1.05]"
            >
              {settings.hero_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              {settings.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <button
                onClick={() => onNavigate('/organisasi')}
                className="px-8 py-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 font-extrabold text-sm shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-all flex items-center gap-2 group hover:-translate-y-0.5"
              >
                Kenali Struktur Kelas
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
              </button>

              <button
                onClick={() => onNavigate('/siswa')}
                className="px-8 py-3.5 rounded-2xl bg-amber-400 text-slate-950 border-2 border-slate-950 font-extrabold text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4 text-slate-950" />
                Lihat Anggota ({students.length})
              </button>
            </motion.div>
          </div>

          {/* Hero Image Showcase Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 relative rounded-2xl sm:rounded-3xl overflow-hidden border-3 border-slate-950 shadow-xl bg-slate-900 group"
          >
            <img
              src={settings.hero_image_url}
              alt={settings.class_name}
              className="w-full h-[300px] sm:h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
              <div className="max-w-xl space-y-1.5">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase px-2.5 py-0.5 rounded tracking-wider">
                  TENTANG KELAS
                </span>
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-snug drop-shadow-md">
                  {settings.description}
                </p>
              </div>

              {/* Quick Stats Badges */}
              <div className="flex items-center gap-2.5">
                <div className="px-4 py-2.5 rounded-xl bg-white text-slate-950 border-2 border-slate-950 text-center shadow-md">
                  <span className="block text-lg font-black">{students.length}</span>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-600">Siswa</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 border-2 border-slate-950 text-center shadow-md">
                  <span className="block text-lg font-black">9</span>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-950">Pengurus</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-950 text-center shadow-md">
                  <span className="block text-lg font-black">2026</span>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-950">Angkatan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Pengurus Kelas Quick View */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded inline-block mb-2">
              KEPEMIMPINAN & ORGANISASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-950 tracking-tight">
              Pengurus Kelas {settings.class_name}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/organisasi')}
            className="text-xs font-black uppercase tracking-wider text-slate-950 hover:text-amber-600 flex items-center gap-1 group bg-white px-4 py-2 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            Lihat Poster Organisasi
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {org.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border-2 border-slate-300 flex-shrink-0 flex items-center justify-center">
                  {member.student?.photo_url ? (
                    <img src={member.student.photo_url} alt={member.student.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-extrabold text-slate-400 text-base">
                      {member.student?.name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-black tracking-wider text-slate-950 uppercase bg-amber-300 px-2 py-0.5 rounded border border-slate-950 inline-block mb-0.5">
                    {member.position}
                  </span>
                  <h3 className="font-extrabold text-slate-950 text-sm truncate group-hover:text-amber-600 transition-colors">
                    {member.custom_name || member.student?.name || 'EDIT DISINI'}
                  </h3>
                </div>
              </div>
              {member.student && (
                <p className="text-xs font-mono font-bold text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                  Absen #{member.student.attendance_number}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Preview Siswa Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border-3 border-slate-950 p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded border border-slate-950 inline-block mb-2">
                ANGGOTA KELAS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-950 tracking-tight">
                Siswa-Siswi X ANIMASI 2
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/siswa')}
              className="text-xs font-black uppercase tracking-wider text-slate-950 hover:text-cyan-600 flex items-center gap-1 group bg-slate-100 px-4 py-2 rounded-xl border-2 border-slate-950"
            >
              Lihat Seluruh {students.length} Siswa
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {students.slice(0, 6).map((student) => (
              <div
                key={student.id}
                onClick={() => onNavigate('/siswa')}
                className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-950 hover:border-amber-400 transition-all text-center cursor-pointer group hover:scale-[1.02] shadow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-slate-200 overflow-hidden border-2 border-slate-300 group-hover:scale-105 transition-transform flex items-center justify-center">
                  {student.photo_url ? (
                    <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-500 text-lg">
                      {student.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-[10px] font-mono font-bold text-slate-700 mb-1">
                  Absen #{student.attendance_number}
                </span>
                <h4 className="font-extrabold text-xs text-slate-950 truncate group-hover:text-amber-600">
                  {student.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Jadwal Piket & Konten */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border-3 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-slate-950 block mb-1">
                  JADWAL KEBERSIHAN
                </span>
                <h3 className="text-xl font-black text-slate-950 uppercase">Piket Hari {todayName}</h3>
              </div>
              <button
                onClick={() => onNavigate('/piket')}
                className="text-xs text-slate-950 hover:underline font-bold"
              >
                Lihat Minggu Ini
              </button>
            </div>

            {todayPiket.length > 0 ? (
              <div className="space-y-3">
                {todayPiket.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-950 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 border border-slate-950 flex items-center justify-center font-black text-xs">
                        #{item.student?.attendance_number || '-'}
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-950">{item.student?.name || 'Siswa'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Petugas Piket Harian</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                Belum ada petugas piket terjadwal untuk hari ini.
              </div>
            )}
          </div>

          {/* Konten Terbaru */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border-3 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="bg-purple-300 text-slate-950 font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-slate-950 block mb-1">
                  INFORMASI KELAS
                </span>
                <h3 className="text-xl font-black text-slate-950 uppercase">Pengumuman Terbaru</h3>
              </div>
              <button
                onClick={() => onNavigate('/konten')}
                className="text-xs text-slate-950 hover:underline font-bold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {contents.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('/konten', item.slug)}
                  className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-950 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 group"
                >
                  {item.image_url && (
                    <div className="w-full sm:w-36 h-28 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300 inline-block">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Terbaru'}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
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


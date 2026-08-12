import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { ScheduleItem, DayOfWeek } from '@shared/types';
import { Calendar, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Piket: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const todayIndex = new Date().getDay() - 1;
  const initialDay: DayOfWeek = days[todayIndex >= 0 && todayIndex < 5 ? todayIndex : 0];
  const [activeDay, setActiveDay] = useState<DayOfWeek>(initialDay);

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      const data = await DataStore.getSchedules();
      setSchedules(data);
      setLoading(false);
    };
    loadSchedules();

    const handleChanged = () => loadSchedules();
    window.addEventListener('x_animasi_data_changed', handleChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleChanged);
  }, []);

  const currentSchedules = schedules.filter(s => s.day === activeDay);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Jadwal Kebersihan Kelas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Jadwal Piket Kelas
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Tugas piket harian siswa X ANIMASI 2 untuk menjaga kebersihan ruang teori dan laboratorium studio animasi.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl gap-1 overflow-x-auto max-w-full">
          {days.map((day) => {
            const isActive = activeDay === day;
            const count = schedules.filter(s => s.day === day).length;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>Hari {day}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Schedule Content */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat jadwal piket...</div>
      ) : currentSchedules.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500 max-w-xl mx-auto space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <p>Belum ada siswa yang ditugaskan piket pada hari {activeDay}.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-medium">
            <span>Daftar Petugas Piket Hari {activeDay}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {currentSchedules.length} Petugas Terjadwal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentSchedules.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {item.student?.photo_url ? (
                      <img src={item.student.photo_url} alt={item.student.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {item.student?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      {item.student?.name || 'Siswa'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Nomor Absen #{item.student?.attendance_number || '-'}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-500/20">
                  0{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

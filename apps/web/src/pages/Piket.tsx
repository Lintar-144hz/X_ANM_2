import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { ScheduleItem, DayOfWeek } from '@shared/types';
import { Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-100 text-slate-950 py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-amber-400">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Poster Box */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-slate-950 text-white text-xs font-black uppercase tracking-widest -rotate-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>KEBERSIHAN & TERTIB KELAS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950">
            Jadwal Piket Harian
          </h1>

          <p className="text-slate-700 font-medium text-sm sm:text-base max-w-xl mx-auto">
            Tugas piket harian siswa X ANIMASI 2 untuk menjaga kebersihan ruang teori dan laboratorium studio animasi.
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-2 bg-white border-3 border-slate-950 rounded-2xl gap-1.5 overflow-x-auto max-w-full shadow-md">
            {days.map((day) => {
              const isActive = activeDay === day;
              const count = schedules.filter(s => s.day === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-950 text-amber-400 shadow-md'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span>Hari {day}</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                    isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'
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
          <div className="text-center py-20 text-slate-500 font-bold text-sm">Memuat jadwal piket...</div>
        ) : currentSchedules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-3 border-slate-950 text-slate-600 max-w-xl mx-auto space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-extrabold text-sm">Belum ada siswa yang ditugaskan piket pada hari {activeDay}.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2 text-xs font-extrabold text-slate-700 uppercase">
              <span>Daftar Petugas Hari {activeDay}</span>
              <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {currentSchedules.length} Petugas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSchedules.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-4 rounded-2xl bg-white border-3 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.student?.photo_url ? (
                        <img src={item.student.photo_url} alt={item.student.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-black text-slate-400 text-base">
                          {item.student?.name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-sm group-hover:text-amber-600 transition-colors">
                        {item.student?.name || 'Siswa'}
                      </h4>
                      <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                        Absen #{item.student?.attendance_number || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 border border-slate-950 flex items-center justify-center font-mono text-xs font-black">
                    0{idx + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


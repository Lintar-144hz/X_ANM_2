import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Student, ScheduleItem, DayOfWeek } from '@shared/types';
import { Calendar, Plus, Trash2, CheckCircle, Save } from 'lucide-react';

export const PiketAdmin: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Senin');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const loadData = async () => {
    setLoading(true);
    const [st, sch] = await Promise.all([
      DataStore.getStudents(),
      DataStore.getSchedules()
    ]);
    setStudents(st);
    setSchedules(sch);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Sync selected student IDs for current active day
    const daySch = schedules.filter(s => s.day === activeDay);
    setSelectedStudentIds(daySch.map(s => s.student_id));
  }, [activeDay, schedules]);

  const handleToggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleSaveDaySchedules = async () => {
    setSaving(true);
    await DataStore.setDaySchedules(activeDay, selectedStudentIds);
    await loadData();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Kelola Jadwal Piket Harian</h2>
        <p className="text-xs text-slate-400">Pilih siswa yang bertugas kebersihan untuk setiap hari dalam seminggu</p>
      </div>

      {/* Day Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl gap-1 overflow-x-auto">
        {days.map((day) => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hari {day}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat jadwal piket...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Assigned List */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Petugas Hari {activeDay}</h3>
                <p className="text-xs text-slate-400">{selectedStudentIds.length} Siswa Terpilih</p>
              </div>

              <button
                onClick={handleSaveDaySchedules}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

            {selectedStudentIds.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800/80">
                Belum ada siswa yang dipilih untuk piket hari {activeDay}.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedStudentIds.map((sid, idx) => {
                  const s = students.find(st => st.id === sid);
                  return (
                    <div
                      key={sid}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-white">{s?.name || 'Siswa'}</p>
                          <p className="text-[10px] text-slate-400">Absen #{s?.attendance_number}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStudent(sid)}
                        className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Student Selector Grid */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Pilih Dari Daftar Siswa</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-2">
              {students.map((s) => {
                const isAssigned = selectedStudentIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleStudent(s.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isAssigned
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                        : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold font-mono">
                        #{s.attendance_number}
                      </div>
                      <span className="font-medium text-xs truncate max-w-[140px]">{s.name}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isAssigned ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isAssigned && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

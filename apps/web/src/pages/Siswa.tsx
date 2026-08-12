import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Student } from '@shared/types';
import { Users, Search, Filter, Hash, UserCheck, X } from 'lucide-react';

export const Siswa: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data = await DataStore.getStudents();
      setStudents(data);
      setLoading(false);
    };
    loadStudents();

    const handleChanged = () => loadStudents();
    window.addEventListener('x_animasi_data_changed', handleChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleChanged);
  }, []);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.attendance_number.toString().includes(search);
    const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const countL = students.filter(s => s.gender === 'L').length;
  const countP = students.filter(s => s.gender === 'P').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>Daftar Siswa Lengkap</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Siswa-Siswi X ANIMASI 2
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Total {students.length} siswa terdaftar ({countL} Laki-laki, {countP} Perempuan)
        </p>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau nomor absen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium mr-1">
            <Filter className="w-3 h-3" /> Gender:
          </span>
          {[
            { id: 'ALL', label: `Semua (${students.length})` },
            { id: 'L', label: `Laki-laki (${countL})` },
            { id: 'P', label: `Perempuan (${countP})` }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setGenderFilter(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                genderFilter === btn.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat daftar siswa...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500">
          Tidak ditemukan siswa dengan kriteria pencarian tersebut.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                  {student.photo_url ? (
                    <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-400">
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 border border-slate-700/60">
                      #{student.attendance_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      student.gender === 'L' 
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' 
                        : 'bg-pink-950/60 text-pink-400 border border-pink-800/40'
                    }`}>
                      {student.gender === 'L' ? 'L' : 'P'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                    {student.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative space-y-6 text-center">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-28 h-28 mx-auto rounded-full bg-slate-800 overflow-hidden border-2 border-cyan-500/40 shadow-xl">
              {selectedStudent.photo_url ? (
                <img src={selectedStudent.photo_url} alt={selectedStudent.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-cyan-400">
                  {selectedStudent.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 block mb-1">
                Absen #{selectedStudent.attendance_number}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Siswa X ANIMASI 2 • Gender: {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Tutup Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

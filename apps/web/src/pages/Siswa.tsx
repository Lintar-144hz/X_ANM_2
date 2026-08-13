import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Student } from '@shared/types';
import { Users, Search, Filter, Hash, UserCheck, X, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-100 text-slate-950 py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-amber-400">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Poster Box */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-slate-950 text-white text-xs font-black uppercase tracking-widest -rotate-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>DAFTAR ANGGOTA KELAS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950">
            Siswa-Siswi X ANIMASI 2
          </h1>

          <p className="text-slate-700 font-medium text-sm sm:text-base max-w-xl mx-auto">
            Total <span className="font-extrabold text-slate-950">{students.length} siswa</span> terdaftar (<span className="text-blue-600 font-extrabold">{countL} Laki-laki</span>, <span className="text-pink-600 font-extrabold">{countP} Perempuan</span>)
          </p>
        </div>

        {/* Controls: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border-3 border-slate-950 shadow-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau nomor absen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-950 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-950 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-700 font-extrabold flex items-center gap-1 uppercase mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'ALL', label: `Semua (${students.length})` },
              { id: 'L', label: `Laki-laki (${countL})` },
              { id: 'P', label: `Perempuan (${countP})` }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setGenderFilter(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  genderFilter === btn.id
                    ? 'bg-slate-950 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">Memuat daftar siswa...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-3 border-slate-950 text-slate-600 font-bold">
            Tidak ditemukan siswa dengan kriteria pencarian tersebut.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-5 rounded-2xl bg-white border-3 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all cursor-pointer group relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border-2 border-slate-300 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                    {student.photo_url ? (
                      <img src={student.photo_url} alt={student.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-xl text-slate-400">
                        {student.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono font-bold text-white">
                        #{student.attendance_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        student.gender === 'L' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-pink-100 text-pink-800 border border-pink-300'
                      }`}>
                        {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-950 text-sm truncate group-hover:text-amber-600 transition-colors">
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
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-4 border-slate-950 rounded-3xl max-w-sm w-full p-6 text-slate-950 shadow-2xl relative space-y-6 text-center">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 p-1.5 rounded-full bg-slate-100 border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-28 h-28 mx-auto rounded-2xl bg-slate-100 overflow-hidden border-3 border-slate-950 shadow-md flex items-center justify-center">
                {selectedStudent.photo_url ? (
                  <img src={selectedStudent.photo_url} alt={selectedStudent.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-4xl text-slate-400">
                    {selectedStudent.name.charAt(0)}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs uppercase font-mono font-black text-white bg-slate-950 px-3 py-1 rounded inline-block mb-2">
                  Absen #{selectedStudent.attendance_number}
                </span>
                <h3 className="text-xl font-black text-slate-950">{selectedStudent.name}</h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Siswa X ANIMASI 2 • Gender: {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-wider"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


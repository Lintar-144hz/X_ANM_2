import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Student, OrganizationMember, ClassPosition } from '@shared/types';
import { Award, CheckCircle2, UserCheck, Save } from 'lucide-react';

export const OrganisasiAdmin: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [org, setOrg] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPos, setSavingPos] = useState<string | null>(null);

  const positions: ClassPosition[] = [
    'Wali Kelas',
    'Ketua',
    'Wakil Ketua',
    'Sekretaris',
    'Bendahara',
    'Bumas 1',
    'Bumas 2',
    'MPK 1',
    'MPK 2'
  ];

  const loadData = async () => {
    setLoading(true);
    const [st, og] = await Promise.all([
      DataStore.getStudents(),
      DataStore.getOrganization()
    ]);
    setStudents(st);
    setOrg(og);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectStudent = async (pos: ClassPosition, studentId: string) => {
    setSavingPos(pos);
    await DataStore.updateOrganizationPosition(pos, studentId);
    await loadData();
    setSavingPos(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Kelola Struktur Organisasi Kelas</h2>
        <p className="text-xs text-slate-400">Pilih siswa yang memegang masing-masing posisi dalam kepengurusan X ANIMASI 2</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat data organisasi...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {positions.map((pos) => {
            const currentOrg = org.find(o => o.position === pos);
            const currentStudentId = currentOrg?.student_id || '';

            return (
              <div
                key={pos}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                    {pos}
                  </span>
                  {savingPos === pos && (
                    <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Menyimpan...</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tugaskan Siswa:</label>
                  <select
                    value={currentStudentId}
                    onChange={(e) => handleSelectStudent(pos, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none font-medium"
                  >
                    <option value="">-- Belum Ditentukan --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        Absen #{s.attendance_number} - {s.name} ({s.gender})
                      </option>
                    ))}
                  </select>
                </div>

                {currentOrg?.student && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                      {currentOrg.student.photo_url ? (
                        <img src={currentOrg.student.photo_url} alt={currentOrg.student.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-400">
                          {currentOrg.student.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-xs text-white truncate">{currentOrg.student.name}</p>
                      <p className="text-[10px] text-slate-400">Terpilih sebagai {pos}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

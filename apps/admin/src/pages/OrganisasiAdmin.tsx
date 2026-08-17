import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { Student, OrganizationMember, ClassPosition } from '@shared/types';
import { Award, CheckCircle2, UserCheck, Save, Users, User, ShieldCheck } from 'lucide-react';

export const OrganisasiAdmin: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [org, setOrg] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPos, setSavingPos] = useState<string | null>(null);

  // Wali Kelas manual text input
  const [waliKelasName, setWaliKelasName] = useState('');
  const [savingWali, setSavingWali] = useState(false);
  const [waliSavedSuccess, setWaliSavedSuccess] = useState(false);

  const corePositions: ClassPosition[] = [
    'Ketua',
    'Wakil Ketua',
    'Sekretaris',
    'Bendahara'
  ];

  const bumasPositions: ClassPosition[] = [
    'Bumas 1',
    'Bumas 2'
  ];

  const mpkPositions: ClassPosition[] = [
    'MPK 1',
    'MPK 2'
  ];

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [st, og] = await Promise.all([
        DataStore.getStudents(),
        DataStore.getOrganization()
      ]);
      setStudents(st);
      setOrg(og);

      const currentWali = og.find(o => o.position === 'Wali Kelas');
      if (currentWali) {
        setWaliKelasName(currentWali.custom_name || (currentWali.student ? currentWali.student.name : ''));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat data organisasi dari Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveWaliKelas = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingWali(true);
    setErrorMsg(null);
    try {
      await DataStore.updateOrganizationPosition('Wali Kelas', '', waliKelasName.trim());
      setWaliSavedSuccess(true);
      setTimeout(() => setWaliSavedSuccess(false), 3000);
      await loadData();
    } catch (err: any) {
      alert(`Gagal menyimpan Wali Kelas: ${err.message}`);
    } finally {
      setSavingWali(false);
    }
  };

  const handleSelectStudent = async (pos: ClassPosition, studentId: string) => {
    setSavingPos(pos);
    setErrorMsg(null);
    try {
      await DataStore.updateOrganizationPosition(pos, studentId);
      await loadData();
    } catch (err: any) {
      alert(`Gagal memperbarui posisi di Supabase: ${err.message}`);
    } finally {
      setSavingPos(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Kelola Struktur Organisasi Kelas</h2>
        <p className="text-xs text-slate-400">
          Atur nama Wali Kelas (ketik manual) dan tentukan siswa pengurus kelas X ANIMASI 2 SMKN 9 Surakarta.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-2xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat data organisasi...</div>
      ) : (
        <div className="space-y-8">
          {/* 1. SECTION WALI KELAS (INPUT MANUAL) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-900/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Wali Kelas (Ketik Nama Sendiri)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ketik langsung nama lengkap bapak/ibu guru wali kelas beserta gelar (karena tidak ada di daftar siswa).
                  </p>
                </div>
              </div>
              {waliSavedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveWaliKelas} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Contoh: Dra. Siti Rahayu, M.Pd. / Bpk. Bambang Sutrisno, S.Sn."
                  value={waliKelasName}
                  onChange={(e) => setWaliKelasName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingWali}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingWali ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Wali Kelas</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2. SECTION PENGURUS INTI (KETUA, WAKIL, SEKRETARIS, BENDAHARA) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Pengurus Inti Kelas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {corePositions.map((pos) => {
                const currentOrg = org.find(o => o.position === pos);
                const currentStudentId = currentOrg?.student_id || '';

                return (
                  <div
                    key={pos}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none font-medium cursor-pointer"
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
          </div>

          {/* 3. SECTION BUMAS (HUBUNGAN MASYARAKAT) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> BUMAS (Hubungan Masyarakat) — 2 Anggota
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kedua anggota Bumas disatukan dalam satu kelompok tampilan BUMAS di bagan organisasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {bumasPositions.map((pos) => {
                const currentOrg = org.find(o => o.position === pos);
                const currentStudentId = currentOrg?.student_id || '';

                return (
                  <div
                    key={pos}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-medium cursor-pointer"
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
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                          {currentOrg.student.photo_url ? (
                            <img src={currentOrg.student.photo_url} alt={currentOrg.student.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[11px] text-slate-400">
                              {currentOrg.student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-xs text-white truncate">{currentOrg.student.name}</p>
                          <p className="text-[10px] text-slate-400">Absen #{currentOrg.student.attendance_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. SECTION MPK (3 ANGGOTA MPK JADI SATU KELOMPOK) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> MPK (Majelis Perwakilan Kelas) — 3 Anggota
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ketiga anggota perwakilan kelas ini disatukan dalam satu kelompok tampilan MPK di bagan organisasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {mpkPositions.map((pos) => {
                const currentOrg = org.find(o => o.position === pos);
                const currentStudentId = currentOrg?.student_id || '';

                return (
                  <div
                    key={pos}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none font-medium cursor-pointer"
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
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                          {currentOrg.student.photo_url ? (
                            <img src={currentOrg.student.photo_url} alt={currentOrg.student.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[11px] text-slate-400">
                              {currentOrg.student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-xs text-white truncate">{currentOrg.student.name}</p>
                          <p className="text-[10px] text-slate-400">Absen #{currentOrg.student.attendance_number}</p>
                        </div>
                      </div>
                    )}
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

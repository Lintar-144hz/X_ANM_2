import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { OrganizationMember, ClassPosition } from '@shared/types';
import { Award, Shield, UserCheck, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const Organisasi: React.FC = () => {
  const [org, setOrg] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrg = async () => {
      setLoading(true);
      const data = await DataStore.getOrganization();
      setOrg(data);
      setLoading(false);
    };
    loadOrg();

    const handleChanged = () => loadOrg();
    window.addEventListener('x_animasi_data_changed', handleChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleChanged);
  }, []);

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

  const getMember = (pos: ClassPosition) => org.find(o => o.position === pos);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Kepengurusan & Hierarchy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Struktur Organisasi Kelas
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Struktur kepengurusan resmi X ANIMASI 2 untuk menjalankan koordinasi kegiatan kelas, akademik, dan proyek kesiswaan.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat struktur organisasi...</div>
      ) : (
        <div className="space-y-12">
          {/* Top Level: Wali Kelas */}
          {(() => {
            const wali = getMember('Wali Kelas');
            return (
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl text-center space-y-4 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-widest rounded-bl-xl border-l border-b border-amber-500/30">
                    Pembimbing Kelas
                  </div>
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-800 overflow-hidden border-2 border-amber-500/40 shadow-lg group-hover:scale-105 transition-transform">
                    {wali?.student?.photo_url ? (
                      <img src={wali.student.photo_url} alt={wali.student.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-amber-400">
                        {wali?.student?.name?.charAt(0) || 'W'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-amber-400 block mb-1">
                      Wali Kelas
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {wali?.student?.name || 'Belum Ditentukan'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Penanggung Jawab & Pembina Akademik</p>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* Level 2: Ketua & Wakil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {['Ketua', 'Wakil Ketua'].map((pos) => {
              const m = getMember(pos as ClassPosition);
              return (
                <div
                  key={pos}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-3 group"
                >
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 group-hover:scale-105 transition-transform">
                    {m?.student?.photo_url ? (
                      <img src={m.student.photo_url} alt={m.student.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-cyan-400">
                        {m?.student?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 block mb-1">
                      {pos}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {m?.student?.name || 'Belum Ditentukan'}
                    </h3>
                    {m?.student && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                        Absen #{m.student.attendance_number}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level 3: Sekretaris, Bendahara, Bumas, MPK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Sekretaris', 'Bendahara', 'Bumas 1', 'Bumas 2', 'MPK 1', 'MPK 2'].map((pos) => {
              const m = getMember(pos as ClassPosition);
              return (
                <div
                  key={pos}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {m?.student?.photo_url ? (
                      <img src={m.student.photo_url} alt={m.student.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {m?.student?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                      {pos}
                    </span>
                    <h4 className="font-semibold text-white text-sm truncate group-hover:text-indigo-300">
                      {m?.student?.name || 'Belum Ditentukan'}
                    </h4>
                    {m?.student && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Absen #{m.student.attendance_number}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

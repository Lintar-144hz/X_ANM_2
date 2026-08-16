import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { OrganizationMember, ClassPosition, Student, SiteSettings } from '@shared/types';
import { Crown, Zap, Users, Award, Shield, User, GraduationCap, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollMotion';

export const Organisasi: React.FC = () => {
  const [org, setOrg] = useState<OrganizationMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [orgData, studentData, settingsData] = await Promise.all([
        DataStore.getOrganization(),
        DataStore.getStudents(),
        DataStore.getSettings()
      ]);
      setOrg(orgData);
      setStudents(studentData);
      setSettings(settingsData);
      setLoading(false);
    };

    loadData();

    const handleChanged = () => loadData();
    window.addEventListener('x_animasi_data_changed', handleChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleChanged);
  }, []);

  const getMember = (pos: ClassPosition) => org.find(o => o.position === pos);

  // Helper card component for standard single member positions
  const OrgCard = ({
    position,
    badgeText,
    badgeColorClass = 'bg-slate-950 text-white',
    borderColorClass = 'border-slate-800',
    cardBgClass = 'bg-white text-slate-950',
    accentColor = 'blue',
    isTeacher = false
  }: {
    position: ClassPosition;
    badgeText: string;
    badgeColorClass?: string;
    borderColorClass?: string;
    cardBgClass?: string;
    accentColor?: 'gold' | 'blue' | 'black' | 'orange' | 'indigo' | 'emerald';
    isTeacher?: boolean;
  }) => {
    const member = getMember(position);
    const student = member?.student;

    const accentBorder =
      accentColor === 'gold'
        ? 'border-amber-400 shadow-[0_4px_20px_rgba(251,191,36,0.15)]'
        : accentColor === 'blue'
        ? 'border-cyan-400 shadow-[0_4px_20px_rgba(34,211,238,0.15)]'
        : accentColor === 'orange'
        ? 'border-orange-400 shadow-[0_4px_20px_rgba(251,146,60,0.15)]'
        : accentColor === 'indigo'
        ? 'border-indigo-400 shadow-[0_4px_20px_rgba(129,140,248,0.15)]'
        : accentColor === 'emerald'
        ? 'border-emerald-400 shadow-[0_4px_20px_rgba(52,211,153,0.15)]'
        : 'border-slate-800 shadow-md';

    const displayName = isTeacher
      ? (member?.custom_name || 'Bapak / Ibu Wali Kelas')
      : (student?.name || member?.custom_name || 'Belum Ditentukan');

    return (
      <div className="relative group w-full flex flex-col items-center my-1">
        {/* Badge Header (Top Ribbon) */}
        <div
          className={`z-10 -mb-2 px-4 py-1 rounded-md font-black uppercase tracking-wider text-[11px] sm:text-xs shadow-md border border-slate-900/10 flex items-center gap-1.5 whitespace-nowrap ${badgeColorClass}`}
        >
          {badgeText}
        </div>

        {/* Card Body */}
        <div
          className={`w-full rounded-2xl border-2 p-3 sm:p-4 flex items-center gap-3 transition-all duration-300 ${accentBorder} ${cardBgClass} group-hover:scale-[1.02]`}
        >
          {/* Avatar / Photo Box */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex-shrink-0 relative shadow-inner flex items-center justify-center">
            {isTeacher ? (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                <GraduationCap className="w-7 h-7 stroke-[2]" />
              </div>
            ) : student?.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-lg">
                <User className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </div>

          {/* Name & Details */}
          <div className="flex-1 min-w-0 text-left">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate leading-snug">
              {displayName}
            </h4>
            {isTeacher ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                  Guru Pembimbing • SMKN 9 Surakarta
                </span>
              </div>
            ) : student ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Absen #{student.attendance_number}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 italic">Pilih di Admin</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // UNIFIED 2-IN-1 BUMAS CARD COMPONENT
  const UnifiedBumasCard = () => {
    const bumas1 = getMember('Bumas 1');
    const bumas2 = getMember('Bumas 2');

    const bumasList = [
      { label: 'BUMAS 1', member: bumas1, student: bumas1?.student },
      { label: 'BUMAS 2', member: bumas2, student: bumas2?.student },
    ];

    return (
      <div className="relative group w-full flex flex-col items-center my-1">
        {/* Badge Header Ribbon */}
        <div className="z-10 -mb-2 px-5 py-1.5 rounded-md font-black uppercase tracking-widest text-[11px] sm:text-xs shadow-md border-2 border-slate-950 bg-cyan-400 text-slate-950 flex items-center gap-2 whitespace-nowrap">
          <Users className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>BUMAS (HUBUNGAN MASYARAKAT)</span>
        </div>

        {/* Card Body Container holding 2 BUMAS members together */}
        <div className="w-full rounded-2xl border-2 border-cyan-400 bg-cyan-50/50 p-4 sm:p-5 shadow-[0_4px_20px_rgba(34,211,238,0.15)] group-hover:scale-[1.01] transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {bumasList.map((item, idx) => {
              const student = item.student;
              const name = student?.name || item.member?.custom_name || 'Belum Ditentukan';

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-cyan-200 p-3 flex items-center gap-3 shadow-sm hover:border-cyan-400 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-lg bg-cyan-100 border border-cyan-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {student?.photo_url ? (
                      <img
                        src={student.photo_url}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cyan-800 font-bold text-xs">
                        {student ? student.name.charAt(0) : item.label}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 block">
                      {item.label}
                    </span>
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {name}
                    </h5>
                    {student && (
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        Absen #{student.attendance_number}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // UNIFIED 3-IN-1 MPK CARD COMPONENT
  const UnifiedMPKCard = () => {
    const mpk1 = getMember('MPK 1');
    const mpk2 = getMember('MPK 2');
    const mpk3 = getMember('MPK 3');

    const mpkList = [
      { label: 'MPK 1', member: mpk1, student: mpk1?.student },
      { label: 'MPK 2', member: mpk2, student: mpk2?.student },
      { label: 'MPK 3', member: mpk3, student: mpk3?.student },
    ];

    return (
      <div className="relative group w-full flex flex-col items-center my-1">
        {/* Badge Header Ribbon */}
        <div className="z-10 -mb-2 px-5 py-1.5 rounded-md font-black uppercase tracking-widest text-[11px] sm:text-xs shadow-md border-2 border-slate-950 bg-emerald-400 text-slate-950 flex items-center gap-2 whitespace-nowrap">
          <Users className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>MPK (MAJELIS PERWAKILAN KELAS)</span>
        </div>

        {/* Card Body Container holding 3 MPK members together */}
        <div className="w-full rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 p-4 sm:p-5 shadow-[0_4px_20px_rgba(52,211,153,0.15)] group-hover:scale-[1.01] transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {mpkList.map((item, idx) => {
              const student = item.student;
              const name = student?.name || item.member?.custom_name || 'Belum Ditentukan';

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-emerald-200 p-3 flex items-center gap-3 shadow-sm hover:border-emerald-400 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 border border-emerald-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {student?.photo_url ? (
                      <img
                        src={student.photo_url}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800 font-bold text-xs">
                        {student ? student.name.charAt(0) : item.label}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                      {item.label}
                    </span>
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {name}
                    </h5>
                    {student && (
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        Absen #{student.attendance_number}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Main Poster Container Frame */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl sm:rounded-[40px] border-4 border-slate-950 p-4 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden">
        
        {/* Background Street-Art Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Top Left Stamp: SMKN 9 SURAKARTA */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
          <span className="bg-slate-950 text-white font-black text-[10px] sm:text-xs tracking-widest uppercase px-3 py-1 -rotate-2 shadow-md border border-slate-800">
            SMKN 9 SURAKARTA
          </span>
        </div>

        {/* Top Right Stamp: BARCODE + #KELASBITAHEBAT */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5 bg-slate-950 text-white px-2.5 py-0.5 text-[10px] font-mono font-bold rotate-1">
            <span>#</span>
            <span className="uppercase">ANIMASIHEBAT</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-black">
            <Zap className="w-5 h-5 fill-amber-400 text-slate-950 stroke-[2.5]" />
          </div>
        </div>

        {/* Header Poster Title Section */}
        <div className="text-center pt-8 sm:pt-6 pb-6 relative z-10 space-y-3">
          {/* Crown Illustration Above Title */}
          <div className="flex justify-center -mb-2">
            <div className="relative">
              <Crown className="w-10 h-10 sm:w-14 sm:h-14 text-amber-400 fill-amber-300 stroke-slate-950 stroke-[2.5] -rotate-6 filter drop-shadow-md" />
              <div className="absolute -top-1 -right-2 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950"></div>
            </div>
          </div>

          {/* Main Titles */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-950 font-sans leading-none drop-shadow-sm">
              STRUKTUR
            </h1>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-amber-500 font-sans leading-none drop-shadow-[0_4px_0_rgba(15,23,42,1)] stroke-slate-950">
              ORGANISASI
            </h2>
          </div>

          {/* Black Brush Ribbon for Class Name */}
          <div className="flex justify-center my-2">
            <div className="bg-slate-950 text-white font-black text-lg sm:text-2xl uppercase tracking-widest px-8 py-2 rounded-sm -rotate-1 shadow-lg border-2 border-slate-900 inline-block relative">
              <span className="relative z-10">
                KELAS {settings?.class_name || 'X ANIMASI 2'}
              </span>
              <div className="absolute -left-2 top-0 bottom-0 w-3 bg-cyan-400 -skew-x-12"></div>
              <div className="absolute -right-2 top-0 bottom-0 w-3 bg-amber-400 skew-x-12"></div>
            </div>
          </div>

          {/* Slogan Ribbon */}
          <p className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
            <span>SMKN 9 SURAKARTA</span>
            <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-black text-xs shadow-sm">
              KOMPAK
            </span>
            <span>, KELAS KITA</span>
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs shadow-sm">
              HEBAT!
            </span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-semibold text-sm">
            Memuat struktur organisasi...
          </div>
        ) : (
          <div className="space-y-8 relative z-10 my-4">
            {/* CONTINUOUS HIERARCHY TREE CONNECTOR CONTAINER */}
            <div className="flex flex-col items-center max-w-2xl mx-auto space-y-0 relative">
              
              {/* LEVEL 1: WALI KELAS */}
              <ScrollReveal direction="down" scale className="w-full max-w-md flex flex-col items-center">
                <OrgCard
                  position="Wali Kelas"
                  badgeText="WALI KELAS"
                  badgeColorClass="bg-indigo-900 text-white"
                  accentColor="indigo"
                  cardBgClass="bg-indigo-50/40 text-slate-950"
                  isTeacher={true}
                />
              </ScrollReveal>
              
              {/* Continuous Vertical Line 1: Wali Kelas -> Ketua */}
              <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -top-1 -left-0.75"></div>
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
              </div>

              {/* LEVEL 2: KETUA KELAS */}
              <ScrollReveal direction="down" scale className="w-full max-w-md flex flex-col items-center">
                <OrgCard
                  position="Ketua"
                  badgeText="KETUA KELAS"
                  badgeColorClass="bg-amber-400 text-slate-950 font-black border-2 border-slate-950"
                  accentColor="gold"
                  cardBgClass="bg-white text-slate-950"
                />
              </ScrollReveal>

              {/* Continuous Vertical Line 2: Ketua -> Wakil */}
              <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -top-1 -left-0.75"></div>
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
              </div>

              {/* LEVEL 3: WAKIL KETUA KELAS */}
              <ScrollReveal direction="down" scale className="w-full max-w-md flex flex-col items-center">
                <OrgCard
                  position="Wakil Ketua"
                  badgeText="WAKIL KETUA KELAS"
                  badgeColorClass="bg-cyan-500 text-slate-950 font-black border-2 border-slate-950"
                  accentColor="blue"
                  cardBgClass="bg-slate-50 text-slate-950"
                />
              </ScrollReveal>

              {/* Continuous Vertical Line 3: Wakil -> Split Line */}
              <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -top-1 -left-0.75"></div>
              </div>

              {/* LEVEL 4: SEKRETARIS & BENDAHARA (WITH CONNECTED HORIZONTAL T-JUNCTION) */}
              <div className="w-full relative">
                {/* Horizontal T-Bar connecting Left & Right */}
                <div className="hidden sm:block absolute top-0 left-[25%] right-[25%] h-1 bg-slate-950">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-1/2 left-0 -translate-y-1/2"></div>
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-1/2 right-0 -translate-y-1/2"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-3">
                  <ScrollReveal direction="left" scale className="relative flex flex-col items-center">
                    <div className="hidden sm:block w-1 h-4 bg-slate-950 -mt-3 mb-1"></div>
                    <OrgCard
                      position="Sekretaris"
                      badgeText="SEKRETARIS"
                      badgeColorClass="bg-slate-950 text-white"
                      accentColor="black"
                    />
                  </ScrollReveal>

                  <ScrollReveal direction="right" scale className="relative flex flex-col items-center">
                    <div className="hidden sm:block w-1 h-4 bg-slate-950 -mt-3 mb-1"></div>
                    <OrgCard
                      position="Bendahara"
                      badgeText="BENDAHARA"
                      badgeColorClass="bg-slate-950 text-white"
                      accentColor="black"
                    />
                  </ScrollReveal>
                </div>
              </div>

              {/* Continuous Vertical Line 4: Sekretaris & Bendahara down to BUMAS */}
              <div className="w-full relative flex flex-col items-center my-0.5">
                {/* Horizontal Convergence Bar on desktop */}
                <div className="hidden sm:block w-[50%] h-1 bg-slate-950 mt-1">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute left-1/2 -translate-x-1/2 -top-0.5"></div>
                </div>
                <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
                </div>
              </div>

              {/* LEVEL 5: UNIFIED BUMAS (1 & 2 DIGABUNG MENJADI SATU) */}
              <ScrollReveal direction="up" scale className="w-full">
                <UnifiedBumasCard />
              </ScrollReveal>

              {/* Continuous Vertical Line 5: BUMAS down to MPK */}
              <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -top-1 -left-0.75"></div>
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
              </div>

              {/* LEVEL 6: UNIFIED MPK (3 ANGGOTA MPK) */}
              <ScrollReveal direction="up" scale className="w-full">
                <UnifiedMPKCard />
              </ScrollReveal>

              {/* Continuous Vertical Line 6: MPK down to Anggota */}
              <div className="w-1 h-8 bg-slate-950 relative my-0.5">
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -top-1 -left-0.75"></div>
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
              </div>

              {/* LEVEL 7: ANGGOTA / SELURUH SISWA KELAS */}
              <ScrollReveal direction="up" scale className="w-full pt-2">
                <div className="flex justify-center mb-4">
                  <div className="bg-slate-950 text-white font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-2 rounded-sm shadow-md border border-slate-800 flex flex-col items-center">
                    <span className="text-amber-400 font-extrabold text-[10px] tracking-widest">// ANGGOTA //</span>
                    <span className="text-sm sm:text-base">SELURUH SISWA KELAS</span>
                  </div>
                </div>

                {/* Box Container for All Class Students */}
                <div className="bg-slate-50 rounded-2xl border-4 border-slate-950 p-4 sm:p-6 shadow-lg relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs font-semibold text-slate-800">
                    {students.length === 0 ? (
                      <div className="col-span-full text-center py-6 text-slate-400">
                        Belum ada data siswa.
                      </div>
                    ) : (
                      students.map((std) => (
                        <div key={std.id} className="flex items-center gap-2 truncate py-1 border-b border-slate-200/60">
                          <span className="text-amber-500 font-mono font-black text-[11px] w-5">
                            {String(std.attendance_number).padStart(2, '0')}.
                          </span>
                          <span className="truncate font-bold text-slate-900">{std.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        )}

        {/* Footer Doodles & Corner Elements */}
        <div className="pt-8 flex items-center justify-between border-t-2 border-slate-950 mt-8">
          {/* Bottom Left Doodle */}
          <div className="flex items-center gap-2 text-slate-950">
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center font-bold text-lg bg-amber-300 shadow-sm relative">
              <span>🙂</span>
              <Crown className="w-4 h-4 text-slate-950 absolute -top-2 left-2 fill-amber-400" />
            </div>
            <div className="hidden sm:block text-[10px] font-black uppercase tracking-wider text-slate-700">
              X ANIMASI 2 • SMKN 9 SURAKARTA
            </div>
          </div>

          {/* Bottom Right Doodle: Street Crosses */}
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-slate-950">✖</span>
            <span className="font-black text-lg text-amber-500">✖</span>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { OrganizationMember, ClassPosition, Student, SiteSettings } from '@shared/types';
import { Crown, Zap, Users, Award, Shield, User, Sparkles, CheckCircle2, Check } from 'lucide-react';
import { motion } from 'motion/react';

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

  // Helper card component matching the exact poster UI card frame from reference image
  const OrgCard = ({
    position,
    badgeText,
    badgeColorClass = 'bg-slate-950 text-white',
    borderColorClass = 'border-slate-800',
    cardBgClass = 'bg-white text-slate-950',
    accentColor = 'blue',
    size = 'normal'
  }: {
    position: ClassPosition;
    badgeText: string;
    badgeColorClass?: string;
    borderColorClass?: string;
    cardBgClass?: string;
    accentColor?: 'gold' | 'blue' | 'black' | 'orange';
    size?: 'large' | 'normal' | 'compact';
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
        : 'border-slate-800 shadow-md';

    return (
      <div className="relative group w-full flex flex-col items-center my-1">
        {/* Badge Header (Top Ribbon) */}
        <div
          className={`z-10 -mb-2 px-4 py-1 rounded-md font-black uppercase tracking-wider text-[11px] sm:text-xs shadow-md border border-slate-900/10 flex items-center gap-1.5 whitespace-nowrap ${badgeColorClass}`}
        >
          {badgeText}
        </div>

        {/* Card Body with Chamfer/Angled Accent Corners */}
        <div
          className={`w-full rounded-2xl border-2 p-3 sm:p-4 flex items-center gap-3 transition-all duration-300 ${accentBorder} ${cardBgClass} group-hover:scale-[1.02]`}
        >
          {/* Avatar / Photo Box */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex-shrink-0 relative shadow-inner flex items-center justify-center">
            {student?.photo_url ? (
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
              {member?.custom_name || student?.name || 'EDIT DISINI'}
            </h4>
            {student && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Absen #{student.attendance_number}
                </span>
              </div>
            )}
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
        
        {/* Top Left Stamp: DISCIPLINE SUCCESS */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
          <span className="bg-slate-950 text-white font-black text-[10px] sm:text-xs tracking-widest uppercase px-3 py-1 -rotate-2 shadow-md border border-slate-800">
            DISCIPLINE SUCCESS
          </span>
        </div>

        {/* Top Right Stamp: BARCODE + #KELASBITAHEBAT */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5 bg-slate-950 text-white px-2.5 py-0.5 text-[10px] font-mono font-bold rotate-1">
            <span>#</span>
            <span className="uppercase">KELASBITAHEBAT</span>
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
            <span>BERSAMA KITA</span>
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
            {/* HIERARCHY TREE CONNECTOR CONTAINER */}
            <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 relative">
              
              {/* LEVEL 1: WALI KELAS */}
              <div className="w-full max-w-sm relative flex flex-col items-center">
                <OrgCard
                  position="Wali Kelas"
                  badgeText="WALI KELAS"
                  badgeColorClass="bg-slate-950 text-white"
                  accentColor="blue"
                  cardBgClass="bg-slate-50 text-slate-950"
                />
                
                {/* Vertical Connector Line */}
                <div className="w-1 h-8 bg-slate-950 my-1 relative">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
                </div>
              </div>

              {/* LEVEL 2: KETUA KELAS */}
              <div className="w-full max-w-sm relative flex flex-col items-center">
                <OrgCard
                  position="Ketua"
                  badgeText="KETUA KELAS"
                  badgeColorClass="bg-amber-400 text-slate-950 font-black border-2 border-slate-950"
                  accentColor="gold"
                  cardBgClass="bg-white text-slate-950"
                />

                {/* Vertical Connector Line */}
                <div className="w-1 h-8 bg-slate-950 my-1 relative">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute -bottom-1 -left-0.75"></div>
                </div>
              </div>

              {/* LEVEL 3: WAKIL KETUA KELAS */}
              <div className="w-full max-w-sm relative flex flex-col items-center">
                <OrgCard
                  position="Wakil Ketua"
                  badgeText="WAKIL KETUA KELAS"
                  badgeColorClass="bg-cyan-500 text-slate-950 font-black border-2 border-slate-950"
                  accentColor="blue"
                  cardBgClass="bg-slate-50 text-slate-950"
                />

                {/* Vertical Line splitting to Sekretaris & Bendahara */}
                <div className="w-1 h-6 bg-slate-950 my-1 relative"></div>
              </div>

              {/* LEVEL 4: SEKRETARIS & BENDAHARA */}
              <div className="w-full relative">
                {/* Horizontal Split Line */}
                <div className="hidden sm:block absolute top-0 left-[25%] right-[25%] h-1 bg-slate-950"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  <div className="relative flex flex-col items-center">
                    <div className="hidden sm:block w-1 h-3 bg-slate-950 -mt-2 mb-1"></div>
                    <OrgCard
                      position="Sekretaris"
                      badgeText="SEKRETARIS"
                      badgeColorClass="bg-slate-950 text-white"
                      accentColor="black"
                    />
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="hidden sm:block w-1 h-3 bg-slate-950 -mt-2 mb-1"></div>
                    <OrgCard
                      position="Bendahara"
                      badgeText="BENDAHARA"
                      badgeColorClass="bg-slate-950 text-white"
                      accentColor="black"
                    />
                  </div>
                </div>
              </div>

              {/* SEKSI-SEKSI HEADER RIBBON */}
              <div className="w-full pt-6 flex justify-center">
                <div className="bg-slate-950 text-white font-black text-xs sm:text-sm uppercase tracking-widest px-6 py-1.5 rounded-sm shadow-md border border-slate-800 flex items-center gap-2">
                  <span className="text-cyan-400">//</span>
                  <span>SEKSI - SEKSI</span>
                  <span className="text-cyan-400">//</span>
                </div>
              </div>

              {/* LEVEL 5: BUMAS 1, BUMAS 2, MPK 1, MPK 2 (4 COLUMNS) */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <OrgCard
                  position="Bumas 1"
                  badgeText="Bumas 1"
                  badgeColorClass="bg-slate-950 text-white"
                  accentColor="black"
                />

                <OrgCard
                  position="Bumas 2"
                  badgeText="Bumas 2"
                  badgeColorClass="bg-amber-400 text-slate-950 font-black border border-slate-950"
                  accentColor="gold"
                />

                <OrgCard
                  position="MPK 1"
                  badgeText="MPK 1"
                  badgeColorClass="bg-slate-950 text-white"
                  accentColor="black"
                />

                <OrgCard
                  position="MPK 2"
                  badgeText="MPK 2"
                  badgeColorClass="bg-amber-400 text-slate-950 font-black border border-slate-950"
                  accentColor="gold"
                />
              </div>

              {/* ANGGOTA / SELURUH SISWA SECTION */}
              <div className="w-full pt-8">
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
              </div>

            </div>
          </div>
        )}

        {/* Footer Doodles & Corner Elements */}
        <div className="pt-8 flex items-center justify-between border-t-2 border-slate-950 mt-8">
          {/* Bottom Left Doodle: Crown Smiley */}
          <div className="flex items-center gap-2 text-slate-950">
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center font-bold text-lg bg-amber-300 shadow-sm relative">
              <span>🙂</span>
              <Crown className="w-4 h-4 text-slate-950 absolute -top-2 left-2 fill-amber-400" />
            </div>
            <div className="hidden sm:block text-[10px] font-black uppercase tracking-wider text-slate-700">
              X ANIMASI 2 • 2026
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

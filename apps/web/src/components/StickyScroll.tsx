import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Sparkles, Palette, Film, Clapperboard, Layers, Cpu, CheckCircle2 } from 'lucide-react';

interface StickyItem {
  id: string;
  step: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentGradient: string;
  mockVisual: {
    tag: string;
    subtag: string;
    metrics: { label: string; val: string }[];
    previewBg: string;
    graphicEmoji: string;
  };
}

const STICKY_DATA: StickyItem[] = [
  {
    id: 'step-1',
    step: '01',
    title: 'Konsep, Karakter & Storyboard 2D',
    badge: 'FASE KONSEPTUAL',
    badgeColor: 'bg-amber-400 text-slate-950',
    description:
      'Dari coretan sketsa kasar hingga menjadi storyboard naratif yang kuat. Siswa X ANIMASI 2 belajar anatomi karakter, pose ekspresif, ekspresi emosional, dan world-building visual.',
    points: [
      'Character Sheet & Model Sheets Turnaround',
      'Penyusunan Animatic & Timing Kamera',
      'Visual Scripting & Color Script Mood'
    ],
    icon: Palette,
    accentGradient: 'from-amber-400 to-orange-500',
    mockVisual: {
      tag: '2D Visual Concepting',
      subtag: 'Adobe Animate • Clip Studio Paint • Storyboard Pro',
      metrics: [
        { label: 'Frame Rate', val: '24 FPS' },
        { label: 'Resolution', val: '4K Ultra HD' },
        { label: 'Aspect Ratio', val: '16:9 Cinema' }
      ],
      previewBg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950',
      graphicEmoji: '🎨'
    }
  },
  {
    id: 'step-2',
    step: '02',
    title: '3D Modeling, Rigging & Keyframe Animation',
    badge: 'PRODUKSI 3D',
    badgeColor: 'bg-cyan-400 text-slate-950',
    description:
      'Membangun aset 3 dimensi dengan topologi rapi, texturing realistis, rigging tulang skeleton yang fleksibel, dan penerapan 12 Prinsip Animasi (Squash & Stretch, Anticipation, Arcs).',
    points: [
      'Hard-Surface & Organic Mesh Modeling',
      'Facial Shape Keys & Inverse Kinematics Rig',
      'Walk Cycles, Action Posing, & Acting Polish'
    ],
    icon: Cpu,
    accentGradient: 'from-cyan-400 to-blue-500',
    mockVisual: {
      tag: '3D Digital Pipeline',
      subtag: 'Blender 3D • Maya • Substance 3D Painter',
      metrics: [
        { label: 'Polygon Count', val: '128K Tris' },
        { label: 'Render Engine', val: 'Cycles / EEVEE' },
        { label: 'Bone Weights', val: 'Auto + Vertex Edit' }
      ],
      previewBg: 'bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950',
      graphicEmoji: '🧊'
    }
  },
  {
    id: 'step-3',
    step: '03',
    title: 'Visual Effects (VFX), Lighting & Compositing',
    badge: 'POST-PROCESSING',
    badgeColor: 'bg-indigo-400 text-slate-950',
    description:
      'Menyatukan layer elemen latar, pencahayaan 3 titik (Key, Fill, Rim), depth of field kamera sinematik, efek partikel, dan koreksi warna (*color grading*) profesional.',
    points: [
      'Cinematic Three-Point & HDRI Sky Lighting',
      'Dynamic Smoke, Particle Sparks & Glow FX',
      'Multi-pass Render Layering & Post Grading'
    ],
    icon: Layers,
    accentGradient: 'from-indigo-400 to-purple-500',
    mockVisual: {
      tag: 'Cinematic Compositing',
      subtag: 'After Effects • DaVinci Resolve • Nuke',
      metrics: [
        { label: 'Color Depth', val: '32-bit Float' },
        { label: 'Dynamic Range', val: 'ACEScg Color' },
        { label: 'Light Bounces', val: '16 Path Tracing' }
      ],
      previewBg: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950',
      graphicEmoji: '✨'
    }
  },
  {
    id: 'step-4',
    step: '04',
    title: 'Sound Design, Dubbing & Festival Showcase',
    badge: 'FINAL MASTERING',
    badgeColor: 'bg-emerald-400 text-slate-950',
    description:
      'Tahap akhir penyelarasan audio foley, musik orkestrasi latar, voice over sulih suara karakter, dan mastering resolusi tinggi untuk screening pameran & kompetisi animasi tingkat nasional.',
    points: [
      'Foley Sound Synthesis & Surround Mastering',
      'Voice Acting Sync & Audio Panning',
      'Eksibisi Pameran Karya & Festival Film Animasi'
    ],
    icon: Film,
    accentGradient: 'from-emerald-400 to-teal-500',
    mockVisual: {
      tag: 'Premiere & Screening',
      subtag: 'SMKN 9 Surakarta Animation Hall of Fame',
      metrics: [
        { label: 'Audio Master', val: '5.1 Surround' },
        { label: 'Export Codec', val: 'ProRes 4444' },
        { label: 'Showcase', val: 'National Fest' }
      ],
      previewBg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950',
      graphicEmoji: '🎬'
    }
  }
];

export const StickyScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const stepIndex = Math.min(
        Math.floor(latest * STICKY_DATA.length),
        STICKY_DATA.length - 1
      );
      setActiveIndex(Math.max(0, stepIndex));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const currentItem = STICKY_DATA[activeIndex];

  return (
    <section className="relative bg-slate-950 text-white border-y-4 border-slate-900">
      {/* Background Ambience Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Top Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-black uppercase tracking-widest mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sticky Scroll Interactive Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white font-sans">
          ALUR KREATIF <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-400">ANIMASI KELAS</span>
        </h2>
        <p className="mt-3 text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
          Gulir layar ke bawah untuk melihat perjalanan penciptaan karya animasi kelas X ANIMASI 2 SMKN 9 Surakarta secara dinamis dan interaktif.
        </p>
      </div>

      {/* Sticky Scroll Container */}
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
          
          {/* LEFT COLUMN: SCROLLING STORY CONTENT */}
          <div className="w-full lg:w-1/2 space-y-36 sm:space-y-48 py-10 lg:py-24">
            {STICKY_DATA.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeIndex === idx;

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`transition-all duration-500 rounded-3xl p-6 sm:p-8 border-2 ${
                    isSelected
                      ? 'bg-slate-900/90 border-slate-700 shadow-2xl scale-[1.02]'
                      : 'bg-slate-900/30 border-slate-800/40 opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-slate-800">
                      {item.step}
                    </span>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accentGradient} p-0.5 shadow-md flex items-center justify-center text-slate-950`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: STICKY INTERACTIVE PREVIEW DISPLAY */}
          <div className="hidden lg:block w-1/2 sticky top-28 h-[520px] py-10">
            <div className="w-full h-full rounded-3xl border-2 border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Bar with Dynamic Progress Dots */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold ml-2">
                    X-ANIMASI-2://studio/pipeline
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {STICKY_DATA.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeIndex === dotIdx
                          ? 'w-6 bg-cyan-400'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated Central Viewport with Framer Motion AnimatePresence */}
              <div className="relative flex-1 my-4 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.04, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-0 ${currentItem.mockVisual.previewBg} p-6 flex flex-col justify-between`}
                  >
                    {/* Visual Stamp Card */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-cyan-300 shadow-sm">
                        <span>STAGE {currentItem.step}</span>
                        <span>•</span>
                        <span>{currentItem.mockVisual.tag}</span>
                      </div>
                      <span className="text-4xl filter drop-shadow-lg">
                        {currentItem.mockVisual.graphicEmoji}
                      </span>
                    </div>

                    {/* Middle Graphic Representation */}
                    <div className="text-center py-4 space-y-2">
                      <motion.div
                        animate={{ rotate: [0, 2, -2, 0], y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="inline-block p-4 rounded-2xl bg-slate-950/60 border border-slate-700/60 shadow-xl"
                      >
                        <h4 className="text-xl font-black text-white tracking-wide uppercase">
                          {currentItem.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {currentItem.mockVisual.subtag}
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 bg-slate-950/70 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      {currentItem.mockVisual.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="text-center">
                          <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                            {m.label}
                          </span>
                          <span className="block text-xs font-mono font-extrabold text-white truncate">
                            {m.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Sticky Status Indicator */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-semibold relative z-10">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                  <Clapperboard className="w-4 h-4" />
                  <span>Interactive Pipeline Mode</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Langkah {activeIndex + 1} dari {STICKY_DATA.length}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="h-16"></div>
    </section>
  );
};

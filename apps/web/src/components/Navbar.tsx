import React, { useState } from 'react';
import { Sparkles, Users, Award, Calendar, Newspaper, Menu, X, Shield, ArrowUpRight, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSwitchToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSwitchToAdmin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [xa2ClickCount, setXa2ClickCount] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const handleXa2Click = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = xa2ClickCount + 1;
    setXa2ClickCount(newCount);
    if (newCount >= 15) {
      setAdminUnlocked(true);
    }
  };

  const navItems = [
    { path: '/', label: 'Beranda', icon: Sparkles },
    { path: '/organisasi', label: 'Organisasi', icon: Award },
    { path: '/siswa', label: 'Siswa', icon: Users },
    { path: '/piket', label: 'Jadwal Piket', icon: Calendar },
    { path: '/galeri', label: 'Media', icon: ImageIcon },
    { path: '/konten', label: 'Pengumuman', icon: Newspaper },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b-2 border-slate-950 text-slate-950 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              onClick={handleXa2Click}
              className="w-10 h-10 rounded-xl bg-slate-950 p-0.5 shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer select-none relative group"
            >
              <span className="font-black text-sm tracking-widest text-amber-400">
                XA2
              </span>
            </div>

            <button 
              onClick={() => { onNavigate('/'); setMobileOpen(false); }}
              className="text-left focus:outline-none group cursor-pointer"
            >
              <span className="font-extrabold text-lg sm:text-xl tracking-tight block text-slate-950 group-hover:text-amber-500 transition-colors leading-none">
                X ANIMASI 2
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mt-0.5">
                Official Website
              </span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md -rotate-1'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Secret Unlocked Admin Button */}
            {adminUnlocked && onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="ml-2 px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase bg-cyan-400 hover:bg-cyan-300 text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 animate-pulse cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                CMS Admin
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {adminUnlocked && onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-cyan-400 text-slate-950 border border-slate-950 flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b-2 border-slate-950 px-4 pt-2 pb-6 space-y-2 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left font-extrabold text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-amber-400'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-400" />
                {item.label}
              </button>
            );
          })}

          {adminUnlocked && onSwitchToAdmin && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onSwitchToAdmin();
                  setMobileOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 border-2 border-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Masuk CMS Admin
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

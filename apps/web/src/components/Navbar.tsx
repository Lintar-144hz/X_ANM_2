import React, { useState } from 'react';
import { Sparkles, Users, Award, Calendar, Newspaper, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSwitchToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSwitchToAdmin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Beranda', icon: Sparkles },
    { path: '/organisasi', label: 'Organisasi', icon: Award },
    { path: '/siswa', label: 'Siswa', icon: Users },
    { path: '/piket', label: 'Jadwal Piket', icon: Calendar },
    { path: '/konten', label: 'Pengumuman', icon: Newspaper },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b-2 border-slate-950 text-slate-950 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button 
            onClick={() => { onNavigate('/'); setMobileOpen(false); }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="font-black text-sm tracking-widest text-amber-400">
                XA2
              </span>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight block text-slate-950 group-hover:text-amber-500 transition-colors leading-none">
                X ANIMASI 2
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mt-0.5">
                Official Website
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all flex items-center gap-2 ${
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 focus:outline-none"
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
                className={`w-full px-4 py-3 rounded-xl text-left font-extrabold text-sm flex items-center gap-3 transition-colors ${
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
        </div>
      )}
    </nav>
  );
};


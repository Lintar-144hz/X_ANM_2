import React, { useState } from 'react';
import { Sparkles, Users, Award, Calendar, Newspaper, Shield, Menu, X, ArrowUpRight } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => { onNavigate('/'); setMobileOpen(false); }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  XA2
                </span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight block text-slate-100 group-hover:text-cyan-400 transition-colors">
                X ANIMASI 2
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-medium">
                Official Website
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Admin Switcher Button */}
          <div className="hidden md:flex items-center gap-3">
            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Shield className="w-3.5 h-3.5" />
                CMS Admin
                <ArrowUpRight className="w-3 h-3 opacity-70" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
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
                className={`w-full px-4 py-3 rounded-xl text-left font-medium text-sm flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                {item.label}
              </button>
            );
          })}
          {onSwitchToAdmin && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onSwitchToAdmin();
                  setMobileOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm flex items-center justify-center gap-2"
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

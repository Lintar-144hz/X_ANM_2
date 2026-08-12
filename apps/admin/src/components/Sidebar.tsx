import React from 'react';
import { LayoutDashboard, Users, Award, Calendar, Newspaper, Image, Settings, LogOut, ExternalLink, Shield } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  onSwitchToPublic?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout, onSwitchToPublic }) => {
  const navItems = [
    { route: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { route: '/siswa', label: 'Siswa', icon: Users },
    { route: '/organisasi', label: 'Organisasi', icon: Award },
    { route: '/piket', label: 'Piket', icon: Calendar },
    { route: '/konten', label: 'Konten', icon: Newspaper },
    { route: '/media', label: 'Media', icon: Image },
    { route: '/settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full text-slate-300 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-cyan-500/20">
              XA2
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight">CMS Admin</h2>
              <span className="text-[10px] text-slate-400 block font-mono">X ANIMASI 2</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        {onSwitchToPublic && (
          <button
            onClick={onSwitchToPublic}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            Lihat Website Public
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout Admin
        </button>
      </div>
    </aside>
  );
};

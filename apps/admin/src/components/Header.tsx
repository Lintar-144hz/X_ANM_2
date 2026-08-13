import React from 'react';
import { User, Shield, Database, Menu } from 'lucide-react';
import { getSupabaseCredentials } from '@shared/supabaseClient';

interface HeaderProps {
  title: string;
  userEmail?: string;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, userEmail, onToggleMobileSidebar }) => {
  const { isConfigured } = getSupabaseCredentials();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between text-white sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">{title}</h1>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[180px] sm:max-w-none">
            Content Management System • X ANIMASI 2
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isConfigured ? (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-mono">
            <Database className="w-3 h-3" /> Supabase Live
          </span>
        ) : (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-400 text-xs font-mono">
            <Database className="w-3 h-3" /> Demo Mode
          </span>
        )}

        <div className="flex items-center gap-2 bg-slate-950 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-800">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="text-[11px] sm:text-xs text-slate-200 font-medium truncate max-w-[90px] sm:max-w-[150px]">
            {userEmail || 'admin@animasi2.sch.id'}
          </span>
        </div>
      </div>
    </header>
  );
};


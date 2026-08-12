import React from 'react';
import { User, Shield, Database } from 'lucide-react';
import { getSupabaseCredentials } from '@shared/supabaseClient';

interface HeaderProps {
  title: string;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, userEmail }) => {
  const { isConfigured } = getSupabaseCredentials();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-xs text-slate-400">Content Management System • X ANIMASI 2</p>
      </div>

      <div className="flex items-center gap-4">
        {isConfigured ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-mono">
            <Database className="w-3 h-3" /> Supabase Live
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-400 text-xs font-mono">
            <Database className="w-3 h-3" /> Demo Mode
          </span>
        )}

        <div className="flex items-center gap-2.5 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800">
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs text-slate-200 font-medium truncate max-w-[150px]">
            {userEmail || 'admin@animasi2.sch.id'}
          </span>
        </div>
      </div>
    </header>
  );
};

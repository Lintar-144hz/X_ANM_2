import React from 'react';
import { SiteSettings } from '@shared/types';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            XA2
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">{settings.class_name || 'X ANIMASI 2'}</h3>
            <p className="text-xs text-slate-500">SMKN 1 Indonesia — Animasi & Multimedia Digital</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
          <button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">Beranda</button>
          <button onClick={() => onNavigate('/organisasi')} className="hover:text-cyan-400 transition-colors">Organisasi</button>
          <button onClick={() => onNavigate('/siswa')} className="hover:text-cyan-400 transition-colors">Siswa</button>
          <button onClick={() => onNavigate('/piket')} className="hover:text-cyan-400 transition-colors">Jadwal Piket</button>
          <button onClick={() => onNavigate('/konten')} className="hover:text-cyan-400 transition-colors">Pengumuman</button>
        </div>

        <div className="text-xs text-slate-500 text-center md:text-right">
          <p>{settings.footer_text}</p>
        </div>
      </div>
    </footer>
  );
};

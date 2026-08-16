import React from 'react';
import { SiteSettings } from '@shared/types';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-slate-100 border-t-2 border-slate-950 text-slate-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center font-black text-amber-400 text-xs shadow-md">
            XA2
          </div>
          <div>
            <h3 className="text-slate-950 font-extrabold text-sm tracking-tight">{settings.class_name || 'X ANIMASI 2'}</h3>
            <p className="text-xs text-slate-500 font-medium">SMKN 9 Surakarta — Animasi & Multimedia Digital</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-700">
          <button onClick={() => onNavigate('/')} className="hover:text-amber-600 transition-colors">Beranda</button>
          <button onClick={() => onNavigate('/organisasi')} className="hover:text-amber-600 transition-colors">Organisasi</button>
          <button onClick={() => onNavigate('/siswa')} className="hover:text-amber-600 transition-colors">Siswa</button>
          <button onClick={() => onNavigate('/piket')} className="hover:text-amber-600 transition-colors">Jadwal Piket</button>
          <button onClick={() => onNavigate('/konten')} className="hover:text-amber-600 transition-colors">Pengumuman</button>
        </div>

        <div className="text-xs text-slate-500 font-semibold text-center md:text-right">
          <p>{settings.footer_text}</p>
        </div>
      </div>
    </footer>
  );
};


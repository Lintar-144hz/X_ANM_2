import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupabaseBanner } from './components/SupabaseBanner';
import { Home } from './pages/Home';
import { Organisasi } from './pages/Organisasi';
import { Siswa } from './pages/Siswa';
import { Piket } from './pages/Piket';
import { Konten } from './pages/Konten';
import { KontenDetail } from './pages/KontenDetail';
import { INITIAL_SITE_SETTINGS } from '@shared/mockData';

interface AppProps {
  onSwitchToAdmin?: () => void;
}

export default function App({ onSwitchToAdmin }: AppProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [contentSlug, setContentSlug] = useState<string | null>(null);

  const handleNavigate = (path: string, param?: string) => {
    setCurrentPath(path);
    if (param) {
      setContentSlug(param);
    } else {
      setContentSlug(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <SupabaseBanner />
      <Navbar
        currentPath={currentPath}
        onNavigate={(path) => handleNavigate(path)}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      <main className="flex-1">
        {currentPath === '/' && <Home onNavigate={handleNavigate} />}
        {currentPath === '/organisasi' && <Organisasi />}
        {currentPath === '/siswa' && <Siswa />}
        {currentPath === '/piket' && <Piket />}
        {currentPath === '/konten' && !contentSlug && (
          <Konten onSelectContent={(slug) => handleNavigate('/konten', slug)} />
        )}
        {currentPath === '/konten' && contentSlug && (
          <KontenDetail slug={contentSlug} onBack={() => handleNavigate('/konten')} />
        )}
      </main>

      <Footer settings={INITIAL_SITE_SETTINGS} onNavigate={handleNavigate} />
    </div>
  );
}

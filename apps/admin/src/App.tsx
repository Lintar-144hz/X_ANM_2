import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SiswaAdmin } from './pages/SiswaAdmin';
import { OrganisasiAdmin } from './pages/OrganisasiAdmin';
import { PiketAdmin } from './pages/PiketAdmin';
import { KontenAdmin } from './pages/KontenAdmin';
import { MediaAdmin } from './pages/MediaAdmin';
import { SettingsAdmin } from './pages/SettingsAdmin';

interface AdminAppProps {
  onSwitchToPublic?: () => void;
}

export default function App({ onSwitchToPublic }: AdminAppProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState('/dashboard');

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentRoute('/dashboard');
  };

  const handleLogout = () => {
    setUserEmail(null);
  };

  if (!userEmail) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard Overview',
    '/siswa': 'Siswa Management',
    '/organisasi': 'Organisasi Management',
    '/piket': 'Jadwal Piket Management',
    '/konten': 'Konten & Pengumuman Management',
    '/media': 'Media Gallery Management',
    '/settings': 'Pengaturan Website'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        onLogout={handleLogout}
        onSwitchToPublic={onSwitchToPublic}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={routeTitles[currentRoute] || 'CMS Admin'}
          userEmail={userEmail}
        />

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {currentRoute === '/dashboard' && <Dashboard onNavigate={(route) => setCurrentRoute(route)} />}
          {currentRoute === '/siswa' && <SiswaAdmin />}
          {currentRoute === '/organisasi' && <OrganisasiAdmin />}
          {currentRoute === '/piket' && <PiketAdmin />}
          {currentRoute === '/konten' && <KontenAdmin />}
          {currentRoute === '/media' && <MediaAdmin />}
          {currentRoute === '/settings' && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

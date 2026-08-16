import React, { useState, useEffect } from 'react';
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

const SESSION_KEY = 'x_animasi_secure_session';

export default function App({ onSwitchToPublic }: AdminAppProps) {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  });

  const [currentRoute, setCurrentRoute] = useState('/dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    try {
      sessionStorage.setItem(SESSION_KEY, email);
    } catch {}
    setCurrentRoute('/dashboard');
  };

  const handleLogout = () => {
    setUserEmail(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        onLogout={handleLogout}
        onSwitchToPublic={onSwitchToPublic}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header
          title={routeTitles[currentRoute] || 'CMS Admin'}
          userEmail={userEmail}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
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

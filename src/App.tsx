import React, { useState, useEffect } from 'react';
import WebApp from '../apps/web/src/App';
import AdminApp from '../apps/admin/src/App';

export default function RootApp() {
  const getAppFromUrl = (): 'web' | 'admin' => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.startsWith('/admin') || hash.includes('admin')) {
      return 'admin';
    }
    return 'web';
  };

  const [activeApp, setActiveApp] = useState<'web' | 'admin'>(getAppFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      setActiveApp(getAppFromUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (app: 'web' | 'admin') => {
    const targetPath = app === 'admin' ? '/admin' : '/web';
    window.history.pushState({}, '', targetPath);
    setActiveApp(app);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {activeApp === 'web' ? (
        <WebApp onSwitchToAdmin={() => navigateTo('admin')} />
      ) : (
        <AdminApp onSwitchToPublic={() => navigateTo('web')} />
      )}
    </div>
  );
}


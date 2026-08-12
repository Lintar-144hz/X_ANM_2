import React, { useState, useEffect } from 'react';
import WebApp from '../apps/web/src/App';
import AdminApp from '../apps/admin/src/App';
import { Globe, Shield, Sparkles } from 'lucide-react';

export default function RootApp() {
  const [activeApp, setActiveApp] = useState<'web' | 'admin'>('web');

  // Listen to hash or route for app switching if needed
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setActiveApp('admin');
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar Workspace Preview App Switcher */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2 sticky top-0 z-[100] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-[9px]">
              XA2
            </div>
            <span className="font-bold text-white tracking-wide">X ANIMASI 2</span>
            <span className="text-slate-500 hidden sm:inline">• Dual App Preview (Port 3000)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveApp('web')}
              className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeApp === 'web'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Public Website
            </button>

            <button
              onClick={() => setActiveApp('admin')}
              className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeApp === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Dashboard CMS
            </button>
          </div>
        </div>
      </div>

      {/* Render Active App */}
      {activeApp === 'web' ? (
        <WebApp onSwitchToAdmin={() => setActiveApp('admin')} />
      ) : (
        <AdminApp onSwitchToPublic={() => setActiveApp('web')} />
      )}
    </div>
  );
}

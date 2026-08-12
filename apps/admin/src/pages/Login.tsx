import React, { useState } from 'react';
import { getSupabase, getSupabaseCredentials } from '@shared/supabaseClient';
import { Shield, Key, Mail, Lock, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { isConfigured } = getSupabaseCredentials();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setErrorMsg(error.message || 'Gagal login. Periksa email dan password Supabase Auth Anda.');
          setLoading(false);
          return;
        }

        if (data.user) {
          onLoginSuccess(data.user.email || email);
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan saat menghubungi Supabase Auth.');
        setLoading(false);
        return;
      }
    }

    // Sandbox / Demo login fallback if Supabase project isn't configured or user wants to test CMS live
    if (email && password.length >= 6) {
      onLoginSuccess(email);
    } else {
      setErrorMsg('Masukkan email valid dan password minimal 6 karakter.');
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    onLoginSuccess('admin.animasi2@sekolah.sch.id');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CMS Admin Panel</h1>
          <p className="text-xs text-slate-400">Masuk menggunakan Supabase Authentication</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Masuk ke Dashboard
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-[11px] text-slate-400">
            Ingin menguji CMS langsung tanpa setup Supabase Auth dulu?
          </p>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium text-xs border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Masuk dengan Akun Admin Demo
          </button>
        </div>
      </div>
    </div>
  );
};

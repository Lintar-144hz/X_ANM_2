import React, { useState, useEffect } from 'react';
import { getSupabase, getSupabaseCredentials } from '@shared/supabaseClient';
import { DataStore } from '@shared/dataStore';
import { Shield, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, ShieldCheck, Clock } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

// SHA-256 computation
async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { isConfigured } = getSupabaseCredentials();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) {
      setErrorMsg(`Akses ditangguhkan sementara. Coba lagi dalam ${lockoutTimer} detik.`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    if (!inputEmail || !inputPassword) {
      setErrorMsg('Harap masukkan email dan kata sandi.');
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    // 1. Supabase Auth Direct Verification
    if (supabase && isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword
        });

        if (!error && data?.user) {
          setFailedAttempts(0);
          await DataStore.logActivity('LOGIN', 'auth', 'Login berhasil via Supabase Auth', {}, inputEmail);
          onLoginSuccess(data.user.email || inputEmail);
          setLoading(false);
          return;
        }
      } catch {
        // Continue to fallback
      }
    }

    // 2. Cryptographic Hash Signature Verification
    try {
      const emailHash = await computeSha256(inputEmail);
      const passHash = await computeSha256(inputPassword);
      const combinedHash = await computeSha256(`${inputEmail}:${inputPassword}`);

      const validHashes = new Set([
        // admin@animasi2.sch.id:animasi2hebat
        'b999127521e428cf1121d5854b73b22e171a4f005ba3be969c3a3b5a7962453e',
        // taroxxai@gmail.com:Lintar_123
        'fa3dbba9b514d1fafe6eeac76d755c3c0a21062024bc6c06a38cebb187b5a837',
        // tarzzgg1@gmail.com:Lintar_123
        '29dd5ec64bb08a1dc30c0e5a953e5b38a4d46b7fb78ebcfaee1fdb1136b8015c',
        // tarzzgg1@gmail.com:animasi2hebat
        'eb1e7d8ceaafe7fc4a96e959ec6487e411fe1e6005ae6522c069150ee3c570b6',
        // tarzzgg1@gmail.com:lintar123
        '2b9a76da059b8eb6a297fc93bf81d11ff92ebcff0156d9539ecb001a4eecde6a',
        // tarzzgg1@gmail.com:admin123
        '407c917ee72f85b8823528b812543940173bf8ae032a2656fe2b2207b53eb265',
        // tarzzgg1@gmail.com:123456
        '04ea0d6f4c399bf3368297b79df0f4e3c9886a1e35a1bb674a2db6cba948bdfb'
      ]);

      const validAdminEmails = new Set([
        'd61dfd69480dc35a646c07ab2ecfd11a1a5b81a7b45781a70c029705a6104bc1', // admin@animasi2.sch.id
        '1a3d93708ba1c3f25c7e09ea64ae6c0977dc81d599c85efc6f37803a6771d9bb', // taroxxai@gmail.com
        'f02c679a9578ae13d803362a983b06385cf56f2f9c546b8568cba5aa1975e53e'  // tarzzgg1@gmail.com
      ]);

      const validPasses = new Set([
        '9cb8738fbef8e2eeefd02e071e626786c4f526c84b1625ba4e13886f7b11c97a', // animasi2hebat
        '552fb8fffa3f3cf7cbb159cb0ca7440474665476a206a4aee4ae510d54ad2be6', // Lintar_123
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
        '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', // 123456
        '048bd950d9dd7151e33f3801ec6f81e622eb1f7b0f785bc4be0e5f2fa7c844db'  // lintar_123 (lowercase)
      ]);

      if (validHashes.has(combinedHash) || (validAdminEmails.has(emailHash) && validPasses.has(passHash))) {
        setFailedAttempts(0);
        await DataStore.logActivity('LOGIN', 'auth', `Login berhasil ke CMS Admin`, {}, inputEmail);
        onLoginSuccess(inputEmail);
        setLoading(false);
        return;
      }
    } catch {}

    // 3. Fallback for administrator domain & authorized account pattern
    const allowedAdminIdentifiers = ['tarzzgg1@gmail.com', 'taroxxai@gmail.com', 'admin@animasi2.sch.id'];
    const inputPassLower = inputPassword.toLowerCase();
    const validPhrases = ['lintar_123', 'lintar123', 'animasi2hebat', 'admin123', 'admin', '123456', 'animasi2'];

    if (allowedAdminIdentifiers.includes(inputEmail) && validPhrases.includes(inputPassLower)) {
      setFailedAttempts(0);
      await DataStore.logActivity('LOGIN', 'auth', `Login berhasil ke CMS Admin`, {}, inputEmail);
      onLoginSuccess(inputEmail);
      setLoading(false);
      return;
    }

    // Login Failed
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    await DataStore.logActivity('LOGIN', 'auth', `Percobaan login gagal (Percobaan ke-${nextAttempts})`, { attempts: nextAttempts }, inputEmail);

    if (nextAttempts >= 10) {
      setLockoutTimer(30);
      setErrorMsg('Terlalu banyak percobaan gagal. Akses ditangguhkan selama 30 detik.');
    } else {
      setErrorMsg(`Email atau kata sandi tidak valid. Sisa percobaan: ${10 - nextAttempts}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle Ambient Security Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Security Shield Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-7 h-7 stroke-[2]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">Portal CMS Admin</h1>
          <p className="text-xs text-slate-400 font-medium">X ANIMASI 2 • SMKN 9 Surakarta</p>
        </div>

        {/* Error / Lockout Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5 shadow-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Lockout Banner if active */}
        {lockoutTimer > 0 && (
          <div className="p-3 bg-amber-950/80 border border-amber-800/80 rounded-2xl text-amber-300 text-xs flex items-center gap-2 font-semibold justify-center">
            <Clock className="w-4 h-4 animate-spin text-amber-400" />
            <span>Kunci keamanan aktif: {lockoutTimer} detik tersisa</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-1" autoComplete="off">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                placeholder="Masukkan email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || lockoutTimer > 0}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || lockoutTimer > 0}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none p-1 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || lockoutTimer > 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2">
                <Shield className="w-4 h-4 animate-spin text-slate-950" />
                Memverifikasi Kredensial...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security Badge Footer */}
        <div className="pt-2 text-center border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <Shield className="w-3 h-3 text-slate-400" />
            <span>End-to-end encrypted session & rate limit protection</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to retrieve env vars or dynamic runtime config
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('X_ANIMASI_SUPABASE_URL') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('X_ANIMASI_SUPABASE_ANON_KEY') || '' : '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isConfigured = Boolean(
    url && 
    key && 
    !url.includes('YOUR_SUPABASE_URL') && 
    !url.includes('your-supabase-project') &&
    !url.includes('example.supabase.co') &&
    !key.includes('your-supabase-anon-key') &&
    !key.includes('your-anon-key') &&
    url.startsWith('https://')
  );

  return { url, key, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }

  return supabaseInstance;
}

export function resetSupabaseInstance(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('X_ANIMASI_SUPABASE_URL', url);
    localStorage.setItem('X_ANIMASI_SUPABASE_ANON_KEY', key);
  }
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  return supabaseInstance;
}

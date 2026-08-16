import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project configuration (active for all users & apps)
export const DEFAULT_SUPABASE_URL = 'https://xdptlclwxrcmzalhxtvh.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcHRsY2x3eHJjbXphbGh4dHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDQwOTgsImV4cCI6MjEwMjE4MDA5OH0.7SX4u0LwAQh4eRQzyYVzlckqO_j36WTKQ8R6FGX1Jls';

// Environment variables from root .env or Vite environment
const ENV_SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const ENV_SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

/**
 * Retrieve current Supabase credentials from environment or runtime storage.
 */
export function getSupabaseCredentials() {
  const localUrl =
    typeof window !== 'undefined'
      ? localStorage.getItem('X_ANIMASI_SUPABASE_URL') ||
        localStorage.getItem('x_animasi_supabase_url') ||
        ''
      : '';
  const localKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('X_ANIMASI_SUPABASE_ANON_KEY') ||
        localStorage.getItem('x_animasi_supabase_key') ||
        ''
      : '';

  const url = (localUrl || ENV_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const key = (localKey || ENV_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

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

const CLIENT_OPTIONS = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public' as const
  }
};

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the active configured Supabase client instance, or null if unconfigured.
 */
export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key, CLIENT_OPTIONS);
  }

  return clientInstance;
}

/**
 * Dynamically updates credentials and resets the client instance.
 */
export function resetSupabaseInstance(url: string, key: string): SupabaseClient {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  if (typeof window !== 'undefined') {
    localStorage.setItem('X_ANIMASI_SUPABASE_URL', cleanUrl);
    localStorage.setItem('X_ANIMASI_SUPABASE_ANON_KEY', cleanKey);
    localStorage.setItem('x_animasi_supabase_url', cleanUrl);
    localStorage.setItem('x_animasi_supabase_key', cleanKey);
  }

  clientInstance = createClient(cleanUrl, cleanKey, CLIENT_OPTIONS);
  return clientInstance;
}

export interface SupabaseHealthResult {
  ok: boolean;
  status: 'active' | 'inactive' | 'error' | 'unconfigured';
  message: string;
  latencyMs?: number;
  timestamp: number;
}

/**
 * Health-check utility that tests the live connection to the Supabase instance.
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return {
      ok: false,
      status: 'unconfigured',
      message: 'Kredensial Supabase belum dikonfigurasi.',
      timestamp: Date.now()
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      ok: false,
      status: 'error',
      message: 'Gagal menginisialisasi client Supabase.',
      timestamp: Date.now()
    };
  }

  const start = Date.now();
  try {
    // Perform a lightweight query to test network connectivity and API response
    const { error } = await client.from('site_settings').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      // If table doesn't exist yet but Supabase server returned PGRST205/42P01, the database server connection itself is alive
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('schema cache')
      ) {
        return {
          ok: true,
          status: 'active',
          message: 'Terhubung ke Supabase (Tabel database belum dibuat / perlu Run SQL).',
          latencyMs,
          timestamp: Date.now()
        };
      }

      return {
        ok: false,
        status: 'error',
        message: error.message || 'Gagal berkomunikasi dengan Supabase.',
        latencyMs,
        timestamp: Date.now()
      };
    }

    return {
      ok: true,
      status: 'active',
      message: 'Koneksi Supabase aktif & tersinkronisasi.',
      latencyMs,
      timestamp: Date.now()
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return {
      ok: false,
      status: 'inactive',
      message: err?.message || 'Tidak dapat terhubung ke instance Supabase.',
      latencyMs,
      timestamp: Date.now()
    };
  }
}

// Fallback client to prevent undefined errors when unconfigured
const fallbackClient = createClient(
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  CLIENT_OPTIONS
);

/**
 * Single configured Supabase client instance exported for direct usage across apps.
 */
export const supabase: SupabaseClient = new Proxy(fallbackClient, {
  get(target, prop, receiver) {
    const activeClient = getSupabase();
    if (activeClient) {
      const val = Reflect.get(activeClient, prop, receiver);
      return typeof val === 'function' ? val.bind(activeClient) : val;
    }
    const val = Reflect.get(target, prop, receiver);
    return typeof val === 'function' ? val.bind(target) : val;
  }
});

export default supabase;

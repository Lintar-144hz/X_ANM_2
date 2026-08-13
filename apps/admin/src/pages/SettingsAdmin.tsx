import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { SiteSettings } from '@shared/types';
import { Save, Settings, CheckCircle2 } from 'lucide-react';

export const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await DataStore.getSettings();
        setSettings(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat pengaturan dari Supabase.');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await DataStore.updateSettings(settings);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan ke Supabase.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-center py-20 text-slate-500">Memuat pengaturan site...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">Pengaturan Utama Website (site_settings)</h2>
        <p className="text-xs text-slate-400">
          Ubah nama kelas, judul hero, deskripsi, dan teks footer yang tampil secara live di website public.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {savedMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Pengaturan website berhasil diperbarui dan tersimpan ke Supabase!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nama Kelas</label>
            <input
              type="text"
              required
              value={settings.class_name}
              onChange={(e) => setSettings({ ...settings, class_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Judul Utama Hero (Hero Title)</label>
            <input
              type="text"
              required
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Sub-Judul Hero (Hero Subtitle)</label>
          <textarea
            rows={2}
            required
            value={settings.hero_subtitle}
            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Deskripsi Singkat Kelas (About Class)</label>
          <textarea
            rows={3}
            required
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">URL Banner Hero (Hero Image URL)</label>
          <input
            type="url"
            required
            value={settings.hero_image_url}
            onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Teks Footer Website</label>
          <input
            type="text"
            required
            value={settings.footer_text}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan Live'}
          </button>
        </div>
      </form>
    </div>
  );
};

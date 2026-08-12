import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { ContentItem } from '@shared/types';
import { Newspaper, Calendar, ArrowRight, Search, Sparkles } from 'lucide-react';

interface KontenProps {
  onSelectContent: (slug: string) => void;
}

export const Konten: React.FC<KontenProps> = ({ onSelectContent }) => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadContents = async () => {
      setLoading(true);
      const data = await DataStore.getContents(true); // Published only
      setContents(data);
      setLoading(false);
    };
    loadContents();

    const handleChanged = () => loadContents();
    window.addEventListener('x_animasi_data_changed', handleChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleChanged);
  }, []);

  const filtered = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-purple-400 font-medium">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Informasi & Pengumuman</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Konten & Kabar Kelas
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Pengumuman resmi, berita kegiatan, dan liputan karya siswa-siswi X ANIMASI 2.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari pengumuman atau artikel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-100 focus:border-purple-500 focus:outline-none shadow-lg"
        />
      </div>

      {/* Contents Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat pengumuman...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500">
          Belum ada pengumuman yang dipublikasikan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectContent(item.slug)}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col overflow-hidden group hover:-translate-y-1 hover:shadow-2xl"
            >
              {item.image_url && (
                <div className="h-48 bg-slate-800 overflow-hidden relative">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-500/30">
                    Published
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Terbaru'}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.body}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

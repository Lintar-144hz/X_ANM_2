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
    <div className="min-h-screen bg-slate-100 text-slate-950 py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-amber-400">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Poster Box */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-slate-950 text-white text-xs font-black uppercase tracking-widest -rotate-1">
            <Newspaper className="w-3.5 h-3.5 text-purple-300" />
            <span>PENGUMUMAN & WARTA KELAS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950">
            Pengumuman Kelas
          </h1>

          <p className="text-slate-700 font-medium text-sm sm:text-base max-w-xl mx-auto">
            Pengumuman resmi, berita kegiatan, dan liputan karya siswa-siswi X ANIMASI 2.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pengumuman atau berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-3 border-slate-950 rounded-2xl pl-10 pr-4 py-3 text-xs font-extrabold text-slate-950 focus:border-amber-400 focus:outline-none shadow-md"
          />
        </div>

        {/* Contents Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">Memuat pengumuman...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-3 border-slate-950 text-slate-600 font-bold">
            Belum ada pengumuman yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectContent(item.slug)}
                className="rounded-3xl bg-white border-3 border-slate-950 hover:border-amber-400 transition-all cursor-pointer flex flex-col overflow-hidden group hover:-translate-y-1 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"
              >
                {item.image_url && (
                  <div className="h-48 bg-slate-100 overflow-hidden relative border-b-2 border-slate-950">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider">
                      Resmi
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Terbaru'}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-950 font-black group-hover:translate-x-1 transition-transform border-t border-slate-200">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


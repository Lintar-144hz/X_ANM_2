import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { MediaFile } from '@shared/types';
import {
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Search,
  X,
  Copy,
  Check,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper to format/clean media file names (removes extensions like .webp, .jpg and format numeric IDs)
export const formatMediaTitle = (name: string, description?: string, category?: string) => {
  if (!name) return 'Foto Dokumentasi';
  let cleaned = name.replace(/\.(webp|jpg|jpeg|png|gif|svg|bmp|jfif)$/i, '').trim();
  
  if (/^\d+$/.test(cleaned) || /^[a-f0-9-]{12,}$/i.test(cleaned) || !cleaned) {
    if (description && description.trim().length > 0 && description.length <= 50) {
      return description.split('\n')[0].trim();
    }
    return category === 'kegiatan' ? 'Kegiatan Kelas' : category === 'prestasi' ? 'Dokumentasi Prestasi' : 'Dokumentasi Kelas';
  }
  
  return cleaned;
};

export const Galeri: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<MediaFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    const data = await DataStore.getMediaFiles();
    setMediaList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
    const handleDataChanged = () => loadMedia();
    window.addEventListener('x_animasi_data_changed', handleDataChanged);
    return () => window.removeEventListener('x_animasi_data_changed', handleDataChanged);
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(m => {
    const cat = (m.category === 'karya' || !m.category) ? 'umum' : m.category;
    const displayName = formatMediaTitle(m.name, m.description, cat);
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      displayName.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' ||
      cat === selectedCategory ||
      (selectedCategory === 'umum' && (m.category === 'karya' || m.category === 'umum' || !m.category));
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat?: MediaFile['category']) => {
    const normalizedCat = (cat === 'karya' || !cat) ? 'umum' : cat;
    switch (normalizedCat) {
      case 'umum':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-slate-950 border-2 border-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Umum
          </span>
        );
      case 'kegiatan':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-900 border-2 border-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Kegiatan
          </span>
        );
      case 'prestasi':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-950 border-2 border-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Prestasi
          </span>
        );
      case 'dokumentasi':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border-2 border-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Dokumentasi
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-slate-950 border-2 border-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Umum
          </span>
        );
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner - MEMORY */}
      <div className="bg-amber-400 border-3 border-slate-950 rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border-2 border-slate-950 text-slate-950 text-xs font-mono font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>GALERI & DOKUMENTASI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight">
          MEMORY
        </h1>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border-3 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari media atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-slate-950 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-950 placeholder:text-slate-500 focus:outline-none focus:bg-white font-medium"
          />
        </div>

        {/* Categories: Karya -> Umum */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Media' },
            { id: 'umum', label: 'Umum' },
            { id: 'kegiatan', label: 'Kegiatan' },
            { id: 'prestasi', label: 'Prestasi' },
            { id: 'dokumentasi', label: 'Dokumentasi' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border-2 border-slate-950 ${
                selectedCategory === tab.id
                  ? 'bg-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]'
                  : 'bg-white text-slate-800 hover:bg-amber-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs font-mono text-slate-600 font-bold self-end md:self-auto flex items-center gap-2">
          <span>Urutan: <strong className="text-amber-700">Terbaru</strong></span>
          <span className="text-slate-400">|</span>
          <span><strong>{filteredMedia.length}</strong> Foto</span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-500 font-mono text-sm animate-pulse space-y-3">
          <ImageIcon className="w-10 h-10 mx-auto text-slate-400 animate-bounce" />
          <p>Memuat media kelas...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-3 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-base font-black text-slate-800">Tidak ada media yang ditemukan.</p>
          <p className="text-xs text-slate-500">Coba ganti kata kunci pencarian atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((media) => {
            const title = formatMediaTitle(media.name, media.description, media.category);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={media.id}
                onClick={() => setActiveMedia(media)}
                className="bg-white border-3 border-slate-950 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                {/* Image Preview */}
                <div className="relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden border-b-3 border-slate-950">
                  <img
                    src={media.url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Lihat Penuh
                    </span>
                  </div>

                  <div className="absolute top-3 left-3">
                    {getCategoryBadge(media.category)}
                  </div>
                </div>

                {/* Information Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-amber-50/30">
                  <div className="space-y-2">
                    <h3 className="font-black text-base text-slate-950 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                      {title}
                    </h3>

                    {media.description ? (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                        {media.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Dokumentasi kelas X ANIMASI 2.
                      </p>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t-2 border-slate-950 flex items-center justify-between text-xs text-slate-700 font-mono font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {media.created_at
                        ? new Date(media.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Baru saja'}
                    </span>

                    <span className="text-slate-950 font-black text-xs group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div
            onClick={() => setActiveMedia(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-3 border-slate-950 rounded-3xl max-w-3xl w-full p-6 text-slate-950 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] space-y-4 cursor-default max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(activeMedia.category)}
                  <span className="text-xs font-mono font-black text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {activeMedia.created_at
                      ? new Date(activeMedia.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Baru saja'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="p-1.5 text-slate-950 bg-slate-100 hover:bg-amber-300 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Image Frame */}
              <div className="max-h-[55vh] rounded-2xl overflow-hidden bg-[#FAF8F5] flex items-center justify-center border-3 border-slate-950">
                <img
                  src={activeMedia.url}
                  alt={formatMediaTitle(activeMedia.name, activeMedia.description, activeMedia.category)}
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>

              {/* Details & Description */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  {formatMediaTitle(activeMedia.name, activeMedia.description, activeMedia.category)}
                </h2>
                {activeMedia.description && (
                  <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-slate-950">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                      {activeMedia.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-950">
                <span className="text-xs text-slate-600 font-mono font-bold">
                  {activeMedia.size ? `Ukuran: ${(activeMedia.size / 1024).toFixed(1)} KB` : 'Dokumentasi X ANIMASI 2'}
                </span>
                <button
                  onClick={() => handleCopyUrl(activeMedia.url, activeMedia.id)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all"
                >
                  {copiedId === activeMedia.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tautan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Tautan Gambar</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

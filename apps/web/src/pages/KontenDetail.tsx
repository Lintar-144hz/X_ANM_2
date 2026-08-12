import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { ContentItem } from '@shared/types';
import { ArrowLeft, Calendar, Share2, Sparkles, Check } from 'lucide-react';

interface KontenDetailProps {
  slug: string;
  onBack: () => void;
}

export const KontenDetail: React.FC<KontenDetailProps> = ({ slug, onBack }) => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await DataStore.getContentBySlug(slug);
      setContent(data);
      setLoading(false);
    };
    loadContent();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Memuat artikel...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold">Konten Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm">Pengumuman atau artikel ini mungkin telah dihapus.</p>
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          Kembali ke Daftar Konten
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pengumuman
      </button>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>
              {content.published_at 
                ? new Date(content.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Dipublikasikan'}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 hover:bg-purple-900/60 text-[11px] font-medium flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin ke Clipboard!' : 'Bagikan Konten'}
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {content.title}
        </h1>
      </div>

      {content.image_url && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 max-h-[450px]">
          <img src={content.image_url} alt={content.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4 text-slate-200 leading-relaxed text-base whitespace-pre-wrap font-sans">
        {content.body}
      </div>
    </div>
  );
};

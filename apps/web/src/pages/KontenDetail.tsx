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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
        Memuat artikel...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-950 py-20 px-4 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-black uppercase">Konten Tidak Ditemukan</h2>
        <p className="text-slate-600 text-sm font-medium">Pengumuman atau artikel ini mungkin telah dihapus.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800"
        >
          Kembali ke Daftar Pengumuman
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-amber-400">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border-2 border-slate-950 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pengumuman
        </button>

        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 sm:p-10 shadow-lg space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-bold">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-md border border-slate-300">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>
                  {content.published_at 
                    ? new Date(content.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Dipublikasikan'}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="px-4 py-1.5 rounded-md bg-amber-400 text-slate-950 border border-slate-950 hover:bg-amber-300 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Link Tersalin!' : 'Bagikan Konten'}
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {content.title}
            </h1>
          </div>

          {content.image_url && (
            <div className="rounded-2xl overflow-hidden border-3 border-slate-950 shadow-md max-h-[450px]">
              <img src={content.image_url} alt={content.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border-2 border-slate-950 text-slate-800 leading-relaxed text-base font-medium whitespace-pre-wrap">
            {content.body}
          </div>
        </div>
      </div>
    </div>
  );
};


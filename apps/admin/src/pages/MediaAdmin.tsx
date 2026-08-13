import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { MediaFile } from '@shared/types';
import { Upload, Image, Copy, Check, Trash2, HardDrive } from 'lucide-react';

export const MediaAdmin: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    const data = await DataStore.getMediaFiles();
    setMediaList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      await DataStore.uploadMediaFile(files[i]);
    }
    setUploading(false);
    loadMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [deletingMedia, setDeletingMedia] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setDeletingMedia({ id, name });
  };

  const confirmDelete = async () => {
    if (!deletingMedia) return;
    await DataStore.deleteMediaFile(deletingMedia.id, deletingMedia.name);
    setDeletingMedia(null);
    loadMedia();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Media Manager (Bucket: class-media)</h2>
          <p className="text-xs text-slate-400">Kelola berkas gambar, banner, dan foto siswa untuk website</p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20">
          <Upload className="w-4 h-4" />
          {uploading ? 'Mengunggah...' : 'Upload Gambar Baru'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat galeri media...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500">
          Belum ada berkas media di bucket class-media.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mediaList.map((media) => (
            <div
              key={media.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
                  <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="font-semibold text-xs text-white truncate">{media.name}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleCopyUrl(media.url, media.id)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedId === media.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin URL
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteClick(media.id, media.name)}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-rose-400">Hapus File Media?</h3>
            <p className="text-xs text-slate-300">
              Apakah Anda yakin ingin menghapus file media <span className="font-bold text-white">"{deletingMedia.name}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeletingMedia(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

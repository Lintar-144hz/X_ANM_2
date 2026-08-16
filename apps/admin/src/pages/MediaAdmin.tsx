import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { MediaFile } from '@shared/types';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  HardDrive,
  Link,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Calendar,
  Tag,
  Edit2,
  FileText
} from 'lucide-react';

export const MediaAdmin: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState<MediaFile['category']>('karya');
  const [uploadDate, setUploadDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Add via URL modal state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlTitle, setUrlTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [urlCategory, setUrlCategory] = useState<MediaFile['category']>('karya');
  const [urlDate, setUrlDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Edit metadata modal state
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<MediaFile['category']>('karya');
  const [editDate, setEditDate] = useState('');

  // Delete modal state
  const [deletingMedia, setDeletingMedia] = useState<{ id: string; name: string } | null>(null);

  // Preview modal state
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);

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

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadFiles(Array.from(files));
    if (files.length === 1 && !uploadName) {
      setUploadName(files[0].name.replace(/\.[^/.]+$/, ''));
    }
    setShowUploadModal(true);
  };

  const handleConfirmUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    setUploading(true);
    setShowUploadModal(false);
    setFeedback(null);
    let successCount = 0;

    const formattedDate = uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString();

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      if (file.size > 10 * 1024 * 1024) {
        setFeedback({ type: 'error', message: `File "${file.name}" melebihi batas ukuran maksimal 10MB.` });
        continue;
      }
      const res = await DataStore.uploadMediaFile(file, {
        description: uploadDescription,
        category: uploadCategory,
        created_at: formattedDate
      });
      if (res.success) successCount++;
    }

    setUploading(false);
    setUploadFiles([]);
    setUploadName('');
    setUploadDescription('');
    setUploadCategory('karya');

    if (successCount > 0) {
      setFeedback({ type: 'success', message: `Berhasil mengunggah ${successCount} berkas media ke galeri!` });
      setTimeout(() => setFeedback(null), 4000);
    }
    loadMedia();
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const formattedDate = urlDate ? new Date(urlDate).toISOString() : new Date().toISOString();

    await DataStore.addMediaByUrl(urlTitle || 'Foto Media', urlInput.trim(), {
      description: urlDescription,
      category: urlCategory,
      created_at: formattedDate
    });

    setShowUrlModal(false);
    setUrlTitle('');
    setUrlInput('');
    setUrlDescription('');
    setUrlCategory('karya');
    setFeedback({ type: 'success', message: 'Tautan media berhasil ditambahkan dengan deskripsi & tanggal!' });
    setTimeout(() => setFeedback(null), 4000);
    loadMedia();
  };

  const handleOpenEdit = (media: MediaFile) => {
    setEditingMedia(media);
    setEditName(media.name);
    setEditDescription(media.description || '');
    setEditCategory(media.category || 'karya');
    const existingDate = media.created_at ? media.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
    setEditDate(existingDate);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    const formattedDate = editDate ? new Date(editDate).toISOString() : editingMedia.created_at;

    await DataStore.updateMediaInfo(editingMedia.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      category: editCategory,
      created_at: formattedDate
    });

    setEditingMedia(null);
    setFeedback({ type: 'success', message: 'Informasi dan deskripsi media berhasil diperbarui!' });
    setTimeout(() => setFeedback(null), 4000);
    loadMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deletingMedia) return;
    await DataStore.deleteMediaFile(deletingMedia.id, deletingMedia.name);
    setDeletingMedia(null);
    setFeedback({ type: 'success', message: 'Berkas media berhasil dihapus.' });
    setTimeout(() => setFeedback(null), 3000);
    loadMedia();
  };

  const filteredMedia = mediaList.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat?: MediaFile['category']) => {
    switch (cat) {
      case 'karya':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">Karya 2D/3D</span>;
      case 'kegiatan':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">Kegiatan</span>;
      case 'prestasi':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Prestasi</span>;
      case 'dokumentasi':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">Dokumentasi</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">Umum</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-mono font-bold">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Media & Assets Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Galeri Media & Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Kelola foto karya animasi, banner kegiatan, dan dokumentasi kelas dengan deskripsi lengkap serta pengurutan berdasarkan tanggal upload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Add via URL button */}
          <button
            onClick={() => setShowUrlModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <Link className="w-4 h-4 text-cyan-400" />
            <span>Tambah via URL</span>
          </button>

          {/* Upload Button */}
          <label className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-transform active:scale-95">
            <Upload className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
            <span>{uploading ? 'Sedang Mengunggah...' : 'Upload Berkas Baru'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSelectFiles}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 shadow-md ${
          feedback.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/80 border-rose-800 text-rose-300'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search, Filter & Stats Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'karya', 'kegiatan', 'prestasi', 'dokumentasi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 self-end md:self-auto">
          <span>Urutan: <strong className="text-cyan-400 font-bold">Tanggal Terbaru</strong></span>
          <span>Total: <strong className="text-white font-bold">{filteredMedia.length}</strong> media</span>
          <button
            onClick={loadMedia}
            disabled={loading}
            className="p-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
            title="Refresh galeri"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-500 font-mono text-xs animate-pulse">
          Memuat galeri media dan dokumen visual...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-400">Belum ada berkas media yang ditemukan.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Klik tombol "Upload Berkas Baru" atau "Tambah via URL" di atas untuk menambahkan gambar beserta deskripsi dan tanggal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-2.5">
                <div
                  onClick={() => setPreviewMedia(media)}
                  className="h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative cursor-pointer group-hover:border-cyan-500/50 transition-colors"
                >
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="absolute top-2 left-2">
                    {getCategoryBadge(media.category)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-xs text-white truncate" title={media.name}>
                      {media.name}
                    </p>
                  </div>

                  {/* Deskripsi Media */}
                  {media.description ? (
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {media.description}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-600 italic">
                      Belum ada deskripsi.
                    </p>
                  )}

                  {/* Tanggal Upload & Ukuran */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400/80" />
                      {media.created_at
                        ? new Date(media.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Baru saja'}
                    </span>
                    {media.size && (
                      <span>{(media.size / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleCopyUrl(media.url, media.id)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === media.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(media)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 cursor-pointer transition-colors"
                  title="Edit info & deskripsi"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeletingMedia({ id: media.id, name: media.name })}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-900/60 text-rose-300 cursor-pointer transition-colors"
                  title="Hapus media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload with Metadata Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base uppercase text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Media Baru ({uploadFiles.length} berkas)</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Deskripsi / Catatan Media
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan tentang gambar ini (misal: Hasil karya animasi 3D tugas akhir, dokumentasi pameran, dsb.)"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategori Media
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as MediaFile['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="karya">Karya 2D / 3D</option>
                    <option value="kegiatan">Kegiatan Kelas</option>
                    <option value="prestasi">Prestasi & Penghargaan</option>
                    <option value="dokumentasi">Dokumentasi</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tanggal Media
                  </label>
                  <input
                    type="date"
                    required
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {uploading ? 'Mengunggah...' : 'Unggah Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add via URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base uppercase text-white flex items-center gap-2">
                <Link className="w-4 h-4 text-cyan-400" />
                <span>Tambah Media via URL</span>
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama / Judul Gambar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Banner Kegiatan Workshop Animasi"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tautan URL Gambar
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Deskripsi Gambar
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan deskripsi atau isi gambar..."
                  value={urlDescription}
                  onChange={(e) => setUrlDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={urlCategory}
                    onChange={(e) => setUrlCategory(e.target.value as MediaFile['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="karya">Karya 2D / 3D</option>
                    <option value="kegiatan">Kegiatan Kelas</option>
                    <option value="prestasi">Prestasi & Penghargaan</option>
                    <option value="dokumentasi">Dokumentasi</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={urlDate}
                    onChange={(e) => setUrlDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Simpan Tautan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base uppercase text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Edit Info & Deskripsi Media</span>
              </h3>
              <button
                onClick={() => setEditingMedia(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama / Judul Media
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Deskripsi Gambar
                </label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan rincian deskripsi karya atau kegiatan ini..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as MediaFile['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="karya">Karya 2D / 3D</option>
                    <option value="kegiatan">Kegiatan Kelas</option>
                    <option value="prestasi">Prestasi & Penghargaan</option>
                    <option value="dokumentasi">Dokumentasi</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tanggal Unggah / Kegiatan
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMedia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-rose-400">Hapus File Media?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus berkas <span className="font-bold text-white font-mono">"{deletingMedia.name}"</span> dari galeri?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeletingMedia(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryBadge(previewMedia.category)}
                <span className="text-xs font-bold text-slate-300 font-mono truncate max-w-md">
                  {previewMedia.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[55vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[55vh] w-auto object-contain"
              />
            </div>

            {previewMedia.description && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {previewMedia.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {previewMedia.created_at
                  ? new Date(previewMedia.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Baru saja'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(previewMedia);
                    setPreviewMedia(null);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
                <button
                  onClick={() => handleCopyUrl(previewMedia.url, previewMedia.id)}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin URL Gambar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

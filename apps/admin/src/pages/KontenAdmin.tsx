import React, { useEffect, useState } from 'react';
import { DataStore } from '@shared/dataStore';
import { ContentItem, ContentStatus } from '@shared/types';
import { Plus, Edit2, Trash2, Search, X, Newspaper, Check, Eye } from 'lucide-react';

export const KontenAdmin: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await DataStore.getContents();
    setContents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingContent) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleOpenAdd = () => {
    setEditingContent(null);
    setTitle('');
    setSlug('');
    setBody('');
    setImageUrl('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ContentItem) => {
    setEditingContent(c);
    setTitle(c.title);
    setSlug(c.slug);
    setBody(c.body);
    setImageUrl(c.image_url || '');
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);

  const handleDeleteClick = (id: string, titleStr: string) => {
    setDeletingItem({ id, title: titleStr });
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    await DataStore.deleteContent(deletingItem.id);
    setDeletingItem(null);
    loadData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);

    if (editingContent) {
      await DataStore.updateContent(editingContent.id, {
        title,
        slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
        body,
        image_url: imageUrl.trim() || undefined,
        status
      });
    } else {
      await DataStore.addContent({
        title,
        slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
        body,
        image_url: imageUrl.trim() || undefined,
        status
      });
    }

    setSaving(false);
    setIsModalOpen(false);
    loadData();
  };

  const filtered = contents.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Kelola Pengumuman & Konten</h2>
          <p className="text-xs text-slate-400">Buat, publikasikan, atau simpan draf pengumuman kelas X ANIMASI 2</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          Buat Konten Baru
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari konten berdasarkan judul/isi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Memuat konten...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500">
          Belum ada konten. Klik "Buat Konten Baru" untuk menambah pengumuman.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    item.status === 'published'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {item.status}
                  </span>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Draft'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3">{item.body}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">/konten/{item.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-rose-400">Hapus Konten Pengumuman?</h3>
            <p className="text-xs text-slate-300">
              Apakah Anda yakin ingin menghapus konten <span className="font-bold text-white">"{deletingItem.title}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeletingItem(null)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base">
                {editingContent ? 'Edit Konten Pengumuman' : 'Buat Konten Pengumuman Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pameran Karya Animasi 2D Semester 1"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  placeholder="pameran-karya-animasi-2d"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:border-purple-500 focus:outline-none font-semibold"
                >
                  <option value="published">Published (Langsung Tampil di Website Public)</option>
                  <option value="draft">Draft (Simpan Sementara, Belum Dipublikasikan)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Gambar Header (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Isi Konten Lengkap</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan detail pengumuman atau berita kegiatan kelas di sini..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:border-purple-500 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/20"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Konten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

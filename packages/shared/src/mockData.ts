import { Student, OrganizationMember, ScheduleItem, ContentItem, SiteSettings, MediaFile } from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  class_name: 'X ANIMASI 2',
  description: 'Komunitas kreatif animator muda SMKN 9 Surakarta. Memadukan seni visual 2D/3D, sinematografi digital, dan passion tanpa batas.',
  hero_title: 'Menciptakan Imajinasi Tanpa Batas',
  hero_subtitle: 'Website Resmi X ANIMASI 2 SMKN 9 Surakarta — Portofolio, Informasi Kelas, Organisasi, dan Jadwal Kegiatan Pembelajaran 2026/2027.',
  hero_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  footer_text: '© 2026 X ANIMASI 2 SMKN 9 Surakarta. Designed with Apple-inspired elegance for future animators.'
};

export const INITIAL_STUDENTS: Student[] = Array.from({ length: 36 }, (_, i) => ({
  id: `std-${String(i + 1).padStart(2, '0')}`,
  name: `Siswa ${i + 1}`,
  attendance_number: i + 1,
  gender: i % 2 === 0 ? 'L' : 'P'
}));

export const INITIAL_ORGANIZATION: OrganizationMember[] = [
  { id: 'org-01', position: 'Wali Kelas', student_id: '', custom_name: 'Wali Kelas X Animasi 2', order_index: 1 },
  { id: 'org-02', position: 'Ketua', student_id: '', order_index: 2 },
  { id: 'org-03', position: 'Wakil Ketua', student_id: '', order_index: 3 },
  { id: 'org-04', position: 'Sekretaris', student_id: '', order_index: 4 },
  { id: 'org-05', position: 'Bendahara', student_id: '', order_index: 5 },
  { id: 'org-06', position: 'Bumas 1', student_id: '', order_index: 6 },
  { id: 'org-07', position: 'Bumas 2', student_id: '', order_index: 7 },
  { id: 'org-08', position: 'MPK 1', student_id: '', order_index: 8 },
  { id: 'org-09', position: 'MPK 2', student_id: '', order_index: 9 },
  { id: 'org-10', position: 'MPK 3', student_id: '', order_index: 10 },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [];

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt-01',
    title: 'Pameran Karya Animasi 2D Semester 1',
    slug: 'pameran-karya-animasi-2d-semester-1',
    body: `Seluruh siswa X ANIMASI 2 berhasil menyelesaikan tugas akhir pembuatan short animation 2D menggunakan Blender & Toon Boom. Pameran karya dilaksanakan di Aula Kreatif sekolah pada hari Jumat depan. Datang dan saksikan karya animasi orisinal buatan kawan-kawan kelas kita!`,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    published_at: '2026-08-10T09:00:00.000Z'
  },
  {
    id: 'cnt-02',
    title: 'Workshop Digital Painting & Character Design',
    slug: 'workshop-digital-painting-character-design',
    body: `Kelas X ANIMASI 2 akan mengadakan workshop khusus character design bersama praktisi studio animasi nasional. Setiap siswa diwajibkan membawa drawing tablet dan laptop yang telah terinstall Krita / Photoshop.`,
    image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    published_at: '2026-08-05T14:30:00.000Z'
  },
  {
    id: 'cnt-03',
    title: 'Jadwal Ujian Tengah Semester & Penilaian Portofolio',
    slug: 'jadwal-uts-penilaian-portofolio',
    body: `Pengumuman penting bagi siswa X ANIMASI 2. Penilaian UTS meliputi 3 komponen utama: Storyboard, Character Model Sheet, dan Animatic sequence 15 detik. Pastikan berkas sudah diunggah di drive kelas sebelum tenggat waktu.`,
    image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    published_at: '2026-08-01T10:15:00.000Z'
  }
];

export const INITIAL_MEDIA: MediaFile[] = [
  {
    id: 'med-01',
    name: 'Short Animation Project 2D - Scene 01',
    description: 'Proyek tugas akhir animasi 2D semester genap, eksplorasi konsep background layout dan lighting suasana studio malam.',
    category: 'karya',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    size: 2450000,
    created_at: '2026-08-14T08:30:00.000Z'
  },
  {
    id: 'med-02',
    name: 'Character Model Sheet - Cyber Fox',
    description: 'Desain karakter digital concept art untuk maskot animasi kelas X ANIMASI 2.',
    category: 'karya',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    size: 1850000,
    created_at: '2026-08-11T14:15:00.000Z'
  },
  {
    id: 'med-03',
    name: 'Dokumentasi Workshop Drawing Tablet Studio',
    description: 'Sesi latihan pembuatan storyboard dan digital inking bersama siswa di laboratorium animasi.',
    category: 'kegiatan',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
    size: 3200000,
    created_at: '2026-08-08T10:00:00.000Z'
  },
  {
    id: 'med-04',
    name: 'Juara 1 Lomba Animasi Pendek FLS2N',
    description: 'Dokumentasi penyerahan trofi dan piagam penghargaan kejuaraan animasi tingkat kota.',
    category: 'prestasi',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80',
    size: 2100000,
    created_at: '2026-08-02T16:45:00.000Z'
  }
];


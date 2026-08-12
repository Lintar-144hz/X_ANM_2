import { Student, OrganizationMember, ScheduleItem, ContentItem, SiteSettings } from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  class_name: 'X ANIMASI 2',
  description: 'Komunitas kreatif animator muda SMKN 1 Indonesia. Memadukan seni visual 2D/3D, sinematografi digital, dan passion tanpa batas.',
  hero_title: 'Menciptakan Imajinasi Tanpa Batas',
  hero_subtitle: 'Website Resmi X ANIMASI 2 — Portofolio, Informasi Kelas, Organisasi, dan Jadwal Kegiatan Pembelajaran 2026/2027.',
  hero_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  footer_text: '© 2026 X ANIMASI 2. Designed with Apple-inspired elegance for future animators.'
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-01', name: 'Ahmad Fauzi', attendance_number: 1, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-02', name: 'Alya Nurhafizah', attendance_number: 2, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-03', name: 'Andi Pratama', attendance_number: 3, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-04', name: 'Annisa Putri', attendance_number: 4, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-05', name: 'Bagas Aditya', attendance_number: 5, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-06', name: 'Bunga Rahmawati', attendance_number: 6, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-07', name: 'Dafa Kurniawan', attendance_number: 7, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-08', name: 'Dian Sastro', attendance_number: 8, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-09', name: 'Eko Prasetyo', attendance_number: 9, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-10', name: 'Farah Nabilah', attendance_number: 10, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-11', name: 'Gilang Ramadhan', attendance_number: 11, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-12', name: 'Hana Safira', attendance_number: 12, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-13', name: 'Ibrahim Husein', attendance_number: 13, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-14', name: 'Intan Permata', attendance_number: 14, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-15', name: 'Julian Rizky', attendance_number: 15, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-16', name: 'Kartika Sari', attendance_number: 16, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-17', name: 'Luthfi Hakim', attendance_number: 17, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-18', name: 'Maya Anggraini', attendance_number: 18, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-19', name: 'Naufal Alghifari', attendance_number: 19, gender: 'L', photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { id: 'std-20', name: 'Olivia Zahra', attendance_number: 20, gender: 'P', photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' }
];

export const INITIAL_ORGANIZATION: OrganizationMember[] = [
  { id: 'org-01', position: 'Wali Kelas', student_id: 'std-12', order_index: 1 },
  { id: 'org-02', position: 'Ketua', student_id: 'std-01', order_index: 2 },
  { id: 'org-03', position: 'Wakil Ketua', student_id: 'std-02', order_index: 3 },
  { id: 'org-04', position: 'Sekretaris', student_id: 'std-04', order_index: 4 },
  { id: 'org-05', position: 'Bendahara', student_id: 'std-06', order_index: 5 },
  { id: 'org-06', position: 'Bumas 1', student_id: 'std-03', order_index: 6 },
  { id: 'org-07', position: 'Bumas 2', student_id: 'std-05', order_index: 7 },
  { id: 'org-08', position: 'MPK 1', student_id: 'std-07', order_index: 8 },
  { id: 'org-09', position: 'MPK 2', student_id: 'std-08', order_index: 9 },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // Senin
  { id: 'sch-01', day: 'Senin', student_id: 'std-01', order_index: 1 },
  { id: 'sch-02', day: 'Senin', student_id: 'std-02', order_index: 2 },
  { id: 'sch-03', day: 'Senin', student_id: 'std-03', order_index: 3 },
  { id: 'sch-04', day: 'Senin', student_id: 'std-04', order_index: 4 },
  // Selasa
  { id: 'sch-05', day: 'Selasa', student_id: 'std-05', order_index: 1 },
  { id: 'sch-06', day: 'Selasa', student_id: 'std-06', order_index: 2 },
  { id: 'sch-07', day: 'Selasa', student_id: 'std-07', order_index: 3 },
  { id: 'sch-08', day: 'Selasa', student_id: 'std-08', order_index: 4 },
  // Rabu
  { id: 'sch-09', day: 'Rabu', student_id: 'std-09', order_index: 1 },
  { id: 'sch-10', day: 'Rabu', student_id: 'std-10', order_index: 2 },
  { id: 'sch-11', day: 'Rabu', student_id: 'std-11', order_index: 3 },
  { id: 'sch-12', day: 'Rabu', student_id: 'std-12', order_index: 4 },
  // Kamis
  { id: 'sch-13', day: 'Kamis', student_id: 'std-13', order_index: 1 },
  { id: 'sch-14', day: 'Kamis', student_id: 'std-14', order_index: 2 },
  { id: 'sch-15', day: 'Kamis', student_id: 'std-15', order_index: 3 },
  { id: 'sch-16', day: 'Kamis', student_id: 'std-16', order_index: 4 },
  // Jumat
  { id: 'sch-17', day: 'Jumat', student_id: 'std-17', order_index: 1 },
  { id: 'sch-18', day: 'Jumat', student_id: 'std-18', order_index: 2 },
  { id: 'sch-19', day: 'Jumat', student_id: 'std-19', order_index: 3 },
  { id: 'sch-20', day: 'Jumat', student_id: 'std-20', order_index: 4 },
];

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

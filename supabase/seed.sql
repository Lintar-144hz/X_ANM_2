-- Seed Data for X ANIMASI 2

-- Initial Site Settings
INSERT INTO public.site_settings (id, class_name, description, hero_title, hero_subtitle, hero_image_url, footer_text)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'X ANIMASI 2',
  'Komunitas kreatif animator muda SMKN 1 Indonesia. Memadukan seni visual 2D/3D, sinematografi digital, dan passion tanpa batas.',
  'Menciptakan Imajinasi Tanpa Batas',
  'Website Resmi X ANIMASI 2 — Portofolio, Informasi Kelas, Organisasi, dan Jadwal Kegiatan Pembelajaran 2026/2027.',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  '© 2026 X ANIMASI 2. Designed with Apple-inspired elegance for future animators.'
) ON CONFLICT (id) DO UPDATE SET
  class_name = EXCLUDED.class_name,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle;

-- Initial Students
INSERT INTO public.students (id, name, attendance_number, gender, photo_url) VALUES
('11111111-1111-1111-1111-111111111101', 'Ahmad Fauzi', 1, 'L', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111102', 'Alya Nurhafizah', 2, 'P', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111103', 'Andi Pratama', 3, 'L', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111104', 'Annisa Putri', 4, 'P', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111105', 'Bagas Aditya', 5, 'L', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111106', 'Bunga Rahmawati', 6, 'P', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111107', 'Dafa Kurniawan', 7, 'L', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111108', 'Dian Sastro', 8, 'P', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111109', 'Eko Prasetyo', 9, 'L', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111110', 'Farah Nabilah', 10, 'P', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Initial Organization
INSERT INTO public.organization (id, position, student_id, order_index) VALUES
('22222222-2222-2222-2222-222222222201', 'Wali Kelas', '11111111-1111-1111-1111-111111111110', 1),
('22222222-2222-2222-2222-222222222202', 'Ketua', '11111111-1111-1111-1111-111111111101', 2),
('22222222-2222-2222-2222-222222222203', 'Wakil Ketua', '11111111-1111-1111-1111-111111111102', 3),
('22222222-2222-2222-2222-222222222204', 'Sekretaris', '11111111-1111-1111-1111-111111111104', 4),
('22222222-2222-2222-2222-222222222205', 'Bendahara', '11111111-1111-1111-1111-111111111106', 5)
ON CONFLICT (id) DO NOTHING;

-- Initial Schedules (Piket)
INSERT INTO public.schedules (id, day, student_id, order_index) VALUES
('33333333-3333-3333-3333-333333333301', 'Senin', '11111111-1111-1111-1111-111111111101', 1),
('33333333-3333-3333-3333-333333333302', 'Senin', '11111111-1111-1111-1111-111111111102', 2),
('33333333-3333-3333-3333-333333333303', 'Selasa', '11111111-1111-1111-1111-111111111103', 1),
('33333333-3333-3333-3333-333333333304', 'Selasa', '11111111-1111-1111-1111-111111111104', 2),
('33333333-3333-3333-3333-333333333305', 'Rabu', '11111111-1111-1111-1111-111111111105', 1),
('33333333-3333-3333-3333-333333333306', 'Rabu', '11111111-1111-1111-1111-111111111106', 2)
ON CONFLICT (id) DO NOTHING;

-- Initial Contents
INSERT INTO public.contents (id, title, slug, body, image_url, status, published_at) VALUES
(
  '44444444-4444-4444-4444-444444444401',
  'Pameran Karya Animasi 2D Semester 1',
  'pameran-karya-animasi-2d-semester-1',
  'Seluruh siswa X ANIMASI 2 berhasil menyelesaikan tugas akhir pembuatan short animation 2D menggunakan Blender & Toon Boom. Pameran karya dilaksanakan di Aula Kreatif sekolah pada hari Jumat depan.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'published',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Migration: Initial Schema for X ANIMASI 2
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    attendance_number INT NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('L', 'P')),
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organization Table
CREATE TABLE IF NOT EXISTS public.organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position VARCHAR(100) NOT NULL UNIQUE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Schedules Table (Jadwal Piket)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day VARCHAR(20) NOT NULL CHECK (day IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat')),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contents Table (Pengumuman & Konten)
CREATE TABLE IF NOT EXISTS public.contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    body TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(100) NOT NULL DEFAULT 'X ANIMASI 2',
    description TEXT NOT NULL,
    hero_title VARCHAR(255) NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_image_url TEXT NOT NULL,
    footer_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Read-Only for Anon)
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public read organization" ON public.organization FOR SELECT USING (true);
CREATE POLICY "Allow public read schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Allow public read contents" ON public.contents FOR SELECT USING (true);
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- AUTHENTICATED ADMIN POLICIES (FULL CRUD for Authenticated)
CREATE POLICY "Allow authenticated full access students" ON public.students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access organization" ON public.organization FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access schedules" ON public.schedules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access contents" ON public.contents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ========================================================
-- STORAGE BUCKET CONFIGURATION
-- ========================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('class-media', 'class-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id = 'class-media');
CREATE POLICY "Admin Write Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'class-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Media" ON storage.objects FOR UPDATE USING (bucket_id = 'class-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE USING (bucket_id = 'class-media' AND auth.role() = 'authenticated');

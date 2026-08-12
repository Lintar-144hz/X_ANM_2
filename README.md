# X ANIMASI 2 — Website Resmi & Admin CMS Dashboard

Sistem Informasi Sekolah dan Content Management System (CMS) modern untuk kelas **X ANIMASI 2** berarsitektur monorepo. Dibangun dengan estetik minimalist tech terinspirasi dari Apple (Apple-inspired luxury UI), menggunakan React 19, Vite, TypeScript, Tailwind CSS, Motion, dan Supabase Database + Storage + Auth.

---

## 📐 Project Structure

```
.
├── apps/
│   ├── web/                     # Public Website (Read-only for visitors)
│   │   ├── src/
│   │   │   ├── components/      # Navbar, Footer, SupabaseBanner
│   │   │   ├── pages/           # Home, Organisasi, Siswa, Piket, Konten, KontenDetail
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── .env.example
│   │   ├── vercel.json
│   │   └── package.json
│   └── admin/                   # Admin Dashboard CMS (Protected Auth)
│       ├── src/
│       │   ├── components/      # Sidebar, Header
│       │   ├── pages/           # Login, Dashboard, SiswaAdmin, OrganisasiAdmin, PiketAdmin, KontenAdmin, MediaAdmin, SettingsAdmin
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── .env.example
│       ├── vercel.json
│       └── package.json
├── packages/
│   └── shared/                  # Shared Types, Mock Data, Supabase Client & DataStore
│       └── src/
│           ├── types.ts
│           ├── mockData.ts
│           ├── supabaseClient.ts
│           ├── dataStore.ts
│           └── index.ts
├── supabase/
│   ├── migrations/
│   │   └── 20260812000000_initial_schema.sql # SQL Migration & RLS Policies
│   └── seed.sql                # Initial Seed Data (Students, Org, Schedules, Contents)
├── .env.example                # Root environment template
├── vercel.json                 # Vercel SPA Routing Rewrites
├── package.json
└── README.md
```

---

## ⚡ Key Features & Concepts

1. **SATU Project Supabase & Database yang Sama**:
   - Kedua aplikasi (`apps/web` & `apps/admin`) membaca dan mengelola data dari project Supabase yang sama.
   - Menggunakan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.

2. **PUBLIC WEBSITE (`apps/web`)**:
   - Read-only, tidak ada tombol CRUD atau mutating actions.
   - Halaman: `/`, `/organisasi`, `/siswa`, `/piket`, `/konten`.

3. **ADMIN DASHBOARD CMS (`apps/admin`)**:
   - Protected route menggunakan Supabase Auth (Email & Password).
   - Menu: `/dashboard`, `/siswa`, `/organisasi`, `/piket`, `/konten`, `/media` (`class-media` storage bucket), `/settings`.

4. **Row Level Security (RLS)**:
   - Read-access diizinkan untuk peran `anon` dan `authenticated`.
   - Write/Mutation-access (INSERT, UPDATE, DELETE) hanya diizinkan untuk peran `authenticated`.

---

## 🛠️ Local Development & Installation

### 1. Prasyarat
- Node.js 18+ & npm

### 2. Instalasi Dependencies
```bash
npm install
```

### 3. Menjalankan Aplikasi
```bash
# Menjalankan dual-app runner di Port 3000 (Public & Admin sekaligus)
npm run dev

# Atau menjalankan Public Web saja:
npm run dev:web

# Atau menjalankan Admin CMS saja:
npm run dev:admin
```

---

## 🔑 Environment Variables Setup

Salin `.env.example` ke `.env` pada root, `apps/web/.env`, dan `apps/admin/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Supabase Setup & Migration

1. Buat project baru di [Supabase Cloud](https://supabase.com).
2. Buka **SQL Editor** di Dashboard Supabase Anda.
3. Eksekusi file SQL migration: `supabase/migrations/20260812000000_initial_schema.sql`.
4. Eksekusi file seed data: `supabase/seed.sql`.
5. Buka **Authentication > Users** lalu tambahkan akun admin (e.g. `admin@animasi2.sch.id`).

---

## 🚀 Vercel Deployment Guide

Aplikasi ini siap dideploy sebagai dua projek terpisah di Vercel:

### 1. Public Website Deployment
- **Root Directory**: `apps/web`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 2. Admin Dashboard Deployment
- **Root Directory**: `apps/admin`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

*Konfigurasi `vercel.json` pada masing-masing folder sudah dilengkapi dengan SPA rewrite rules untuk mencegah error 404 saat refresh halaman.*

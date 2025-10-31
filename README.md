# Mirror

Mirror adalah aplikasi teman curhat virtual berbasis AI yang berfokus pada dukungan kesehatan mental Gen Z. Proyek ini memadukan percakapan empatik, deteksi emosi real-time, insight psikologi ilmiah (MBTI, Enneagram, Jungian archetypes), dan eskalasi ke psikolog profesional dalam satu pengalaman terintegrasi.

## Status Terbaru
- Struktur monorepo pnpm + Turborepo dengan workspace `apps/web`, `apps/api`, `services/ai`, dan paket bersama.
- Landing page Next.js bernuansa liquid-glass + emotikon empatik, siap sebagai PWA (next-pwa).
- Halaman pengalaman `/experience` menghadirkan onboarding empatik multi-langkah + simulasi chat Mirror.
- Chat playground sudah terhubung ke LLM OpenAI (`gpt-5.0-nano`) lengkap dengan radar emosi kamera opsional.
- Konfigurasi Capacitor (Android, iOS, Electron) untuk menghasilkan APK dan aplikasi desktop dari bundle Next.
- Dokumentasi build lintas platform: `docs/install-android.md`, `docs/install-desktop.md`, `docs/install-pwa.md`.

## Struktur Direktori
- `apps/web` – Front-end Next.js (App Router, Tailwind v4, Framer Motion, PWA).
- `apps/api` – Kerangka NestJS untuk API utama (profile endpoint in-memory + siap dikembangkan).
- `services/ai` – FastAPI skeleton untuk orkestrasi AI/LLM.
- `packages/ui` & `packages/config` – Paket bersama (design system & konfigurasi).
- `docs/` – Arsitektur, roadmap, backlog, install guide lintas platform.

## Perintah Penting
```bash
pnpm install                # install seluruh workspace
pnpm dev:web                # jalankan web (Next dev server)
pnpm run build:web          # build + export ke apps/web/out
pnpm run build:android      # build web + sync ke proyek Android (setelah cap add android)
pnpm run build:desktop      # build web + sync ke shell Electron
pnpm run build:ios          # build web + sync ke proyek iOS
```

> `pnpm exec cap add android|ios|@capacitor-community/electron` perlu dijalankan sekali sebelum script build lintas platform.

## Environment Variables
- Duplikasi `.env.example` menjadi `.env.local` lalu isi `OPENAI_API_KEY` dengan kunci OpenAI project kamu.
- Saat deploy, set variable yang sama pada Vercel Project Settings.

## Development
```bash
pnpm dev:web                     # http://localhost:3000
API_PORT=3001 pnpm dev:api       # http://localhost:3001 (atau set di .env.local)
```

API sementara:
- `POST /v1/profiles` – simpan hasil onboarding (disimpan in-memory).
- `GET /v1/profiles/:id` – ambil profil yang tersimpan.

## Deploy ke Vercel
1. Pastikan sudah login Vercel: `npm i -g vercel` lalu `vercel login` (sekali).
2. Hubungkan repo GitHub ini ke project Vercel dan set **Root Directory** = `apps/web`.
3. Konfigurasi yang dipakai Vercel:
   - Install Command: `pnpm install --frozen-lockfile`
   - Build Command: `pnpm -w run build:web`
   - Output Directory: `out`
4. Setelah pengaturan disimpan, setiap push ke `main` akan otomatis men-trigger deploy. Untuk deploy manual dari CLI:
   ```bash
   pnpm run build:web
   npx vercel deploy --prebuilt
   ```

## Next Steps
1. Persistenkan data onboarding & percakapan ke storage (Postgres) melalui NestJS + tambah autentikasi dasar.
2. Rancang modul jurnal mood + kalender insight yang sinkron dengan deteksi kamera.
3. Tambahkan guardrail/ moderation layer (OpenAI safety + rules) dan logging audit.
4. Siapkan paket design system reusable + lint/test/CI lintas workspace.

## Referensi Konsep
Dokumen lengkap visi produk tersedia di `docs/mirror-concept.txt`, dengan ringkasan arsitektur pada `docs/architecture.md`, roadmap di `docs/roadmap.md`, dan backlog MVP di `docs/backlog-mvp.md`.

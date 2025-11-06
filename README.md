# Mirror

Mirror adalah aplikasi teman curhat virtual berbasis AI yang berfokus pada dukungan kesehatan mental Gen Z. Proyek ini memadukan percakapan empatik, deteksi emosi real-time, insight psikologi ilmiah (MBTI, Enneagram, Jungian archetypes), dan eskalasi ke psikolog profesional dalam satu pengalaman terintegrasi.

## Status Terbaru
- Struktur monorepo pnpm + Turborepo dengan workspace `apps/web`, `apps/api`, `services/ai`, dan paket bersama.
- Landing page Next.js bernuansa liquid-glass + emotikon empatik, siap sebagai PWA (next-pwa).
- Halaman pengalaman `/experience` menghadirkan onboarding empatik multi-langkah + simulasi chat Mirror.
- Onboarding kini mencatat vibe kepribadian (MBTI, Enneagram, archetype, mood baseline, zodiak) untuk mempersonalisasi percakapan dan prompt AI.
- Chat playground sudah terhubung ke LLM OpenAI (`gpt-5.0-nano`). Radar emosi sementara berupa preview kamera manual (deteksi otomatis akan hadir kemudian).
- Mini mood journal tersinkron ke backend (manual & auto capture kamera) untuk mencatat suasana hati setelah sesi chat.
- Mood Insight `/insights` siap memvisualisasikan kalender mood 21 hari, statistik cepat, dan rekomendasi self-care adaptif.
- Halaman pricing `/subscribe` dengan flow checkout mock + endpoint `POST /v1/payments/checkout-session` untuk simulasi gateway.
- Konfigurasi Capacitor (Android, iOS, Electron) untuk menghasilkan APK dan aplikasi desktop dari bundle Next.
- Dokumentasi build lintas platform: `docs/install-android.md`, `docs/install-desktop.md`, `docs/install-ios.md`, `docs/install-pwa.md`.

## Struktur Direktori
- `apps/web` – Front-end Next.js (App Router, Tailwind v4, Framer Motion, PWA).
- `apps/api` – Kerangka NestJS untuk API utama (auth berbasis kode + profile endpoint in-memory + siap dikembangkan).
- `services/ai` – FastAPI skeleton untuk orkestrasi AI/LLM.
- `packages/ui` & `packages/config` – Paket bersama (design system & konfigurasi).
- `docs/` – Arsitektur, roadmap, backlog, monetisasi (`docs/monetization.md`), branding kit (`docs/branding-kit/`), panduan onboarding premium (`docs/premium-onboarding.md`), observability (`docs/observability.md`), incident response (`docs/incident-response.md`), install guide lintas platform.

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
- Duplikasi `.env.example` menjadi `.env.local` lalu isi:
  - `OPENAI_API_KEY` – OpenAI project key.
  - `API_PORT` (opsional) – port untuk NestJS lokal.
- `NEXT_PUBLIC_MIRROR_API_URL` – base URL API (contoh: `http://localhost:3001/v1`).
- `AUTH_SHARED_SECRET` – kode akses beta (diserahkan ke pengguna).
- `AUTH_JWT_SECRET` – secret key untuk menandatangani JWT sederhana.
- `PAYMENTS_PROVIDER` – `mock` (default) atau `midtrans`.
- `MIDTRANS_SERVER_KEY` & `MIDTRANS_BASE_URL` – diisi ketika integrasi Midtrans aktif (opsional).
- `PAYMENTS_ADMIN_SECRET` – secret untuk menandai sesi sebagai `paid` ketika memakai provider non-mock.
- `MIDTRANS_DEFAULT_AMOUNT` – fallback gross amount (untuk testing sandbox) bila plan belum punya harga final.
- `NEXT_PUBLIC_SENTRY_DSN` – optional DSN untuk mencatat error front-end dan tracing.
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE` – konfigurasi sampling Sentry (default 0.1 / 0 / 0).
- `SENTRY_DSN` – optional DSN untuk mencatat error backend (NestJS) bila Sentry server-side diaktifkan.
- `SENTRY_TRACES_SAMPLE_RATE` – optional sampling rate trace backend (default 0.1).
- Saat deploy, set variabel yang sama di Vercel / platform yang kamu pakai.

## Development
```bash
pnpm dev:web                     # http://localhost:3000
API_PORT=3001 pnpm dev:api       # http://localhost:3001 (atau set di .env.local)
```

### Continuous Integration
- Workflow GitHub Actions `CI` menjalankan `pnpm install`, `pnpm --filter api test`, `pnpm --filter api build`, `pnpm --filter web lint`, dan `pnpm --filter web build` setiap push atau pull request ke `main`.

API sementara:
- `POST /v1/auth/login` – login kode akses beta, menghasilkan JWT sederhana.
- `POST /v1/profiles` – simpan hasil onboarding (butuh Bearer token).
- `PUT /v1/profiles/:id` – update profil (butuh Bearer token).
- `GET /v1/profiles/:id` – ambil profil yang tersimpan (termasuk mood entries terbaru).
- `POST /v1/profiles/:id/mood-entries` & `GET /v1/profiles/:id/mood-entries` – CRUD mood journal.
- `GET /v1/payments/plans` – daftar paket langganan (mock).
- `POST /v1/payments/checkout-session` – buat sesi checkout dummy untuk uji flow.
- `GET /v1/payments/sessions` – riwayat pembayaran mock (disimpan di Prisma).
- `POST /v1/payments/sessions/:id/mark-paid` – helper untuk menandai sesi sebagai paid saat testing.
- Endpoint Next.js `/api/mirror-chat` (AI playground) tetap tanpa auth untuk saat ini.
- `GET /v1/health` – health check sederhana (status + timestamp).

### Database & Prisma
- Prisma mengarah ke Postgres melalui `DATABASE_URL` (contoh: `postgresql://postgres:postgres@localhost:5432/mirror?schema=public`).
- Inisialisasi DB:
  ```bash
  cd apps/api
  npx prisma migrate deploy        # atau gunakan migrate dev jika DB lokal siap
  npx prisma generate
  ```
- Jika belum punya Postgres lokal, jalankan contoh Docker: `docker run --name mirror-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`.

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
1. Tingkatkan autentikasi (multi-user OAuth) + persist percakapan dan peran psikolog di DB.
2. Rancang insight mingguan otomatis & kalender mood, serta integrasi deteksi emosi sebenarnya.
3. Tambahkan guardrail lanjutan (policy engine, audit logging, escalation flow) di backend & UI.
4. Siapkan paket design system reusable + lint/test/CI lintas workspace.

## Referensi Konsep
Dokumen lengkap visi produk tersedia di `docs/mirror-concept.txt`, dengan ringkasan arsitektur pada `docs/architecture.md`, roadmap di `docs/roadmap.md`, dan backlog MVP di `docs/backlog-mvp.md`.

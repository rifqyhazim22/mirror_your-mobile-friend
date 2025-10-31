# Mirror

Mirror adalah aplikasi teman curhat virtual berbasis AI yang berfokus pada dukungan kesehatan mental Gen Z. Proyek ini memadukan percakapan empatik, deteksi emosi real-time, insight psikologi ilmiah (MBTI, Enneagram, Jungian archetypes), dan eskalasi ke psikolog profesional dalam satu pengalaman terintegrasi.

## Status Terbaru
- Struktur monorepo pnpm + Turborepo dengan workspace `apps/web`, `apps/api`, `services/ai`, dan paket bersama.
- Landing page Next.js bernuansa liquid-glass + emotikon empatik, siap sebagai PWA (next-pwa).
- Konfigurasi Capacitor (Android, iOS, Electron) untuk menghasilkan APK dan aplikasi desktop dari bundle Next.
- Dokumentasi build lintas platform: `docs/install-android.md`, `docs/install-desktop.md`, `docs/install-pwa.md`.

## Struktur Direktori
- `apps/web` – Front-end Next.js (App Router, Tailwind v4, Framer Motion, PWA).
- `apps/api` – Kerangka NestJS untuk API utama (masih boilerplate).
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

## Next Steps
1. Implementasi modul chat AI + integrasi kamera/on-device emotion detection.
2. Penyatuan backend NestJS dan layanan AI FastAPI (auth, guardrails, journaling).
3. Menyusun sistem desain komponen (packages/ui) + dark/light + mood-based theming.
4. Menambahkan linting/formatting lintas workspace dan workflow CI.

## Referensi Konsep
Dokumen lengkap visi produk tersedia di `docs/mirror-concept.txt`, dengan ringkasan arsitektur pada `docs/architecture.md`, roadmap di `docs/roadmap.md`, dan backlog MVP di `docs/backlog-mvp.md`.

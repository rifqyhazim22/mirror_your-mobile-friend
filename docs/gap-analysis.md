# Gap Implementasi vs. Pendoman Mirror

Ringkasan item penting dari dokumen "Konsep Aplikasi Web Mirror – Teman Curhat AI Personal (2025)" yang **belum** terealisasi pada fase repositori saat ini.

## Fitur Produk
- Chatbot AI empatik (mode bebas & CBT) belum diintegrasikan – halaman saat ini masih landing page statis.
- Deteksi emosi wajah real-time (TensorFlow.js / face-api.js) belum diimplementasi.
- Profil kepribadian (MBTI, Enneagram, Jungian archetype, zodiak) belum memiliki UI maupun logika kuis.
- Jurnal mood harian, kalender mood, serta insight mingguan belum tersedia.
- Avatar AI adaptif & feedback emotif (emoji avatar) masih konsep.
- Integrasi psikolog profesional (booking, live chat/video call, treatment plan) belum dimulai.
- Fitur emergency/panic button dan protokol escalasi belum dibuat.
- Community/forum terkurasi dan konten interaktif (meditasi, mini-game coping) belum ada.

## Teknologi & Infrastruktur
- Backend NestJS masih boilerplate tanpa modul (Auth, Chat, Journal, Emotion, Notifications, Psychologist).
- Layanan AI FastAPI belum memiliki endpoint LLM, guardrails, sentiment analysis, atau task Celery.
- Database (Postgres, Mongo, Redis) dan Prisma schema belum disiapkan.
- Observability (OpenTelemetry, Sentry, log structured) belum dikonfigurasi.
- CI/CD (GitHub Actions), linting lintas workspace, dan pengaturan secrets belum ada.
- Compliance & privacy guard (consent versioning, data deletion pipeline) belum diimplementasi.

## UX & Konten
- Onboarding empatik & kuis interaktif belum ada (baru CTA di landing).
- Dashboard personalisasi, mood board, adaptive persona, dan modul konten psikologi belum dibuat.
- Bahasa & tone sudah empatik, namun guideline internal (no-judgement, safety prompts) belum terkodekan.
- Liquid-glass style hanya diterapkan di landing page; design system (packages/ui) belum diisi komponen reusable.

## Distribusi & Monetisasi
- Script build lintas platform sudah disiapkan, tetapi belum diuji karena platform `cap add` belum dijalankan.
- Payment flow, subscription logic, dan model monetisasi premium belum dibuat.
- Dokumentasi pemasaran (branding kit, konten kampanye) belum ada.

## Langkah Lanjut Prioritas
1. Validasi UX lanjutan → implementasi onboarding empatik + prototipe chat statis.
2. Setup backend dasar (auth, user profile, consent) + koneksi database.
3. Integrasi AI service placeholder (mocked LLM) dan pipeline deteksi emosi sederhana.
4. Penguatan keamanan (env management, lint/test pipelines, GDPR/PDP compliance draft).

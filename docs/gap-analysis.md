# Gap Implementasi vs. Pendoman Mirror

Ringkasan item penting dari dokumen "Konsep Aplikasi Web Mirror – Teman Curhat AI Personal (2025)" yang **belum** terealisasi pada fase repositori saat ini.

## Fitur Produk
- Chatbot AI empatik penuh (dengan flow CBT & sesi terstruktur) masih belum ada – versi kini memakai LLM umum + prompt empatik tanpa orchestrator kompleks.
- Deteksi emosi wajah real-time belum diimplementasi (preview kamera manual sementara).
- Profil kepribadian (MBTI, Enneagram, Jungian archetype, zodiak) belum memiliki UI maupun logika kuis.
- Jurnal mood harian & insight mingguan baru sebatas mood journal manual lokal.
- Avatar AI adaptif & feedback emotif (emoji avatar) masih konsep.
- Integrasi psikolog profesional (booking, live chat/video call, treatment plan) belum dimulai.
- Fitur emergency/panic button dan protokol escalasi belum dibuat.
- Community/forum terkurasi dan konten interaktif (meditasi, mini-game coping) belum ada.

## Teknologi & Infrastruktur
- Backend NestJS baru memiliki modul profil in-memory; auth/chat/journal/emotion, dsb. masih kosong.
- Guardrails awal menggunakan moderation OpenAI di Next.js; belum ada lapisan backend tersentral atau logging audit.
- Layanan AI FastAPI belum memiliki endpoint LLM, guardrails, sentiment analysis, atau task Celery.
- Database (Postgres, Mongo, Redis) dan Prisma schema belum disiapkan.
- Observability (OpenTelemetry, Sentry, log structured) belum dikonfigurasi.
- CI/CD (GitHub Actions), linting lintas workspace, dan pengaturan secrets belum ada.
- Compliance & privacy guard (consent versioning, data deletion pipeline) belum diimplementasi.

## UX & Konten
- Onboarding empatik multi-langkah sudah ada di `/experience`, namun belum terhubung ke AI/analitik sesungguhnya.
- Dashboard personalisasi, mood board, adaptive persona, dan modul konten psikologi belum dibuat.
- Bahasa & tone sudah empatik, namun guideline internal (no-judgement, safety prompts) belum terkodekan.
- Liquid-glass style hanya diterapkan di landing page; design system (packages/ui) belum diisi komponen reusable.

## Distribusi & Monetisasi
- Script build lintas platform sudah disiapkan, tetapi belum diuji karena platform `cap add` belum dijalankan.
- Payment flow, subscription logic, dan model monetisasi premium belum dibuat.
- Dokumentasi pemasaran (branding kit, konten kampanye) belum ada.

## Langkah Lanjut Prioritas
1. Persistenkan profil & percakapan ke storage nyata (Postgres) + tambahkan autentikasi dasar.
2. Kembangkan modul jurnal/emotion di backend serta insight mingguan otomatis.
3. Tambahkan guardrails lanjutan (policy engine, logging, human-in-the-loop) dan integrasi deteksi emosi sebenarnya.
4. Penguatan keamanan (env management, lint/test pipelines, GDPR/PDP compliance draft).

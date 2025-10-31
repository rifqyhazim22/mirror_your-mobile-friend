# Backlog MVP Mirror

Backlog berikut mengelompokkan pekerjaan MVP (Fase 1) menjadi _epic_ dan _user story_ operasional. Setiap story mencakup outcome, dependensi, dan indikator siap diuji.

## Epic A – Fondasi Teknis & Keamanan
- **A1. Setup Monorepo & Tooling**
  - Outcome: Monorepo TurboRepo dengan workspace `apps/web`, `apps/api`, `services/ai`, `packages/*`.
  - Dependensi: Keputusan manajer paket (PNPM), konfigurasi lint/test.
  - Selesai bila: CI berjalan (lint, test dummy), _commit hooks_ aktif.
- **A2. Infrastruktur Auth & Consent**
  - Outcome: Next Auth (OAuth Google/Apple + email/password), JWT mesin backend, consent versioning.
  - Dependensi: PostgreSQL skema awal.
  - Selesai bila: Pengguna bisa registrasi, login, mengubah consent toggle.
- **A3. Baseline Security**
  - Outcome: Secret management (env per environment), rate limiting gateway, audit logging minim.
  - Dependensi: Deployment environment staging.
  - Selesai bila: Uji penetrasi dasar lulus, >80% endpoints terlindungi guard auth.

## Epic B – Pengalaman Onboarding Empatik
- **B1. Flow Registrasi Gen Z**
  - Outcome: UI onboarding (sapaan avatar, pengambilan nama panggilan, preferensi).
  - Dependensi: Design system, avatar assets.
  - Selesai bila: Usability test (5 pengguna) menunjukkan >80% memahami alur.
- **B2. Tes MBTI & Enneagram Singkat**
  - Outcome: Kuis interaktif, scoring, penyimpanan hasil, penjelasan tipe.
  - Dependensi: Konten psikologi terkurasi.
  - Selesai bila: Hasil tersimpan ke profil, insight tampil di dashboard.
- **B3. Consent Kamera & Privasi**
  - Outcome: Dialog izin kamera, edukasi privasi, toggle emosi per sesi.
  - Dependensi: Modul detection siap.
  - Selesai bila: Pengguna dapat menonaktifkan kamera kapan pun, state tercermin di backend.

## Epic C – Chat AI Empatik
- **C1. Workspace Chat**
  - Outcome: Tampilan chat mirip messenger, status mengetik, avatar AI adaptif.
  - Dependensi: Design system, store state.
  - Selesai bila: Percakapan dummy flow berfungsi offline (mock).
- **C2. Orkestrasi LLM**
  - Outcome: Gateway API -> service AI -> LLM -> response guard -> persist log.
  - Dependensi: Secret LLM, guardrails policy.
  - Selesai bila: >50 skenario test lintas emosi lolos, output tersimpan.
- **C3. Guardrails & Moderasi**
  - Outcome: Filtering konten SARA/bunuh diri, fallback ke human prompt.
  - Dependensi: Integration OpenAI Moderation / custom classifier.
  - Selesai bila: Semua test red-team (kata berbahaya) memicu protocol aman.

## Epic D – Deteksi Emosi & Jurnal Mood
- **D1. Detector Wajah On-Device**
  - Outcome: Face detection + expression classification (7 label) berjalan ≥15 FPS.
  - Dependensi: face-api.js model bundling, permission kamera.
  - Selesai bila: Benchmark di 3 laptop & 3 ponsel >80% akurasi dataset uji.
- **D2. Sinkronisasi Mood**
  - Outcome: Hasil emosi dikirim ke backend, disimpan, divisualisasi.
  - Dependensi: API emotion, charting library (Recharts/Victory).
  - Selesai bila: Dashboard menampilkan kalender mood interaktif.
- **D3. Insight Harian**
  - Outcome: Job harian menyusun ringkasan mood + affirmations.
  - Dependensi: Service AI, template NLP.
  - Selesai bila: User menerima ringkasan via notifikasi + halaman insight.

## Epic E – Dashboard & Konten
- **E1. Beranda Personalisasi**
  - Outcome: Greeting adaptif, shortcut, progress ring.
  - Dependensi: Data mood, scheduler.
  - Selesai bila: Data real user muncul stabil pada staging.
- **E2. Modul Konten**
  - Outcome: Kartu konten (artikel, latihan) dengan tag, filter.
  - Dependensi: Konten editorial, CMS headless (Contentful/Sanity) atau JSON seed.
  - Selesai bila: Minimal 10 konten tayang dan dapat direkomendasikan.
- **E3. Feedback Loop**
  - Outcome: Reaction/emoji pada respon AI, rating per sesi.
  - Dependensi: Update data model chat.
  - Selesai bila: Feedback tersimpan, dapat dianalisis (dashboard internal).

## Epic F – Observability & Compliance
- **F1. Logging & Monitoring**
  - Outcome: Sentry integrasi, log struktur (request, response, emosi).
  - Dependensi: Deployment staging.
  - Selesai bila: Alert real-time untuk error kritis aktif.
- **F2. Data Lifecycle**
  - Outcome: API export data user, hapus akun total, retensi data 12 bulan.
  - Dependensi: Struktur database final.
  - Selesai bila: QA berhasil menghapus akun dan memverifikasi data hilang.
- **F3. Dokumentasi & SOP**
  - Outcome: Panduan incident response, playbook emergency, manual psikolog.
  - Dependensi: Input tim legal & psikologi.
  - Selesai bila: Dokumen ditandatangani pemangku kepentingan.

Backlog akan diperinci dalam papan kanban (_tracking tool_ TBD). Tiap cerita wajib memiliki kriteria uji, rencana keamanan, dan standar aksesibilitas (WCAG 2.2 AA) sebelum dianggap siap rilis.

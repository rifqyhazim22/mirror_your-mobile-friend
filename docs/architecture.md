# Arsitektur Teknis Mirror

Dokumen ini merumuskan arsitektur awal untuk merealisasikan visi pada _Konsep Aplikasi Web Mirror – Teman Curhat AI Personal (2025)_. Fokusnya adalah MVP (6 bulan pertama) dengan roadmap ke pengembangan lanjutan (6-12 bulan berikutnya).

## Gambaran Umum Sistem
- **Pengguna** berinteraksi via aplikasi web progresif (Next.js) yang menjalankan modul deteksi emosi lokal dan mengelola sesi curhat.
- **API Gateway & Orkestrasi** (NestJS) menangani otentikasi, manajemen profil, penyimpanan data, orkestrasi percakapan dengan LLM, serta integrasi layanan psikolog.
- **Layanan AI** terpisah menangani tugas berat: penyesuaian prompt, pemantauan keamanan percakapan, pemrosesan offline atas data (analisis sentimen, personality insight lanjutan), dan _guardrails_.
- **Fasilitas Penyimpanan Data** menggunakan PostgreSQL (data terstruktur), MongoDB (log chat), Redis (session/cache), serta penyimpanan objek (S3 kompatibel) untuk lampiran atau model lokal.
- **Integrasi Eksternal** meliputi penyedia LLM (mis. OpenAI GPT-4o via Azure), API emosi wajah opsional (fallback cloud), layanan email/push, dan mitra psikolog (jadwal & pembayaran).

## Ruang Lingkup
- **MVP (0-6 bulan)**: Onboarding empatik, chat AI teks, deteksi emosi wajah dasar on-device, profil MBTI & Enneagram, jurnal mood, penyimpanan aman, pelaporan ringkas, notifikasi dasar.
- **Pengembangan Lanjutan (6-12 bulan)**: Mode suara/video, ekspresi multimodal lanjut, adaptasi persona dinamis, rekomendasi konten interaktif, integrasi video konseling, komunitas terkurasi, treatment plan kolaboratif.
- **Di luar cakupan awal**: Wearable integration, aplikasi native penuh, AR lanjutan, monetisasi lanjutan, komunitas terbuka skala besar.

## Arsitektur Logis
- **Client Apps**
  - Next.js 14 (App Router, TypeScript) sebagai PWA responsif.
  - Tailwind CSS + CSS Variables untuk tema, Framer Motion untuk animasi mikro, Zustand + React Query untuk manajemen state.
  - Modul deteksi emosi lokal akan memakai model ringan; versi saat ini menyediakan preview kamera manual sambil menunggu integrasi final.
  - WebRTC untuk akses kamera, Web Workers untuk inferensi non-blocking, Service Worker untuk mode offline terbatas & notifikasi push.
  - Halaman `/experience` menggabungkan onboarding empatik dan chat playground yang memanggil API internal `/api/mirror-chat` serta opsi kamera preview.
  - Packaging lintas platform: Capacitor (Android/iOS) & `@capacitor-community/electron` untuk desktop shell dari bundle Next.js `apps/web/out`.
- **API Gateway (apps/api)**
  - NestJS (TypeScript) + Fastify adapter, modul modular (Auth, User, Profile, Chat, Journal, Emotion, Psychologist, Notifications, Admin).
  - GraphQL (Apollo) untuk query kompleks front-end + REST minimal untuk webhook/push.
  - Socket.IO adapter untuk event real-time (status psikolog, progress respon AI).
  - Prisma ORM untuk PostgreSQL, Mongoose atau Prisma Mongo untuk log chat.
  - Modul Auth sementara: login berbasis kode akses beta → JWT sederhana untuk melindungi endpoint profil.
  - Modul `ProfilesModule` (sementara in-memory) menerima data onboarding dari Next.js.
- **AI Orchestration (services/ai)**
  - FastAPI (Python) microservice menjalankan pipeline NLP & analitik:
    - Guardrails (OpenAI Moderation, custom RAG rules).
    - Prompt templating / persona injection.
    - Sentiment & topic classification (HuggingFace transformers).
    - Personality profiling dari teks jangka panjang (batch jobs).
  - Celery + Redis sebagai task queue untuk job asinkron (analitik mingguan, laporan jurnal).
  - Model storage lokal (HuggingFace Hub caching) dengan opsi GPU container terpisah.
- **Data Layer**
  - PostgreSQL: pengguna, preferensi, hasil tes, jadwal, subscription, audit trail.
  - MongoDB: log percakapan, snapshot mood, feedback AI (dokumen tidak terstruktur).
  - Redis: access token, session WebSocket, rate limiting, feature flag.
  - S3-compatible: bukti identitas psikolog, catatan audio (jika diizinkan), export data user.
  - LangChain Vector Store (PostgreSQL pgvector atau Pinecone) untuk retrieval konten psikologi & journaling.
- **Integrasi Eksternal**
  - LLM provider (Azure OpenAI GPT-4o) + fallback open-source (LLaMA 3) via Ollama + guardrails. Prototipe terbaru memakai langsung OpenAI Responses API (`gpt-4.1-mini`).
  - Payment gateway (Midtrans/Xendit) untuk sesi psikolog berbayar.
  - Notifikasi: Firebase Cloud Messaging untuk push, Resend/Sendgrid untuk email.
  - Kalender psikolog: integrasi Cal.com / Google Calendar API untuk sinkronisasi jadwal.

## Modul Fungsional Utama
- **Auth & Identitas**: Auth.js (Next Auth) + NestJS JWT, dukungan OAuth (Google/Apple). MFA opsional. Consent management explicit, versioned.
- **Profil Kepribadian**: Tes MBTI/Enneagram rule-based di frontend, simpan skor di backend. Pipeline analisis teks menambah confidence score, dapat direvisi dengan konfirmasi user.
- **Chat AI**:
  - Frontend chat workspace dengan thread, reaction, timestamp.
  - API Gateway menerima pesan, call service AI untuk LLM response, sematkan metadata (deteksi emosi, sentiment).
  - Guardrails awal: moderation OpenAI + instruksi safety; pencatatan percakapan akan diperluas bersamaan dengan storage backend.
- **Emotion Pipeline**:
  - Client inferensi -> kirim ringkasan (label, confidence) + optional frame hash ke backend.
  - Backend verifikasi rate limit, simpan di tabel `emotion_readings`.
  - Jika client tidak mampu, API dapat memproses gambar via MorphCast SDK (opsional) dengan consent khusus.
- **Jurnal & Insight**: Cron harian bertanya kabar, data disajikan di dashboard (kalender mood, insight mingguan). Microservice AI menyusun ringkasan.
  - Versi saat ini menyediakan mood journal lokal langsung di chat sebagai langkah awal.
- **Psikolog Network**: CRUD direktori, booking engine, WebRTC room provisioning, catatan terapi, treatment plan, rating sistem.
- **Emergency Flow**: Keyword detection, escalate to human (on-call psychologist), push hotline, optional notify trusted contact.

## Keamanan & Privasi
- Zero-trust default, seluruh komunikasi HTTPS + TLS 1.3.
- Data sensitif terenkripsi di rest (PostgreSQL TDE, field-level encryption untuk chat).
- Consent granular: emosi via kamera, share data ke psikolog, data export.
- Right to be forgotten: job yang menghapus profil, chat, emosi, log.
- Logging terpisah tanpa konten sensitif (hash, anonymized metrics).
- Penegakan RBAC/ABAC: role `user`, `psychologist`, `admin`, `safety`.
- Independen security review, compliance path (PDP Indonesia, GDPR-ready, HIPAA-inspired).

## Observability & DevOps
- Monorepo (TurboRepo) untuk koordinasi apps & services, PNPM sebagai package manager utama.
- CI/CD GitHub Actions: lint, unit test, build container, deploy ke staging.
- IaC dengan Terraform untuk provisioning (Postgres, Redis, S3, K8s).
- Deployment di Kubernetes (GKE/AKS) dengan namespace terpisah (staging, prod). Emotion inference service bisa dijalankan di node GPU.
- Monitoring: OpenTelemetry + Grafana Tempo/Prometheus, Sentry untuk error tracking frontend/backend.
- Feature flag & experiment (LaunchDarkly/Self-hosted Unleash) untuk uji coba UI/fitur psikolog.

## Rencana Evolusi
- **Short-term**: rampungkan modul chat, emosi, onboarding; siapkan manual review untuk guarding AI; latih tim psikolog memakai dashboard.
- **Mid-term**: tambahkan voice chat dengan analisis tonasi, persona adaptif realtime, integrasi treatment plans & payment automation.
- **Long-term**: komunitas terkurasi, AR mini experiences, integrasi wearable, AI coach khusus (sleep, breathing), model multimodal lokal.

Dokumen ini menjadi referensi utama bagi tim engineering. Penyesuaian dapat dilakukan melalui RFC jika terjadi perubahan asumsi produk atau teknologi.

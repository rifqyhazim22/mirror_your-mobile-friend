# Roadmap Pengembangan Mirror

Roadmap ini menerjemahkan visi produk Mirror menjadi rencana kerja 12 bulan pertama. Timeline bersifat indikatif dan akan disesuaikan dengan hasil riset pengguna, kapasitas tim, dan regulasi yang berlaku.

## Prinsip Eksekusi
- Fokus MVP: kirim nilai utama (chat AI empatik + deteksi emosi + insight psikologi) dalam 6 bulan pertama.
- Validasi bertahap: setiap fase menghasilkan _release_ teruji yang dapat diumpan balikkan ke pengguna Gen Z target.
- Privasi sejak awal (_privacy by design_) dan _guardrails_ AI bukan tambahan, melainkan komponen inti di tiap fase.

## Fase 0 – Fondasi & Discovery (Minggu 1-4)
- Deliverables
  - Dokumen produk lengkap: persona pengguna, _journey map_, detail fitur MVP.
  - High-fidelity UI kit + design system (dark/light, animasi dasar).
  - Rencana data & privasi, kebijakan consent versi 0.1.
  - Setup monorepo, CI/CD dasar, kualitas kode (eslint, prettier, husky).
- Aktivitas Kunci
  - Riset pengguna: wawancara Gen Z, validasi problem & willingness to use.
  - Penentuan penyedia LLM, storage, payment, dan kerangka legal psikolog.
  - Proof of Concept: deteksi emosi on-device (face-api.js) dan percakapan LLM dengan guardrails.

## Fase 1 – MVP Core (Minggu 5-16)
- Deliverables
  - Onboarding empatik (profil, MBTI, Enneagram, consent).
  - Chatbot AI teks 24/7 dengan tone empatik + guardrails moderasi.
  - Deteksi emosi wajah real-time + visualisasi mood harian.
  - Dashboard pengguna (mood timeline, insight kepribadian dasar).
  - API backend siap produksi (auth, user, chat, emotion, journal).
  - Observability dasar (metrics, logging, alerting).
- Aktivitas Kunci
  - Fine-tuning prompt & template persona AI.
  - Implementasi penyimpanan terenkripsi dan proses hapus data.
  - Uji kegunaan (usability test) dengan kelompok kecil.

## Fase 2 – Beta Terbatas & Insight Mendalam (Minggu 17-28)
- Deliverables
  - Rilis beta ke 100-300 pengguna internal/komunitas.
  - Insight mingguan (ringkasan AI, rekomendasi konten, refleksi).
  - Sistem feedback pengguna dan rating respon AI.
  - Penyesuaian persona adaptif berdasarkan mood baseline.
  - Integrasi konten psikologi (artikel/video) dengan rekomendasi awal.
- Aktivitas Kunci
  - Monitoring intensif: retensi, kepuasan, false positive/negative emosi.
  - Iterasi desain UI/UX berdasar data beta.
  - Penyusunan materi edukasi privasi & digital wellbeing.

## Fase 3 – Integrasi Psikolog & Monetisasi Awal (Minggu 29-40)
- Deliverables
  - Direktori psikolog + profil terkurasi.
  - Booking engine (chat & video) + kalender sinkron.
  - Payment flow untuk sesi psikolog (e-wallet + kartu).
  - Treatment plan digital (checklist, reminder).
  - Protokol darurat (panic button, hotline, eskalasi ke manusia).
- Aktivitas Kunci
  - Rekrut & onboarding psikolog mitra, training penggunaan dashboard.
  - Uji keamanan tambahan (penetration test, audit privasi).
  - Kampanye _co-marketing_ kecil untuk pengguna awal berbayar.

## Fase 4 – Ekspansi Fitur Lanjutan (Minggu 41-52)
- Deliverables
  - Voice chat + analisis tonasi + TTS respons empatik.
  - Emotion recognition lanjutan (micro-expressions, stress indicator).
  - Community terbatas/moderasi ketat (grup dukungan anonim).
  - Mini-experiences (latihan napas, meditasi interaktif, AR ringan).
  - Data export mandiri + self-service delete.
- Aktivitas Kunci
  - Penelitian guardrails baru untuk voice.
  - Program _ambassador_ komunitas + moderator.
  - Evaluasi kepatuhan regulasi (PDP Indonesia, GDPR readiness).

## Milestone & KPI Awal
- **MVP Launch** (akhir Fase 1): ≥50 pengguna aktif, NPS ≥ 30, percakapan AI > 70% dinilai membantu.
- **Beta Evaluation** (akhir Fase 2): Retensi minggu-4 ≥ 40%, >80% pengguna merasa data aman.
- **Psychologist Go-Live** (akhir Fase 3): 10+ psikolog aktif, ≥30 sesi sukses, rating psikolog ≥4.5/5.
- **Year-End Review** (akhir Fase 4): 1.000 MAU, konversi premium ≥ 5%, _safety incident_ nihil.

## Risiko & Mitigasi
- **Keamanan Data** – Terapkan enkripsi sejak awal, audit berkala, _incident response playbook_.
- **Reliabilitas AI** – Guardrails ketat, _human-in-the-loop_, log evaluasi respon harian.
- **Adopsi Pengguna** – Libatkan komunitas Gen Z, UX testing konstan, konten edukasi menarik.
- **Psikolog Supply** – Mulai kemitraan dini, tawarkan dashboard bernilai, struktur bagi hasil jelas.
- **Regulasi** – Konsultasi legal berkala, dokumentasi consent, sistem anonymization untuk analitik.

Roadmap ini menjadi pegangan lintas tim. Perubahan signifikan harus melalui review lintas fungsi (produk, teknologi, legal, etika) untuk memastikan visi Mirror tetap konsisten dengan misi kesejahteraan mental pengguna.

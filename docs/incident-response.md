# Incident Response Playbook (Draft)

## Tujuan
Menangani insiden keamanan/privasi pada layanan Mirror dengan cepat, transparan, dan mengurangi dampak ke pengguna.

## Tim & Kontak
- Incident Commander: Head of Engineering (incident@mirror.dev)
- Support Eskalasi: support@mirror.dev
- Psikolog On-Call: psikolog@mirror.dev
- Log & Audit Access: DevOps Team (ops@mirror.dev)

## Tipe Insiden
1. **Keamanan Data** – kebocoran data, akses tidak sah.
2. **Safety/Psychological** – pengguna menunjukkan tanda bahaya, guardrail gagal, atau ada laporan darurat.
3. **Downtime** – layanan utama (chat, webhook pembayaran, health check) tidak tersedia >10 menit.

## Timeline Respon
| Tahap | Target Waktu | Tindakan |
| --- | --- | --- |
| Deteksi | < 5 menit | Alert dari log/Sentry/health check. |
| Penilaian | < 15 menit | Incident Commander menentukan severity, bentuk tim. |
| Mitigasi | < 60 menit | Nonaktifkan jalur rentan, rollback, blokir akun, atau aktifkan fallback manual. |
| Komunikasi | < 2 jam | Kirim update ke pengguna/pihak internal (email, status page). |
| Postmortem | < 72 jam | Analisis akar masalah, buat rencana perbaikan. |

## Prosedur Respon
1. **Aktifkan Channel Incident (Slack/Teams)**
   - Format pesan awal: `[SEVERITY][TYPE] - Deskripsi singkat`
2. **Kumpulkan Bukti**
   - Query log berdasarkan `requestId`, audit log, dan status PaymentSession/Profile.
   - Snapshot data yang terpengaruh (tanpa memodifikasi).
3. **Mitigasi**
   - Safety incident: hubungi psikolog on-call, blokir akses AI sementara, manual follow-up pengguna.
   - Data breach: cabut token, rotasi secret, batasi endpoint.
   - Downtime: rollback, scaling, atau alihkan ke mode read-only.
4. **Komunikasi**
   - Internal: pembaruan setiap 30 menit.
   - Pengguna: status page / email sesuai severity.
   - Partner psikolog: jika berdampak ke jadwal sesi.
5. **Post-mortem**
   - Siapkan dokumen: timeline, penyebab, data terdampak, rencana anti-regresi.
   - Simpan di folder `docs/postmortem/`.

## Checklist Pasca Insiden
- [ ] Log audit diverifikasi dan disimpan.
- [ ] Semua secret/token relevan diputar ulang.
- [ ] Pengguna terdampak menerima pemberitahuan.
- [ ] Backlog perbaikan dimasukkan dan diprioritaskan.

# Observability & Compliance Checklist

## Logging & Tracing
- API menggunakan StructuredLoggerInterceptor untuk mencetak log JSON:
  ```json
  {"type":"request","level":"info","requestId":"...","method":"POST","url":"/v1/payments","userId":"user123","duration":120,"status":200}
  ```
- Set header `x-request-id` dari reverse proxy agar korrelasi tetap konsisten.
- Log disarankan dikirim ke layanan terpusat (contoh: Elastic, Loki) dengan retensi minimal 90 hari.

## Frontend Monitoring
- Sentry client dapat diaktifkan via env:
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` (default 0.1)
  - `NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE` (default 0)
  - `NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE` (default 0)
- Tambahkan filter data pribadi sebelum mengirim event (TODO: masking chat content sebelum kirim ke Sentry).

## Backend Monitoring (TODO)
- Integrasi Sentry untuk NestJS (dsn environment) + menambah log error kritis.
- Tambahkan health endpoint (`/v1/health`) mengembalikan status database/queue.
- Konfigurasi metric agent (Prometheus/OpenTelemetry) untuk memonitor latency & failure rate.
- Tambah audit log: sudah ada tabel `AuditLog` dengan action `premium_activated`; perlu diperluas untuk consent & payment lainnya.

## Compliance
- Retensi data: PaymentSession + log harus disimpan minimal 1 tahun untuk audit (tentative).
- Audit trail: sekarang audit log merekam aktivasi premium dan perubahan consent (action `premium_activated`, `consent_updated`). Rencanakan tampilan dashboard audit + retensi 12 bulan.
- Metrics endpoint `/metrics` tersedia untuk Prometheus; histogram `http_server_duration_seconds` mencatat latency per method/route/status (scrape interval 15s disarankan).
- Backend Sentry (opsional): set `SENTRY_DSN` dan `SENTRY_TRACES_SAMPLE_RATE` untuk mengirim error/trace dari API.
- Incident response: definisikan playbook (lihat backlog Langkah 5 dan dokumen `docs/incident-response.md`).

## Alerting & Pager
- Rekomendasi setup:
  1. Prometheus + Alertmanager
     - Alert rules:
       - `http_server_duration_seconds` 95th percentile > 2s selama 5 menit.
       - `http_requests_total{status_code=~"5.."}` meningkat > 5/min.
     - Kirim ke PagerDuty channel `mirror-oncall`.
  2. Sentry Alerts
     - Frontend: trigger untuk error rate > 3/min (environment production).
     - Backend: trigger untuk exception `level=error`.
- Semua alert harus disalurkan ke Incident Commander (`incident@mirror.dev`) dan on-call psikolog bila terkait safety.

## Compliance Checklist (v0)
- [x] Health check endpoint.
- [x] Structured logging (JSON + requestId).
- [x] Audit log untuk premium & consent.
- [ ] Export & delete account flow (Langkah 6).
- [ ] Data retention enforcement (cron cleanup).
- [ ] Annual security review + pentest.

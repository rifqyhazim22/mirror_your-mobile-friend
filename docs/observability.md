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
- Incident response: definisikan playbook (lihat backlog Langkah 5).

# Monetisasi & Distribusi Mirror (Draft V0)

Dokumen ini memetakan langkah awal menuju monetisasi Mirror sambil menjaga keamanan dan empati pengguna.

## Paket & Pricing

| Paket | Harga* | Benefit Utama |
| --- | --- | --- |
| Mirror Premium Bulanan (`mirror-premium-monthly`) | Rp499.000 | Chat AI tanpa batas, insight mingguan, 1 sesi psikolog/bulan |
| Mirror Lite 7 Hari (`mirror-lite-weekly`) | Rp199.000 | 7 hari akses penuh sandbox & insight, diskon sesi psikolog tambahan |

> *Harga masih mock untuk simulasi flow. Gateway pembayaran (Midtrans) akan menyusul.

## User Flow
1. Pengguna membuka `/subscribe`, memilih paket, dan submit form.
2. Frontend memanggil endpoint backend `POST /v1/payments/checkout-session` memakai token Mirror.
3. Backend men-delegasikan ke `PaymentProvider`: saat ini default `mock`, nanti bisa `midtrans`.
4. `PaymentSession` disimpan di database (status `ready`), termasuk provider + reference.
5. Halaman sukses menampilkan ringkasan paket + riwayat (via `GET /v1/payments/sessions`).

## Roadmap Pendek
- Integrasi Midtrans Snap / Stripe Checkout. Konfigurasi environment:
  - `PAYMENTS_PROVIDER=midtrans`
  - `MIDTRANS_SERVER_KEY` dan `MIDTRANS_BASE_URL` (sandbox/production).
- Implement webhook Midtrans → endpoint `POST /v1/payments/webhook` (TODO) untuk menandai sesi `paid`.
- Automasi onboarding premium (email + Mirror Connect) ketika status berubah `paid`.
- Bundle upsell di halaman `/insights` saat data mood menunjukkan kebutuhan ekstra.
- Siapkan dashboard internal untuk memonitor transaksi (grafik + filter).

## Distribusi Multi-platform
- Script `pnpm run build:android|ios|desktop` sudah menyiapkan bundel untuk Capacitor.
- Tambahkan GitHub Action/Turbo pipeline untuk trigger build lintas platform.
- Dokumentasi sideload ada di `docs/install-*.md`.

## Branding & Marketing Kit
- Placeholder: `docs/branding-kit/` (belum ada). Rencana isi:
  - Logo variasi warna.
  - Palet liquid-glass + tipografi.
  - Voice & tone guideline + contoh caption sosial media.

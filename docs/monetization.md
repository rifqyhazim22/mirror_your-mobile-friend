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
2. Next.js route `/api/subscribe/checkout` memanggil endpoint backend `POST /v1/payments/checkout-session`.
3. Backend sementara membuat session mock, mengembalikan URL redirect. Jika gateway belum siap, route mengalihkan ke `/subscribe/success?mock=1`.
4. Halaman sukses menampilkan ringkasan paket + instruksi manual untuk timeline human support.

## Roadmap Pendek
- Integrasi Midtrans Snap / Stripe Checkout.
- Simpan metadata transaksi di tabel `PaymentSession` (Prisma).
- Automasi email/onboarding premium setelah status `paid`.
- Bundle upsell di halaman `/insights` saat data mood menunjukkan kebutuhan ekstra.

## Distribusi Multi-platform
- Script `pnpm run build:android|ios|desktop` sudah menyiapkan bundel untuk Capacitor.
- Tambahkan GitHub Action/Turbo pipeline untuk trigger build lintas platform.
- Dokumentasi sideload ada di `docs/install-*.md`.

## Branding & Marketing Kit
- Placeholder: `docs/branding-kit/` (belum ada). Rencana isi:
  - Logo variasi warna.
  - Palet liquid-glass + tipografi.
  - Voice & tone guideline + contoh caption sosial media.

# Mirror Web (Next.js)

Aplikasi web utama Mirror dibangun dengan Next.js App Router + Tailwind v4 dan efek liquid-glass. Versi ini merupakan basis bagi build PWA, Android (Capacitor), dan desktop ( Electron shell ).

## Skrip Pengembangan

```bash
pnpm install              # install semua workspaces
pnpm --filter web dev     # jalankan dev server di http://localhost:3000
pnpm --filter web lint    # linting
pnpm run build:web        # build + export static site ke apps/web/out
```

## Fitur Utama
- Landing page beraksen liquid glass dengan emotikon empatik.
- PWA siap deploy (`@ducanh2912/next-pwa`) + manifest + ikon maskable.
- Konfigurasi `output: "export"` agar kompatibel dengan Capacitor.
- Komponen animasi menggunakan Framer Motion.

## Integrasi Capacitor
- `pnpm run build:android` → build Next + sync ke proyek Android (setelah `pnpm exec cap add android`).
- `pnpm run build:desktop` → build Next + sync ke proyek Electron.
- `pnpm run build:ios` → build Next + sync ke proyek iOS (perlu Xcode).

Lihat `docs/install-android.md`, `docs/install-desktop.md`, `docs/install-pwa.md` untuk detail langkah instalasi.

## TODO (berdasar roadmap)
- Implementasi modul chat AI dan integrasi kamera.
- Komponen avatar & mood board dinamis.
- Guardrails konten + API backend.

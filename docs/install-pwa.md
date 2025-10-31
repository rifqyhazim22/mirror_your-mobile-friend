# Instal Mirror sebagai PWA

Versi PWA adalah jalur paling cepat untuk mencoba Mirror di berbagai perangkat. Deploy default dilakukan via Vercel.

## 1. Deploy ke Vercel
```bash
pnpm install
pnpm run build:web
vercel deploy --prebuilt
```
Pastikan `vercel.json` (TODO) atau pengaturan proyek memakai output `apps/web/out`.

## 2. Instal di perangkat mobile
1. Buka URL Mirror di Chrome / Safari.
2. Tap ikon menu → **Add to Home Screen** / **Tambahkan ke layar utama**.
3. PWA akan tampil full-screen dengan splash liquid-glass custom.

## 3. Instal di desktop
1. Buka Mirror di Chrome / Edge.
2. Klik ikon `Install app` di omnibar.
3. Mirror akan berjalan dalam jendela sendiri + shortcut otomatis.

## 4. Fitur PWA yang aktif
- Offline-first berkat service worker (Workbox) dari `next-pwa`.
- Push notification siap pakai (perlu konfigurasi Web Push server, TODO).
- Manifest dengan ikon maskable agar tampilan konsisten di perangkat modern.

## 5. Menghapus / reset cache
`Settings > Apps > Mirror > Storage > Clear data` atau di desktop melalui menu `Uninstall Mirror`.

> 💡 Selesai uji coba? Instal versi APK atau desktop untuk pengalaman lebih native.

# Panduan Build Aplikasi Desktop Mirror

Mirror memanfaatkan `@capacitor-community/electron` untuk membungkus PWA menjadi aplikasi desktop (Windows, macOS, Linux).

## Prasyarat
- Node.js 20+ dan pnpm.
- Git + akses repo.
- Untuk _signing_ optional: sertifikat kode (macOS `.p12`, Windows `.pfx`).

## 1. Instal dependensi
```bash
pnpm install
```

## 2. Tambahkan platform Electron (sekali saja)
```bash
pnpm exec cap add @capacitor-community/electron
```
Folder `electron/` akan muncul berisi proyek Electron + tooling build.

## 3. Sinkronkan bundle
```bash
pnpm run build:desktop
```
Perintah ini membangun Next.js (`pnpm run build:web`) lalu menyalin hasil ekspor ke `electron/app`.

## 4. Jalankan mode pengembangan desktop
```bash
pnpm exec cap open @capacitor-community/electron
pnpm --dir electron start
```
Aplikasi Mirror akan muncul sebagai jendela desktop. Efek liquid-glass tetap aktif karena menggunakan engine Chromium bawaan Electron.

## 5. Membangun installer
Gunakan `electron-builder` yang sudah dikonfigurasi otomatis oleh plugin:
```bash
cd electron
pnpm run build
```
- macOS: menghasilkan `.dmg` dan `.zip`.
- Windows: menghasilkan `.exe` atau `.msi` (disesuaikan di `electron-builder.config.json`).

## 6. Distribusi
- Sign installer sesuai platform untuk menghindari peringatan keamanan.
- Upload ke penyimpanan internal/Notion agar tester bisa unduh.

> ℹ️ Jangan lupa memperbarui ikon aplikasi pada `electron/icons/` agar selaras dengan brand Mirror.

## Troubleshooting
- **Aplikasi kosong**: pastikan `pnpm run build:web` sukses dan `webDir` di `capacitor.config.ts` menunjuk ke `apps/web/out`.
- **Notifikasi tidak jalan**: Electron butuh implementasi push manual. Gunakan `electron-main.ts` untuk menambahkan modul notifikasi lokal.
- **Ukuran bundle besar**: setelah fase beta, aktifkan `asar` & `files` whitelist di konfigurasi electron-builder.

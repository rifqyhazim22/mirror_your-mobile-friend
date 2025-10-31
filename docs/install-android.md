# Panduan Build & Instal APK Mirror

Mirror menggunakan Next.js (PWA) yang dibungkus dengan Capacitor. Langkah berikut membantu kamu menyiapkan APK untuk sideload di perangkat Android.

## Prasyarat
- Node.js 20+ dan pnpm (`npm install -g pnpm`).
- Java Development Kit (JDK 17).
- Android Studio (untuk Gradle, SDK Platform, dan emulator bila diperlukan).
- Perangkat Android dengan mode Developer & USB debugging aktif (atau gunakan emulator).

## 1. Build aset web
```bash
pnpm install
pnpm run build:web
```

## 2. Tambahkan platform Android (sekali saja)
```bash
pnpm exec cap add android
```
Langkah ini membuat folder `android/` dan sinkron dengan bundel web terbaru. Commit folder jika ingin dibagikan ke tim.

## 3. Sinkronkan perubahan terbaru
Setiap kali melakukan perubahan pada web app, jalankan:
```bash
pnpm run build:android
```
Perintah di atas akan menjalankan `next build`, mengekspor ke `apps/web/out`, lalu `cap sync android`.

## 4. Buka proyek di Android Studio
```bash
pnpm exec cap open android
```
Dari Android Studio kamu bisa:
- Menjalankan di emulator atau perangkat fisik (`Run > Run 'app'`).
- Membangun APK / Android App Bundle (`Build > Build bundle(s) / APK(s)`).

## 5. Instal APK
APK hasil build bisa ditemukan di `android/app/build/outputs/apk`. Salin ke perangkat kemudian instal (aktifkan izin `Install unknown apps`).

> ⚠️ Mirror saat ini belum menambahkan plugin native. Jika suatu saat diperlukan (kamera, notifikasi push), tambahkan melalui `capacitor.config.ts` dan sinkronkan ulang.

## Troubleshooting cepat
- **Blank screen**: pastikan `next.config.ts` sudah `output: "export"` dan `pnpm run build:web` berjalan tanpa error.
- **App tidak bisa akses kamera**: tambahkan permission di `android/app/src/main/AndroidManifest.xml` (`<uses-permission android:name="android.permission.CAMERA" />`) dan sinkron ulang.
- **Gradle versi tidak cocok**: update Android Gradle Plugin melalui Android Studio (`Upgrade Assistant`).

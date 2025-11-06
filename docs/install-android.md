# Build & Sideload Mirror (Android)

1. Pastikan Node.js 20, pnpm, dan Java 17 sudah terpasang.
2. Instal dependensi monorepo:
   ```bash
   pnpm install
   ```
3. Generate aset web:
   ```bash
   pnpm --filter web build
   ```
4. Sinkronkan ke proyek Android:
   ```bash
   pnpm run build:android
   ```
5. Buka `apps/web/android` di Android Studio, pilih target device, lalu klik *Run* atau *Build > Build Bundle(s)/APK(s)*.
6. Untuk sideload manual, ambil file APK di `apps/web/android/app/build/outputs/apk/debug/app-debug.apk`.

# Build Mirror Desktop (Electron)

1. Pastikan Node.js 20 dan pnpm sudah terpasang.
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Build web:
   ```bash
   pnpm --filter web build
   ```
4. Generate bundle Electron:
   ```bash
   pnpm run build:desktop
   ```
5. Aplikasi Electron berada di `apps/web/electron`. Jalankan:
   ```bash
   pnpm exec cap open @capacitor-community/electron
   ```
   lalu `npm run start` di folder tersebut untuk mencoba versi desktop.

# Build & Sideload Mirror (iOS)

1. Persyaratan: macOS dengan Xcode 15, Node.js 20, pnpm, CocoaPods.
2. Instal dependensi monorepo:
   ```bash
   pnpm install
   ```
3. Build web bundle:
   ```bash
   pnpm --filter web build
   ```
4. Sinkronkan dengan proyek iOS:
   ```bash
   pnpm run build:ios
   ```
5. Buka `apps/web/ios/App.xcworkspace` di Xcode.
6. Atur tim signing, pilih simulator/perangkat, lalu `Product > Run`. Untuk pengujian di device, pastikan UDID terdaftar.

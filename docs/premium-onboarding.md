# Mirror Premium Onboarding (Draft)

Begitu transaksi premium sukses (status `paid` di Midtrans), backend otomatis mengisi:
- `profile.premiumPlanId`
- `profile.premiumStatus = "active"`
- `profile.premiumActiveSince = timestamp`

Sebelum Langkah 5, berikut proses manual sementara:

1. **Kirim Email Selamat Datang**
   - Subjek: _“Mirror Premium sudah aktif ✨”_
   - Body (template singkat):
     ```
     Hai {nickname},

     Terima kasih sudah upgrade ke Mirror Premium! Mulai hari ini kamu bisa:
     • Mengakses konten coping eksklusif di halaman Premium Hub.
     • Menjadwalkan sesi Mirror Connect dengan psikolog mitra.
     • Mendapat insight mingguan yang lebih detail.

     Tim Mirror akan menghubungi kamu maksimal 24 jam untuk menjadwalkan sesi perdana.
     Bila butuh bantuan mendesak, hubungi support@mirror.dev ya 💛

     Peluk hangat,
     Tim Mirror
     ```

2. **Jadwalkan Mirror Connect (Manual)**
   - Catat preferensi waktu pengguna.
   - Hubungi psikolog mitra, konfirmasi jadwal, lalu kirim kalender invitation (Google/Outlook).

3. **Aktifkan Konten Premium**
   - Tambahkan user ke daftar pembaca konten eksklusif (sementara berupa Google Drive/Notion).
   - Pastikan mereka dapat akses ke modul latihan tambahan.

4. **Follow-up 3 Hari**
   - Kirim pesan check-in: “Bagaimana pengalaman Mirror Premium sejauh ini? Apa yang ingin kamu eksplor bareng kami?”

> TODO Automasi (Langkah berikut): integrasikan email transactional (Resend/Postmark), sistem booking Mirror Connect, dan dashboard konten premium di aplikasi.

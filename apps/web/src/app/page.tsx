"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BotMessageSquare,
  Camera,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Brain,
  Smartphone,
  MonitorSmartphone,
  Waves,
} from "lucide-react";

const heroHighlights = [
  "Empati real-time 😍",
  "Profil kepribadian yang adaptif 🧠",
  "Privasi terjaga penuh 🔐",
];

const coreFeatures = [
  {
    icon: Camera,
    title: "Deteksi Emosi Seketika",
    description:
      "Kamera memantau ekspresi wajahmu secara on-device — nggak ada data video yang dikirim ke server. Mirror langsung menyesuaikan responnya supaya kamu merasa benar-benar dipahami."
  },
  {
    icon: BotMessageSquare,
    title: "Chatbot Sahabat 24/7",
    description:
      "Ngobrol bebas atau pakai alur CBT yang lembut. Mirror merangkum cerita kamu, menawarkan latihan napas, afirmasi hangat, sampai rencana kecil untuk merasa lebih baik. 🤗"
  },
  {
    icon: Brain,
    title: "Insight Psikologi Ilmiah",
    description:
      "Kombinasi MBTI, Enneagram, archetype Jung, dan mood harian membentuk persona unikmu. Mirror jadi makin nyambung setiap kamu curhat.✨"
  }
];

const pillars = [
  {
    icon: HeartHandshake,
    title: "Empati Otentik",
    emoji: "💖",
    points: [
      "Onboarding empatik yang menyapamu sebagai teman.",
      "AI aktif mendengarkan, memvalidasi, dan merangkum perasaanmu.",
      "Rekomendasi self-care harian biar mood kamu makin stabil."
    ]
  },
  {
    icon: ShieldCheck,
    title: "Keamanan & Kontrol",
    emoji: "🛡️",
    points: [
      "Enkripsi end-to-end + kontrol consent granular.",
      "Mode darurat memanggil psikolog atau hotline pilihanmu.",
      "Data bisa kamu ekspor atau hapus kapan pun."
    ]
  },
  {
    icon: Waves,
    title: "Personalisasi Cair",
    emoji: "🌈",
    points: [
      "Mood board cair dengan efek liquid-glass yang berubah sesuai emosi.",
      "Avatar Mirror ikut tersenyum / menenangkan sesuai ekspresimu.",
      "Dashboard adaptif memadukan konten, jurnal, dan insight khususmu."
    ]
  }
];

const platforms = [
  {
    icon: Smartphone,
    title: "Android APK",
    badge: "Beta akses awal",
    description:
      "Bangun dari PWA + Capacitor, siap dipaketkan sebagai APK. Satu klik `pnpm run build:android` buat ngeluarin versi sideload ke HP kamu. 📱",
    cta: "Draft instruksi sideload",
    href: "https://github.com/rifqyhazim22/mirror_your-mobile-friend/blob/main/docs/install-android.md"
  },
  {
    icon: MonitorSmartphone,
    title: "Desktop (Mac & Windows)",
    badge: "Electron shell",
    description:
      "Capacitor Electron bikin Mirror bisa jalan mulus sebagai aplikasi desktop. Tetap ada efek kaca cair plus notifikasi native. 🖥️",
    cta: "Panduan build desktop",
    href: "https://github.com/rifqyhazim22/mirror_your-mobile-friend/blob/main/docs/install-desktop.md"
  },
  {
    icon: Sparkles,
    title: "PWA Instan",
    badge: "Deploy ke Vercel",
    description:
      "Install langsung dari browser dengan support offline, push notification, dan tampilan full-screen. Cocok buat iOS & perangkat lain. ✨",
    cta: "Cara install PWA",
    href: "https://github.com/rifqyhazim22/mirror_your-mobile-friend/blob/main/docs/install-pwa.md"
  }
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <BackgroundOrbs />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-32 pt-20 text-foreground sm:px-10 lg:px-12">
        <HeroSection />
        <section className="grid gap-8 md:grid-cols-3">
          {coreFeatures.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              viewport={{ once: true, amount: 0.4 }}
              className="glass-panel p-6 sm:p-8"
            >
              <feature.icon className="mb-6 h-10 w-10 text-accent" />
              <h3 className="mb-4 text-2xl font-semibold text-gradient">
                {feature.title}
              </h3>
              <p className="text-sm leading-6 text-white/80 sm:text-base">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
              className="glass-panel p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <pillar.icon className="h-8 w-8 text-accent" />
                <h3 className="text-xl font-semibold text-white/95">
                  {pillar.emoji} {pillar.title}
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-white/80 sm:text-base">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 text-lg text-accent-secondary">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        <section id="platforms" className="space-y-8">
          <div className="flex flex-col gap-4 text-center">
            <span className="badge mx-auto bg-white/15 text-xs uppercase tracking-[0.2em] text-white/80">
              One build, many feels 🚀
            </span>
            <h2 className="text-3xl font-semibold text-gradient sm:text-4xl">
              Download versi yang kamu butuhkan ✨
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-white/75 sm:text-base">
              Fokus utama kita tetap web (Vercel) supaya update cepet. Tapi kamu bisa sideload ke HP,
              laptop, atau install PWA biar Mirror siap nemenin kapan aja. 💫
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {platforms.map((platform, index) => (
              <motion.article
                key={platform.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
                className="glass-panel flex h-full flex-col p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <platform.icon className="h-8 w-8 text-accent" />
                  <span className="badge text-[0.7rem] uppercase tracking-[0.18em] text-white/70">
                    {platform.badge}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white/95">
                  {platform.title}
                </h3>
                <p className="mb-6 text-sm leading-6 text-white/80 sm:text-base">
                  {platform.description}
                </p>
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  {platform.cta} →
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="glass-panel flex flex-col gap-6 overflow-hidden p-8 text-center sm:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <span className="badge mx-auto bg-accent/20 text-white/90">
              Beta tester batch 01 🧪
            </span>
            <h2 className="text-3xl font-semibold text-gradient sm:text-4xl">
              Mau jadi anggota pertama #MirrorCircle? 💜
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-white/80 sm:text-lg">
              Kami lagi nyiapin sesi uji coba tertutup bareng psikolog mitra. Tinggal daftar, kamu bakal
              dapet akses awal + wallpaper eksklusif + fitur journaling mood yang super lembut. 🥰
            </p>
          </motion.div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://forms.gle/SoaMirrorBeta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 hover:bg-white sm:w-auto"
            >
              Daftar beta sekarang ✨
            </a>
            <Link
              href="#platforms"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/45 hover:bg-white/10 sm:w-auto"
            >
              Lihat opsi instalasi 🔍
            </Link>
          </div>
          <p className="text-xs text-white/60">
            Mirror bukan pengganti profesional kesehatan mental. Jika sedang dalam kondisi krisis, segera
            hubungi tenaga profesional atau hotline terdekat. ❤️
          </p>
        </section>
      </main>
      <footer className="border-t border-white/10 bg-black/40 py-8 text-center text-xs text-white/60 backdrop-blur-xl">
        <p>
          © {new Date().getFullYear()} Mirror Collective. Dibangun dengan penuh empati untuk Gen Z yang
          butuh tempat aman curhat. 💫
        </p>
      </footer>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.08] p-8 text-center backdrop-blur-2xl sm:p-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
      <motion.div
        className="mx-auto flex max-w-3xl flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="badge mx-auto bg-white/20 text-sm text-white/90">
          Hai, aku Mirror! 🤍
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-tight text-gradient sm:text-5xl">
          Teman curhat AI berbasis emosi yang selalu ada buat kamu ✨
        </h1>
        <p className="text-pretty text-sm text-white/80 sm:text-lg">
          Mirror memadukan deteksi ekspresi wajah, percakapan empatik, serta insight psikologi ilmiah.
          Ceritakan apa pun — dari keresahan sekolah, quarter-life crisis, sampai kebahagiaan kecil yang
          pengin kamu rayakan bareng. 🥳
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 hover:bg-white sm:w-auto"
          >
            Mulai curhat di web sekarang 💬
          </Link>
          <Link
            href="#platforms"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/45 hover:bg-white/10 sm:w-auto"
          >
            Lihat opsi mobile 📲
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/70 sm:text-sm">
          {heroHighlights.map((item) => (
            <li key={item} className="badge flex items-center gap-2 bg-white/10 text-white/80">
              <Sparkles className="h-4 w-4 text-accent" /> {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none" aria-hidden>
      <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,92,255,0.55),_rgba(122,92,255,0))] blur-3xl" />
      <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,115,194,0.5),_rgba(255,115,194,0))] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_60%)]" />
    </div>
  );
}

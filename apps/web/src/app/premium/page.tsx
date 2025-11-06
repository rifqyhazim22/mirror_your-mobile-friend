"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, Sparkles, ArrowLeft, Calendar, BookOpenCheck } from "lucide-react";
import { useMirrorSession } from "@/hooks/useMirrorSession";
import { useMirrorProfile } from "@/hooks/useMirrorProfile";

const premiumBenefits = [
  {
    title: "Mirror Connect",
    description: "Sesi tatap muka virtual bersama psikolog mitra Mirror, 1x per bulan.",
    action: "Tim kami akan menghubungi kamu via email untuk menjadwalkan sesi perdana.",
    icon: Calendar,
  },
  {
    title: "Konten Coping Eksklusif",
    description: "Akses mini course, latihan guided journaling, dan audio calming khusus premium.",
    action: "Selama masa transisi, kamu akan menerima link private melalui email.",
    icon: BookOpenCheck,
  },
  {
    title: "Insight Mendalam",
    description: "Weekly insight premium berisi pola mood, trigger, dan rekomendasi coping personal.",
    action: "Insight akan muncul otomatis di halaman /insights mulai pekan depan.",
    icon: Sparkles,
  },
];

export default function PremiumHubPage() {
  const { token, isAuthenticated, status, error, login } = useMirrorSession();
  const { profile, isComplete } = useMirrorProfile(token);

  const isPremium = useMemo(() => profile.premiumStatus === "active", [profile.premiumStatus]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-night pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16 text-white">
          <div className="glass-panel space-y-6 p-8">
            <h1 className="text-3xl font-semibold text-gradient">Masuk dulu ya 💫</h1>
            <p className="text-sm text-white/75">
              Masuk menggunakan kode beta supaya kami bisa cek status langgananmu.
            </p>
            <button
              type="button"
              onClick={() => login(prompt("Masukkan kode akses beta") || "")}
              className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#5c4bff]"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sedang masuk..." : "Masuk ke Mirror"}
            </button>
            {error && <p className="text-xs text-rose-200">{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-night pb-24 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pt-16 sm:px-10">
        <div className="flex items-center justify-between text-sm text-white/70">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 transition-colors hover:border-white/35 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 transition-colors hover:border-white/35 hover:bg-white/10"
          >
            Kelola langganan
          </Link>
        </div>

        <header className="glass-panel flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge inline-flex items-center gap-2 bg-white/15 text-xs text-white/80">
              <Sparkles className="h-4 w-4 text-accent" /> Premium Hub
            </span>
            <h1 className="mt-4 text-4xl font-semibold text-gradient sm:text-5xl">
              {isPremium ? "Selamat datang di Mirror Premium ✨" : "Premium masih menunggu"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
              {isPremium
                ? "Nikmati dukungan penuh: sesi Mirror Connect, konten coping eksklusif, dan insight mendalam. Tim kami siap memberi pendampingan manusia kapan pun kamu butuh."
                : "Langganan kamu belum aktif. Selesaikan pembayaran atau hubungi tim support jika status sudah paid namun belum berubah."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                Status: {profile.premiumStatus}
              </span>
              {profile.premiumActiveSince && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                  Aktif sejak{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(profile.premiumActiveSince))}
                </span>
              )}
            </div>
          </div>
          {isPremium && (
            <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-sm text-white/85">
              <p className="uppercase tracking-[0.2em] text-white/40">Langkah berikut</p>
              <p className="mt-2">
                Cek email kamu dalam 24 jam. Tim support akan menjadwalkan sesi Mirror Connect
                perdana dan mengirimkan konten eksklusif.
              </p>
            </div>
          )}
        </header>

        {isPremium ? (
          <section className="grid gap-6 md:grid-cols-2">
            {premiumBenefits.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/15 bg-white/8 p-6 text-sm text-white/80"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-semibold text-white/90">{item.title}</h2>
                </div>
                <p className="mt-3 text-white/75">{item.description}</p>
                <p className="mt-2 text-xs text-white/60">{item.action}</p>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm text-rose-100">
            <h2 className="text-lg font-semibold text-white/90">Menunggu aktivasi premium</h2>
            <p className="mt-2 text-white/75">
              Jika kamu sudah melakukan pembayaran, tunggu 1-2 menit atau hubungi
              support@mirror.dev dengan bukti transaksi. Kamu juga bisa menekan tombol “Tandai
              selesai (mock)” di halaman pricing untuk testing internal.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";

const planCopy: Record<string, { title: string; message: string }> = {
  "mirror-premium-monthly": {
    title: "Mirror Premium Bulanan",
    message:
      "Tim kami akan segera mengirim detail sesi psikolog bulanan dan membuka akses konten premium kamu. Sambil menunggu, jangan lupa lanjutkan journaling ya ✨",
  },
  "mirror-lite-weekly": {
    title: "Mirror Lite 7 Hari",
    message:
      "Nikmati 7 hari penuh eksperimen latihan coping dengan Mirror. Jadwalkan follow-up dengan tim support kalau butuh upgrade kapan saja.",
  },
};

export default function SubscribeSuccessPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "mirror-premium-monthly";
  const mock = searchParams.get("mock") === "1";
  const plan = planCopy[planId] ?? planCopy["mirror-premium-monthly"];

  return (
    <div className="relative min-h-screen bg-night pb-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16 text-center sm:px-10">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-16 w-16 text-emerald-300" />
          <h1 className="text-4xl font-semibold text-gradient sm:text-5xl">
            Pembayaran kamu diterima! 🎉
          </h1>
          <p className="max-w-xl text-sm text-white/75 sm:text-base">
            Terima kasih sudah percaya Mirror. {plan.message}
            {mock && (
              <span className="block pt-2 text-xs text-white/50">
                (Ini adalah simulasi checkout karena payment gateway masih di tahap implementasi.)
              </span>
            )}
          </p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/8 p-6 text-left text-sm text-white/80">
          <p className="uppercase tracking-[0.2em] text-white/40">Paket Aktif</p>
          <h2 className="mt-2 text-2xl font-semibold text-white/90">{plan.title}</h2>
          <p className="mt-2 text-white/70">
            Email konfirmasi beserta langkah Mirror Connect akan dikirim ke inbox kamu dalam 5 menit.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Butuh bantuan cepat? Hubungi support@mirror.dev atau pakai tombol “hubungkan manusia” di sandbox chat.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 transition-transform hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/15"
          >
            <Sparkles className="h-4 w-4" /> Balik ke sandbox chat
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 transition-transform hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" /> Ke beranda
          </Link>
        </div>
      </main>
    </div>
  );
}

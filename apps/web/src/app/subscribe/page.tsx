import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowLeft, HeartHandshake, Receipt } from "lucide-react";

const plans = [
  {
    id: "mirror-premium-monthly",
    title: "Mirror Premium Bulanan",
    price: "Rp499.000",
    period: "/bulan",
    badge: "Best for ongoing care",
    features: [
      "Chat AI tanpa batas + flow CBT terstruktur",
      "Insight mingguan, konten coping eksklusif",
      "1 sesi psikolog partner / bulan via Mirror Connect",
    ],
  },
  {
    id: "mirror-lite-weekly",
    title: "Mirror Lite 7 Hari",
    price: "Rp199.000",
    period: "/minggu",
    badge: "Trial intens",
    features: [
      "Full akses sandbox & mood insight",
      "Mini coaching 3x/hari dengan AI Mirror",
      "Diskon 10% sesi psikolog tambahan",
    ],
  },
];

const faqs = [
  {
    question: "Metode pembayaran apa yang didukung?",
    answer:
      "Kami siapkan integrasi dompet digital (GoPay, OVO, DANA) dan kartu debit/kredit lewat Midtrans Stripe-style. Saat ini checkout mock dulu sambil menunggu credential produksi.",
  },
  {
    question: "Apakah bisa refund?",
    answer:
      "Ada masa cooling-off 7 hari untuk paket bulanan. Tinggal hubungi support Mirror di menu Guardrail → Human support.",
  },
  {
    question: "Sesi psikolog dilakukan di mana?",
    answer:
      "Mirror Connect menghubungkan ke psikolog mitra via panggilan video/telepon dalam aplikasi. Jadwal bisa dipilih setelah pembayaran sukses.",
  },
];

export default function SubscribePage() {
  return (
    <div className="relative min-h-screen bg-night pb-24 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-16 sm:px-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
              <Sparkles className="h-4 w-4 text-accent" /> Pricing & Monetisasi
            </span>
            <h1 className="text-4xl font-semibold text-gradient sm:text-5xl">
              Pilih paket Mirror yang paling cocok buat self-healing kamu ✨
            </h1>
            <p className="max-w-xl text-sm text-white/70 sm:text-base">
              Semua paket dilengkapi privasi end-to-end dan akses ke dukungan manusia saat kamu butuh. Bayar nanti lewat gateway Midtrans setelah credential siap—sementara checkout simulasi membantu uji flow UI.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-white/75">
            <p className="uppercase tracking-[0.2em] text-white/40">Beta status</p>
            <p className="mt-2 text-base text-white/85">
              Gateway pembayaran masih mock. Kamu bisa nyobain flow lengkap tanpa transaksi nyata.
            </p>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="group flex flex-col rounded-3xl border border-white/15 bg-white/6 p-6 transition-all hover:border-white/35 hover:bg-white/12"
            >
              <header className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white/90">{plan.title}</h2>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                  {plan.badge}
                </span>
              </header>
              <p className="mt-4 text-3xl font-semibold text-white">
                {plan.price} <span className="text-base text-white/60">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 text-white/55">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <form
                className="mt-6"
                action="/api/subscribe/checkout"
                method="post"
              >
                <input type="hidden" name="priceId" value={plan.id} />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
                >
                  Checkout simulasi
                  <Receipt className="h-4 w-4" />
                </button>
              </form>
            </article>
          ))}
        </section>

        <section className="glass-panel space-y-4 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white/90">Kenapa Mirror Worth It?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-white/15 bg-white/8 p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold text-white/90">Privasi & compliance</h3>
              <p className="text-sm text-white/70">
                Pembayaran akan diarahkan ke gateway tepercaya dengan enkripsi PCI-DSS. Mirror tidak menyimpan detail kartu.
              </p>
            </div>
            <div className="space-y-3 rounded-3xl border border-white/15 bg-white/8 p-5">
              <HeartHandshake className="h-5 w-5 text-rose-300" />
              <h3 className="text-lg font-semibold text-white/90">Support manusia</h3>
              <p className="text-sm text-white/70">
                Paket premium termasuk sesi psikolog mitra. Saat ini jadwal manual via tim support, dan akan terhubung otomatis di Mirror Connect.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white/90">Pertanyaan Populer</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-3xl border border-white/15 bg-white/8 p-5 text-sm text-white/75"
              >
                <h3 className="text-base font-semibold text-white/90">{faq.question}</h3>
                <p className="mt-2 text-white/70">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

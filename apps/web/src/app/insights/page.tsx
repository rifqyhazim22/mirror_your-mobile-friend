"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Flame,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useMirrorSession } from "@/hooks/useMirrorSession";
import { useMirrorProfile } from "@/hooks/useMirrorProfile";
import { useMoodSummary } from "@/hooks/useMoodSummary";
import type { MoodTag } from "@/hooks/useMoodJournal";

const moodPalette: Record<string, string> = {
  ceria: "250, 204, 21",
  tenang: "125, 211, 252",
  lelah: "165, 180, 252",
  cemas: "248, 113, 113",
  sedih: "129, 140, 248",
};

const moodLabels: Record<string, string> = {
  ceria: "Ceria",
  tenang: "Tenang",
  lelah: "Lelah",
  cemas: "Cemas",
  sedih: "Sedih",
};

export default function InsightsPage() {
  const {
    token,
    isAuthenticated,
    status: authStatus,
    error: authError,
    login,
    logout,
  } = useMirrorSession();

  const { profile, profileId, isComplete, hydrated } = useMirrorProfile(token, logout);

  const {
    summary,
    status: summaryStatus,
    error: summaryError,
    reload: reloadSummary,
  } = useMoodSummary(profileId, token, logout);

  const dominantMoodLabel = summary?.dominantMood
    ? moodLabels[summary.dominantMood] ?? summary.dominantMood
    : "Belum ada";

  if (!isAuthenticated) {
    return (
      <UnauthenticatedPanel
        authStatus={authStatus}
        authError={authError}
        login={login}
      />
    );
  }

  if (hydrated && !isComplete) {
    return (
      <div className="relative min-h-screen bg-night pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
        <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16 text-white">
          <div className="glass-panel space-y-6 p-8">
            <h1 className="text-3xl font-semibold text-gradient">Lengkapi onboarding dulu ya ✨</h1>
            <p className="text-sm text-white/75">
              Insight mood akan muncul setelah profil dan preferensi kamu lengkap. Balik ke Mirror Experience untuk menyelesaikannya.
            </p>
            <Link
              href="/experience"
              className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
            >
              Kembali ke Onboarding
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const nickname = profile.nickname || "teman Mirror";

  return (
    <div className="relative min-h-screen bg-night pb-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-16 sm:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              🚀 Ke Sandbox Chat
            </Link>
          </div>
          <button
            type="button"
            onClick={reloadSummary}
            disabled={summaryStatus === "loading"}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            {summaryStatus === "loading" ? "Memuat..." : "Refresh data"}
          </button>
        </nav>

        <header className="glass-panel flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge inline-flex items-center gap-2 bg-white/15 text-xs text-white/80">
              <Sparkles className="h-4 w-4 text-accent" /> Mood Insight
            </span>
            <h1 className="mt-4 text-4xl font-semibold text-gradient sm:text-5xl">
              Halo {nickname}, ini pulsa emosimu ✨
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/75 sm:text-base">
              Lihat pola mood 3 minggu terakhir, rekomendasi self-care, dan momentum bagus buat dijaga.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/8 p-4 text-sm text-white/75">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Dominan 21 hari terakhir</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {dominantMoodLabel}
            </p>
            <p className="mt-1 text-xs text-white/60">
              Total catatan: {summary?.totalEntries ?? 0}
            </p>
          </div>
        </header>

        {summaryStatus === "error" && summaryError && (
          <div className="rounded-3xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {summaryError}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="glass-panel flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white/90">Kalender Mood 21 Hari</h2>
                <p className="text-sm text-white/65">
                  Warna lebih terang berarti mood dominan hari itu. Kotak buram menandakan belum ada catatan.
                </p>
              </div>
              <CalendarDays className="h-6 w-6 text-white/50" />
            </div>
            {summary ? (
              <MoodCalendarGrid series={summary.dailySeries} />
            ) : (
              <LoaderState />
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="glass-panel space-y-5 p-6">
              <h3 className="text-lg font-semibold text-white/90">Quick Stats</h3>
              <StatRow
                icon={<Activity className="h-4 w-4" />}
                label="Streak aktif"
                value={`${summary?.streakDays ?? 0} hari berturut-turut`}
              />
              <StatRow
                icon={<Flame className="h-4 w-4" />}
                label="Rata-rata catatan harian"
                value={`${summary?.averageDailyEntries ?? 0} catatan/hari`}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Total mood</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(summary?.moodTotals ?? {}).map(([mood, total]) => (
                    <span
                      key={mood}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/75"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `rgba(${getMoodColor(mood)}, 0.9)` }} />
                      {moodLabels[mood] ?? mood}: {total}
                    </span>
                  ))}
                  {summary && Object.keys(summary.moodTotals).length === 0 && (
                    <span className="text-xs text-white/60">Belum ada data.</span>
                  )}
                </div>
              </div>
            </div>
            {profile.premiumStatus === "active" ? (
              <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-6 text-sm text-emerald-100">
                <h3 className="text-lg font-semibold text-white/90">Premium aktif 🎉</h3>
                <p className="mt-2 text-white/80">
                  Insight premium akan dikirim tiap minggu. Cek juga halaman Premium Hub untuk jadwal
                  Mirror Connect dan konten coping eksklusif.
                </p>
                <Link
                  href="/premium"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
                >
                  Buka Premium Hub ✨
                </Link>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/15 bg-white/8 p-6 text-sm text-white/75">
                <h3 className="text-lg font-semibold text-white/90">Upgrade ke Mirror Premium</h3>
                <p className="mt-2 text-white/70">
                  Dapatkan insight mendalam, konten coping eksklusif, serta sesi Mirror Connect. Status kamu saat ini:{" "}
                  <span className="text-white">{profile.premiumStatus}</span>.
                </p>
                <Link
                  href="/subscribe"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
                >
                  Lihat paket premium 💎
                </Link>
              </div>
            )}

            <div className="glass-panel space-y-4 p-6">
              <h3 className="text-lg font-semibold text-white/90">Insight & Rekomendasi</h3>
              {summary ? (
                <>
                  <p className="text-sm text-white/75">{summary.insight.message}</p>
                  <ul className="space-y-2 text-sm text-white/70">
                    {summary.insight.suggestions.map((suggestion) => (
                      <li key={suggestion} className="flex items-start gap-2">
                        <span className="mt-0.5 text-white/60">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <LoaderState />
              )}
            </div>
          </div>
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white/90">Catatan terakhir</h3>
          {summary?.lastEntry ? (
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/8 p-4 text-sm text-white/75">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                  {summary.lastEntry.source === "camera"
                    ? "kamera otomatis"
                    : summary.lastEntry.source === "imported"
                    ? "sinkronisasi"
                    : "manual"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs text-white/85">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `rgba(${getMoodColor(summary.lastEntry.mood)}, 0.9)` }} />
                  {moodLabels[summary.lastEntry.mood] ?? summary.lastEntry.mood}
                </span>
              </div>
              {summary.lastEntry.note ? (
                <p className="text-white/80">{summary.lastEntry.note}</p>
              ) : (
                <p className="text-white/60">Tidak ada catatan tambahan.</p>
              )}
              <p className="text-xs text-white/50">
                {formatDateTime(summary.lastEntry.timestamp)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              Belum ada catatan mood. Mulai dari tombol "Simpan mood" di sandbox chat Mirror.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function MoodCalendarGrid({
  series,
}: {
  series: Array<{
    date: string;
    total: number;
    dominantMood: string | null;
    moods: Array<{ mood: string; count: number }>;
  }>;
}) {
  const cells = useMemo(() => {
    return series.map((day) => {
      const moodColor = day.dominantMood ? getMoodColor(day.dominantMood) : null;
      const intensity =
        day.total === 0 ? 0.15 : Math.min(0.8, 0.25 + day.total * 0.18);
      return {
        ...day,
        background: moodColor ? `rgba(${moodColor}, ${intensity})` : `rgba(148, 163, 184, ${intensity})`,
        borderColor: moodColor ? `rgba(${moodColor}, 0.6)` : "rgba(148, 163, 184, 0.4)",
      };
    });
  }, [series]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.date}
          className="group relative flex aspect-square flex-col justify-end rounded-2xl border p-2 text-[0.65rem] text-white/70 transition-transform hover:-translate-y-1"
          style={{
            backgroundColor: cell.background,
            borderColor: cell.borderColor,
          }}
        >
          <span>{formatShortDate(cell.date)}</span>
          {cell.dominantMood && (
            <span className="text-[0.6rem] text-white/80">
              {moodLabels[cell.dominantMood] ?? cell.dominantMood}
            </span>
          )}
          <div className="absolute inset-0 hidden flex-col justify-center rounded-2xl bg-black/70 p-3 text-xs text-white/80 group-hover:flex">
            <p className="font-semibold">{formatLongDate(cell.date)}</p>
            <p className="mt-1 text-white/70">Total catatan: {cell.total}</p>
            <ul className="mt-1 space-y-0.5 text-white/60">
              {cell.moods.map((mood) => (
                <li key={mood.mood}>
                  {moodLabels[mood.mood] ?? mood.mood}: {mood.count}
                </li>
              ))}
              {cell.moods.length === 0 && <li>Belum ada catatan</li>}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/75">
      <span className="inline-flex items-center gap-2 text-white/70">
        <span className="rounded-full bg-white/10 p-2 text-white/70">
          {icon}
        </span>
        {label}
      </span>
      <span className="font-semibold text-white/85">{value}</span>
    </div>
  );
}

function LoaderState() {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-sm text-white/60">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Memuat data...
    </div>
  );
}

function formatShortDate(date: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

function formatLongDate(date: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getMoodColor(mood: string): string {
  return moodPalette[mood] ?? "148, 163, 184";
}

function UnauthenticatedPanel({
  authStatus,
  authError,
  login,
}: {
  authStatus: "idle" | "loading" | "error";
  authError: string | null;
  login: (code: string) => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-night pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16 text-white">
        <div className="glass-panel space-y-6 p-8">
          <h1 className="text-3xl font-semibold text-gradient">Masuk dulu ya 💫</h1>
          <p className="text-sm text-white/75">
            Masukkan kode akses beta untuk membuka Mood Insight. Kode sama seperti yang dipakai di sandbox chat.
          </p>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Masukkan kode akses"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 focus:border-white/40 focus:outline-none"
            disabled={authStatus === "loading"}
          />
          <button
            type="button"
            onClick={async () => {
              try {
                await login(code.trim());
                setMessage("Berhasil masuk. Selamat datang kembali! 🌈");
                setCode("");
                setTimeout(() => setMessage(null), 2500);
              } catch (error: any) {
                setMessage(error?.message || "Kode akses salah");
              }
            }}
            disabled={!code.trim() || authStatus === "loading"}
            className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-[#867fff]"
          >
            {authStatus === "loading" ? "Sedang masuk..." : "Masuk ke Mirror"}
          </button>
          {(authError || message) && (
            <p className="text-xs text-rose-200">{authError || message}</p>
          )}
        </div>
      </main>
    </div>
  );
}

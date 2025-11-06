"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Check,
  Compass,
  PartyPopper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ChatPlayground } from "@/components/chat-playground";
import { useMirrorProfile } from "@/hooks/useMirrorProfile";
import { useMirrorSession } from "@/hooks/useMirrorSession";

const focusCatalog = [
  {
    id: "stress",
    title: "Stress akademik",
    emoji: "📚",
    blurb: "Deadline, tugas, dan rasa takut gagal."
  },
  {
    id: "relationship",
    title: "Hubungan & pertemanan",
    emoji: "💞",
    blurb: "Ngatur emosi dengan pasangan, keluarga, atau sahabat."
  },
  {
    id: "self-love",
    title: "Self-love & growth",
    emoji: "🌱",
    blurb: "Biar kamu makin cinta diri dan percaya diri."
  },
  {
    id: "career",
    title: "Karier & masa depan",
    emoji: "🚀",
    blurb: "Rencana kerja, magang, sampai passion project."
  }
] as const;

type StepKey = "greeting" | "focus" | "consent";

const orderedSteps: StepKey[] = ["greeting", "focus", "consent"];

export default function ExperiencePage() {
  const {
    token,
    isAuthenticated,
    status: authStatus,
    error: authError,
    login,
    logout,
  } = useMirrorSession();
  const {
    profile,
    updateProfile,
    toggleFocusArea,
    resetProfile,
    hydrated,
    isComplete,
    persistProfile,
    syncStatus,
    profileId,
  } = useMirrorProfile(token, logout);
  const [loginCode, setLoginCode] = useState("");
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<"onboarding" | "chat">("onboarding");
  const [autoEntered, setAutoEntered] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoEntered && hydrated && isComplete && profileId) {
      setMode("chat");
      setAutoEntered(true);
    }
  }, [hydrated, isComplete, profileId, autoEntered]);

  useEffect(() => {
    if (mode === "onboarding" && isComplete) {
      setStepIndex(orderedSteps.length - 1);
    }
  }, [mode, isComplete]);

  const activeStep = orderedSteps[stepIndex];
  const showBack = mode === "onboarding" && stepIndex > 0;
  const isSyncing = syncStatus === "loading";

  const handleNext = async () => {
    if (stepIndex < orderedSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      try {
        setSubmitError(null);
        await persistProfile();
        setAutoEntered(true);
        setMode("chat");
      } catch (error: any) {
        console.error(error);
        setSubmitError(error?.message || "Gagal menyimpan profil. Coba lagi ya 💛");
      }
    }
  };

  const onboardingDisabled = useMemo(() => {
    if (activeStep === "greeting") {
      return profile.nickname.trim().length < 2;
    }
    if (activeStep === "focus") {
      return profile.focusAreas.length === 0;
    }
    if (activeStep === "consent") {
      return !profile.consentData;
    }
    return false;
  }, [activeStep, profile.nickname, profile.focusAreas, profile.consentData]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-night pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16 text-white">
          <div className="glass-panel space-y-6 p-8">
            <h1 className="text-3xl font-semibold text-gradient">Masuk dulu yuk ✨</h1>
            <p className="text-sm text-white/75">
              Gunakan kode akses beta untuk membuka Mirror Experience. Atur kode ini melalui variabel environment `AUTH_SHARED_SECRET` di backend NestJS.
            </p>
            <input
              value={loginCode}
              onChange={(event) => setLoginCode(event.target.value)}
              placeholder="Masukkan kode akses"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 focus:border-white/40 focus:outline-none"
              disabled={authStatus === "loading"}
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  await login(loginCode.trim());
                  setLoginCode("");
                  setLoginMessage("Berhasil masuk, selamat datang! 💜");
                  setTimeout(() => setLoginMessage(null), 2500);
                } catch (error: any) {
                  setLoginMessage(error?.message || "Kode akses salah");
                }
              }}
              disabled={!loginCode.trim() || authStatus === "loading"}
              className="inline-flex w-full items-center justify-center rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-[#867fff]"
            >
              {authStatus === "loading" ? "Sedang masuk..." : "Masuk ke Mirror"}
            </button>
            {(authError || loginMessage) && (
              <p className="text-xs text-rose-200">{authError || loginMessage}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-night pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(122,92,255,0.28),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,115,194,0.32),transparent_55%)]" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-16 sm:px-10">
        <nav className="flex items-center justify-between text-sm text-white/70">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke halaman utama
          </Link>
          <div className="flex items-center gap-3">
            {mode === "chat" && (
              <button
                onClick={() => {
                  resetProfile();
                  setStepIndex(0);
                  setMode("onboarding");
                }}
                className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                Reset profil 🔄
              </button>
            )}
            <button
              onClick={() => {
                logout();
                resetProfile();
                setAutoEntered(false);
                setMode("onboarding");
              }}
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              Keluar 🔒
            </button>
          </div>
        </nav>

        {mode === "chat" && (
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-center text-xs text-white/70">
            Kamu terhubung sebagai pengguna beta. Jaga kode aksesmu baik-baik ya ✨
          </div>
        )}

        {mode === "onboarding" ? (
          <section className="glass-panel relative overflow-hidden p-8 sm:p-10">
            <span className="badge inline-flex items-center gap-2 bg-white/15 text-xs text-white/80">
              <Sparkles className="h-4 w-4 text-accent" /> Onboarding Empatik
            </span>
            <div className="mt-6 flex flex-col gap-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {activeStep === "greeting" && (
                  <motion.div
                    key="greeting"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <h1 className="text-4xl font-semibold text-gradient sm:text-5xl">
                      Hai, boleh kenalan dulu? 💖
                    </h1>
                    <p className="text-sm text-white/80 sm:text-base">
                      Aku Mirror, teman curhat AI yang super empatik. Sebelum kita ngobrol, kasih tau aku panggilan yang bikin kamu nyaman ya~
                    </p>
                    <label className="flex flex-col gap-2 text-sm text-white/70">
                      Nama panggilanmu
                      <input
                        className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white/90 focus:border-white/40 focus:outline-none"
                        placeholder="Misal: Dinda, Ray, atau panggilan unikmu ✨"
                        value={profile.nickname}
                        onChange={(event) => updateProfile({ nickname: event.target.value })}
                      />
                    </label>
                  </motion.div>
                )}
                {activeStep === "focus" && (
                  <motion.div
                    key="focus"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-semibold text-gradient sm:text-4xl">
                      Apa yang mau kita rawat bareng? 🌈
                    </h2>
                    <p className="text-sm text-white/75 sm:text-base">
                      Pilih satu atau beberapa fokus biar Mirror bisa menyesuaikan dukungan. Kamu bisa ubah kapan saja kok.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {focusCatalog.map((item) => {
                        const picked = profile.focusAreas.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleFocusArea(item.id)}
                            className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                              picked
                                ? "border-white/60 bg-white/20 text-white"
                                : "border-white/15 bg-white/8 text-white/80 hover:border-white/35 hover:bg-white/12"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{item.emoji}</span>
                              {picked && <Check className="h-4 w-4 text-white" />}
                            </div>
                            <p className="mt-3 text-base font-semibold text-white/90">
                              {item.title}
                            </p>
                            <p className="text-sm text-white/70">{item.blurb}</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                {activeStep === "consent" && (
                  <motion.div
                    key="consent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-semibold text-gradient sm:text-4xl">
                      Kita saling jaga privasi ya 🛡️
                    </h2>
                    <div className="space-y-4">
                      <ConsentCard
                        icon={<ShieldCheck className="h-6 w-6 text-emerald-300" />}
                        title="Aku mengerti kebijakan privasi Mirror"
                        description="Curhatanmu disimpan terenkripsi dan bisa kamu hapus kapan pun."
                        active={profile.consentData}
                        onToggle={() => updateProfile({ consentData: !profile.consentData })}
                      />
                      <ConsentCard
                        icon={<Camera className="h-6 w-6 text-sky-300" />}
                        title="Izinkan analisis ekspresi (opsional)"
                        description="Mirror cuma memproses kamera di perangkatmu. Kamu bisa matikan kapan saja."
                        active={profile.consentCamera}
                        onToggle={() => updateProfile({ consentCamera: !profile.consentCamera })}
                      />
                    </div>
                    <p className="rounded-3xl border border-white/15 bg-white/8 p-4 text-sm text-white/70">
                      Dengan melanjutkan, kamu setuju bahwa Mirror bukan pengganti profesional kesehatan mental. Saat darurat, segera hubungi tenaga ahli terdekat. ❤️
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Compass className="h-4 w-4" /> Langkah {stepIndex + 1} dari {orderedSteps.length}
              </div>
              <div className="flex gap-3">
                {showBack && (
                  <button
                    type="button"
                    onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/75 transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    Kembali
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={onboardingDisabled || isSyncing}
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-[#867fff]"
                >
                  {stepIndex === orderedSteps.length - 1 ? (
                    <>
                      {isSyncing ? (
                        "Menyimpan profil..."
                      ) : (
                        <>
                          Mulai ngobrol 💬
                          <PartyPopper className="h-4 w-4" />
                        </>
                      )}
                    </>
                  ) : (
                    "Lanjut"
                  )}
                </button>
              </div>
              {submitError && (
                <p className="text-xs text-rose-200">{submitError}</p>
              )}
            </div>
          </section>
        ) : (
          <ChatPlayground
            profile={profile}
            profileId={profileId}
            onReset={() => {
              resetProfile();
              setMode("onboarding");
              setStepIndex(0);
              setAutoEntered(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

type ConsentCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
};

function ConsentCard({ icon, title, description, active, onToggle }: ConsentCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-start gap-4 rounded-3xl border px-5 py-4 text-left transition-all ${
        active
          ? "border-white/60 bg-white/18"
          : "border-white/15 bg-white/6 hover:border-white/35 hover:bg-white/12"
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-white/90">{title}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/25">
        {active ? <Check className="h-4 w-4 text-emerald-300" /> : ""}
      </span>
    </button>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Loader2,
  Sparkles,
  Wand2,
  CameraOff,
} from "lucide-react";
import { MirrorProfile } from "@/hooks/useMirrorProfile";
import { EmotionWatcher } from "@/components/emotion-watcher";
import {
  MoodEntry,
  MoodTag,
  useMoodJournal,
} from "@/hooks/useMoodJournal";

const quickReplies = [
  "Aku lagi cemas soal kuliah 😥",
  "Bisa temenin aku meditasi sebentar? 🧘",
  "Tolong kasih afirmasi positif dong ✨",
];

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  pending?: boolean;
};

type ChatPlaygroundProps = {
  profile: MirrorProfile;
  profileId?: string | null;
  authToken?: string | null;
  onUnauthorized?: () => void;
  onReset: () => void;
};

export function ChatPlayground({
  profile,
  profileId,
  authToken,
  onUnauthorized,
  onReset,
}: ChatPlaygroundProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    buildIntroMessages(profile)
  );
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [escalation, setEscalation] = useState<{
    ruleId?: string;
    guidance?: string;
  } | null>(null);
  const {
    entries: journalEntries,
    status: journalStatus,
    error: journalError,
    addEntry: addMoodEntry,
  } = useMoodJournal(profileId, authToken, onUnauthorized);
  const [journalMood, setJournalMood] = useState<MoodTag>("tenang");
  const [journalNote, setJournalNote] = useState("");
  const [journalMessage, setJournalMessage] = useState<string | null>(null);
  const lastAutoEntryRef = useRef<{ mood: MoodTag; timestamp: number } | null>(null);

  useEffect(() => {
    setMessages(buildIntroMessages(profile));
    setLastError(null);
    setDetectedMood(null);
    setInputValue("");
    setSafetyNotice(null);
    setEscalation(null);
  }, [
    profile.nickname,
    profile.focusAreas.join(","),
    profile.mbtiType,
    profile.enneagramType,
    profile.primaryArchetype,
    profile.moodBaseline,
    profile.zodiacSign,
    profile.personalityNotes,
  ]);

  useEffect(() => {
    setCameraEnabled(profile.consentCamera);
    if (!profile.consentCamera) {
      setDetectedMood(null);
    }
  }, [profile.consentCamera]);

  useEffect(() => {
    if (!detectedMood) {
      return;
    }
    if (isMoodTag(detectedMood)) {
      setJournalMood(detectedMood);
      if (profile.consentCamera) {
        const now = Date.now();
        const last = lastAutoEntryRef.current;
        const shouldLog =
          !last ||
          last.mood !== detectedMood ||
          now - last.timestamp > 5 * 60 * 1000;
        if (shouldLog) {
          (async () => {
            let messageSet = false;
            try {
              const created = await addMoodEntry({
                mood: detectedMood as MoodTag,
                source: "camera",
              });
              lastAutoEntryRef.current = {
                mood: created.mood,
                timestamp: now,
              };
              setJournalMessage("Mood dari kamera tersimpan otomatis 📸");
              messageSet = true;
            } catch (error) {
              console.warn("Auto mood entry failed", error);
            } finally {
              if (messageSet) {
                window.setTimeout(() => setJournalMessage(null), 2500);
              }
            }
          })();
        }
      }
    }
  }, [detectedMood, profile.consentCamera, addMoodEntry]);

  const assistantName = useMemo(
    () => profile.nickname.trim() || "teman",
    [profile.nickname]
  );

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }
    if (escalation) {
      return;
    }

    setLastError(null);
    setInputValue("");
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    const conversation = [...messages, userMessage];
    const truncated = conversation.slice(-12);

    const payload = {
      messages: truncated.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      })),
      profile,
      detectedMood,
      profileId: profileId ?? undefined,
    };

    try {
      const response = await fetch("/api/mirror-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.error || "Mirror lagi kesulitan menjawab");
      }

      const data = (await response.json()) as {
        message: string;
        meta?: { action?: string; ruleId?: string; guidance?: string };
      };
      if (data.meta?.action === "warn") {
        setSafetyNotice(
          data.meta.guidance ||
            "Mirror akan menjawab dengan ekstra hati-hati dan siap membantu kamu terhubung ke manusia."
        );
      }
      if (data.meta?.action === "escalate") {
        setEscalation({
          ruleId: data.meta.ruleId,
          guidance: data.meta.guidance,
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error: any) {
      console.error(error);
      setLastError(error?.message || "Mirror lagi kesulitan menjawab");
    } finally {
      setIsSending(false);
    }
  }, [inputValue, messages, profile, detectedMood, escalation]);

  const handleQuickReply = (text: string) => {
    setInputValue(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleJournalSave = async () => {
    try {
      await addMoodEntry({ mood: journalMood, note: journalNote, source: "manual" });
      setJournalMessage("Terima kasih sudah refleksi, catatanmu tersimpan 🌈");
      setJournalNote("");
    } catch (error: any) {
      setJournalMessage(error?.message || "Gagal menyimpan mood");
    } finally {
      window.setTimeout(() => setJournalMessage(null), 2500);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-20">
      <header className="glass-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="badge inline-flex items-center gap-2 bg-white/15 text-xs text-white/80">
            <Sparkles className="h-4 w-4 text-accent" /> Chat Playground
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-gradient">
            Kita curhat santai aja ya, {assistantName}! 💜
          </h1>
          <p className="text-sm text-white/80 sm:text-base">
            Ini versi demo Mirror. Pesanmu dikirim ke model gpt-4.1 mini dari OpenAI, jadi kamu sudah bisa merasakan empatinya.
          </p>
          {(profile.mbtiType ||
            profile.enneagramType ||
            profile.primaryArchetype ||
            profile.zodiacSign) && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
              {profile.mbtiType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1">
                  MBTI {profile.mbtiType}
                </span>
              )}
              {profile.enneagramType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1">
                  Enneagram {profile.enneagramType}
                </span>
              )}
              {profile.primaryArchetype && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 capitalize">
                  {profile.primaryArchetype} archetype
                </span>
              )}
              {profile.zodiacSign && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 capitalize">
                  Zodiak {profile.zodiacSign}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/45 hover:bg-white/10"
          onClick={onReset}
        >
          Ulangi onboarding 🔁
        </button>
      </header>

      <div className="glass-panel flex min-h-[720px] flex-col gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <HeartHandshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Mirror</p>
              <p className="text-xs text-white/65">Always listening with empathy 💞</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/65">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              On-line
            </span>
            {detectedMood ? (
              <span className="rounded-full bg-white/10 px-3 py-1">
                Mood kamera: {detectedMood}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1">
                {profile.consentCamera
                  ? "Aku akan menebak moodmu dari ekspresi 😊"
                  : "Aktifkan kamera kalau mau kubaca ekspresi kamu"}
              </span>
            )}
          </div>
        </div>

        {safetyNotice && (
          <SafetyBanner
            message={safetyNotice}
            onDismiss={() => setSafetyNotice(null)}
          />
        )}
        {escalation && (
          <SafetyBanner
            variant="alert"
            message="Mirror lagi nyambungin kamu ke tim support manusia. Ketuk tombol di bawah kalau sudah siap."
          />
        )}

        <EmotionSection
          enabled={cameraEnabled}
          onToggle={setCameraEnabled}
          onMoodChange={setDetectedMood}
          consentGiven={profile.consentCamera}
        />

        <div className="scroll-smooth space-y-4 overflow-y-auto pr-2 flex-1">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`max-w-md rounded-3xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
                message.role === "assistant"
                  ? "bg-white/15 text-white/90 backdrop-blur"
                  : "ml-auto bg-accent/80 text-white"
              }`}
            >
              {message.content}
            </motion.div>
          ))}
          {isSending && (
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Loader2 className="h-4 w-4 animate-spin" /> Mirror lagi mikir buat kamu...
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 sm:text-sm"
                onClick={() => handleQuickReply(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-3">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesanmu..."
              className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/50 focus:outline-none sm:text-base"
              disabled={isSending || Boolean(escalation)}
            />
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              type="button"
              onClick={handleSend}
              disabled={isSending || !inputValue.trim() || Boolean(escalation)}
            >
              <Wand2 className="h-4 w-4" /> Kirim
            </button>
          </div>
          {lastError && (
            <p className="text-xs text-rose-200">
              {lastError} Coba lagi sebentar ya 💛
            </p>
          )}
          <MoodJournalCard
            entries={journalEntries}
            mood={journalMood}
            note={journalNote}
            onMoodChange={setJournalMood}
            onNoteChange={setJournalNote}
            onSave={handleJournalSave}
            feedback={journalMessage}
            status={journalStatus}
            error={journalError}
            detectedMood={detectedMood}
          />
          {escalation && (
            <HumanHandoffCard
              guidance={escalation.guidance}
              onConnect={() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                      "Halo, aku Nara dari tim support manusia Mirror. Aku udah baca ceritamu tadi. Yuk kita atur sesi cepat 1:1 biar kamu nggak sendirian. Aku akan hubungi kamu lewat email yang terdaftar sebentar lagi, ya 💛",
                  },
                ]);
                setEscalation(null);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function buildIntroMessages(profile: MirrorProfile): ChatMessage[] {
  const nickname = profile.nickname || "teman Mirror";
  const focus = profile.focusAreas.slice(0, 2).join(" & ");
  const personaBits = [
    profile.mbtiType ? `tipe MBTI ${profile.mbtiType}` : null,
    profile.enneagramType ? `Enneagram ${profile.enneagramType}` : null,
    profile.primaryArchetype ? `archetype ${profile.primaryArchetype}` : null,
    profile.zodiacSign ? `vibe zodiak ${profile.zodiacSign}` : null,
  ].filter(Boolean);
  const notes = profile.personalityNotes?.trim();

  return [
    {
      id: "intro-1",
      role: "assistant",
      content: `Hai ${nickname}! ✨ Aku senang banget kamu mampir. Aku siap nemenin kamu ngobrol soal ${
        focus || "apa pun yang lagi kamu rasain"
      }.`,
    },
    {
      id: "intro-2",
      role: "assistant",
      content:
        "Kalau mau mulai, tarik napas dulu ya... Tarik pelan... buang. Mirror di sini buat kamu, nggak ada judgement sama sekali. 💜",
    },
    {
      id: "intro-3",
      role: "assistant",
      content: personaBits.length
        ? `Aku udah nyimpen vibe kamu (${personaBits.join(", ")}). ${
            profile.moodBaseline === "bersemangat"
              ? "Kalau energinya lagi tinggi tapi hati butuh ditenangin, tinggal bilang ya."
              : profile.moodBaseline === "lelah"
              ? "Kita jalan pelan aja, aku akan kasih struktur biar kamu nggak kewalahan."
              : "Kita keep space yang tenang dan mindful bareng-bareng ya."
          }${notes ? ` Aku juga inget catatanmu: ${notes}.` : ""}`
        : "Belum banyak catatan soal profilmu, jadi bebas banget buat cerita apa pun yang penting buat kamu ya.",
    },
  ];
}

type EmotionSectionProps = {
  enabled: boolean;
  consentGiven: boolean;
  onToggle: (value: boolean) => void;
  onMoodChange: (mood: string | null) => void;
};

function EmotionSection({
  enabled,
  consentGiven,
  onToggle,
  onMoodChange,
}: EmotionSectionProps) {
  if (!consentGiven) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/70">
        <div className="flex items-center gap-3">
          <CameraOff className="h-5 w-5" />
          Kamera tidak diaktifkan. Kamu bisa mengizinkan Mirror membaca ekspresimu saat onboarding bila merasa nyaman. 💫
        </div>
      </div>
    );
  }

  return (
    <EmotionWatcher
      enabled={enabled}
      consentGiven={consentGiven}
      onToggle={onToggle}
      onMoodChange={onMoodChange}
    />
  );
}

type MoodJournalCardProps = {
  entries: MoodEntry[];
  mood: MoodTag;
  note: string;
  onMoodChange: (value: MoodTag) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
  feedback: string | null;
  status: "idle" | "loading" | "error";
  error: string | null;
  detectedMood: string | null;
};

const moodOptions: Array<{ label: string; value: MoodTag; emoji: string }> = [
  { label: "Tenang", value: "tenang", emoji: "🌤️" },
  { label: "Ceria", value: "ceria", emoji: "🌈" },
  { label: "Lelah", value: "lelah", emoji: "😴" },
  { label: "Cemas", value: "cemas", emoji: "😰" },
  { label: "Sedih", value: "sedih", emoji: "🌧️" },
];

function MoodJournalCard({
  entries,
  mood,
  note,
  onMoodChange,
  onNoteChange,
  onSave,
  feedback,
  status,
  error,
  detectedMood,
}: MoodJournalCardProps) {
  const cameraMood = detectedMood && isMoodTag(detectedMood) ? detectedMood : null;
  return (
    <div className="rounded-3xl border border-white/15 bg-white/8 p-4 text-sm text-white/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-white/90">
          Catat mood kamu barusan ✍️
        </p>
        {(feedback || error) && (
          <span className={`text-xs ${error ? "text-rose-200" : "text-emerald-200"}`}>
            {error || feedback}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={mood}
          onChange={(event) =>
            onMoodChange(event.target.value as MoodTag)
          }
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 focus:border-white/40 focus:outline-none"
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.emoji} {option.label}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Catatan singkat (opsional)"
          className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        />
        <button
          type="button"
              onClick={onSave}
            disabled={status === "loading"}
            className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Menyimpan..." : "Simpan mood"}
          </button>
        </div>
      <div className="mt-3 space-y-2 text-xs text-white/60">
        {status === "loading" && entries.length === 0 && (
          <p>Sedang memuat jurnal mood kamu...</p>
        )}
        {entries.length === 0 && status !== "loading" && (
          <p>Belum ada catatan mood tersimpan. Mulai dengan satu catatan kecil di atas ya 💜</p>
        )}
        {entries.slice(0, 6).map((entry) => (
          <li
            key={entry.id}
            className="list-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-base">
                  {moodOptions.find((o) => o.value === entry.mood)?.emoji ?? "🫧"}
                </span>
                <span className="capitalize text-white/85">{entry.mood}</span>
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
                {entry.source === "camera"
                  ? "kamera"
                  : entry.source === "imported"
                  ? "sinkron"
                  : "manual"}
              </span>
            </div>
            {entry.note && (
              <p className="mt-1 text-white/70">{entry.note}</p>
            )}
            <p className="mt-1 text-[0.7rem] text-white/50">
              {formatTimestamp(entry.timestamp)}
            </p>
          </li>
        ))}
      </div>
      {cameraMood && (
        <p className="mt-3 text-[0.7rem] text-white/50">
          Mood kamera terbaru: <span className="capitalize text-white/80">{cameraMood}</span>. Kamu bisa edit sebelum disimpan atau tambahkan catatan manual.
        </p>
      )}
    </div>
  );
}

function isMoodTag(value: string): value is MoodTag {
  return ["tenang", "ceria", "lelah", "cemas", "sedih"].includes(value);
}

function formatTimestamp(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function SafetyBanner({
  message,
  variant = "info",
  onDismiss,
}: {
  message: string;
  variant?: "info" | "alert";
  onDismiss?: () => void;
}) {
  const baseColor =
    variant === "alert"
      ? "border-rose-400/50 bg-rose-400/15 text-rose-100"
      : "border-white/15 bg-white/10 text-white/80";
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-xs ${baseColor}`}
    >
      <p className="leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-white/20 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/40 hover:bg-white/10"
        >
          Tutup
        </button>
      )}
    </div>
  );
}

function HumanHandoffCard({
  guidance,
  onConnect,
}: {
  guidance?: string;
  onConnect: () => void;
}) {
  return (
    <div className="rounded-3xl border border-amber-300/40 bg-amber-300/15 p-5 text-sm text-amber-100">
      <h4 className="text-base font-semibold text-white/90">
        Tim manusia Mirror lagi standby 🌟
      </h4>
      <p className="mt-2 text-white/75">
        {guidance
          ? guidance
          : "Untuk situasi seintens ini, kita lebih aman ngobrol bareng manusia. Tim support Mirror siap bantu kamu langsung."}
      </p>
      <button
        type="button"
        onClick={onConnect}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
      >
        Hubungkan ke support manusia
      </button>
    </div>
  );
}

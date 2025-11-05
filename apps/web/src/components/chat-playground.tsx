"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  onReset: () => void;
};

export function ChatPlayground({ profile, profileId, onReset }: ChatPlaygroundProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    buildIntroMessages(profile)
  );
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const { entries: journalEntries, addEntry: addMoodEntry } = useMoodJournal(
    profileId
  );
  const [journalMood, setJournalMood] = useState<MoodTag>("tenang");
  const [journalNote, setJournalNote] = useState("");
  const [journalMessage, setJournalMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessages(buildIntroMessages(profile));
    setLastError(null);
    setDetectedMood(null);
    setInputValue("");
  }, [profile.nickname, profile.focusAreas.join(",")]);

  useEffect(() => {
    setCameraEnabled(profile.consentCamera);
    if (!profile.consentCamera) {
      setDetectedMood(null);
    }
  }, [profile.consentCamera]);

  const assistantName = useMemo(
    () => profile.nickname.trim() || "teman",
    [profile.nickname]
  );

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
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

      const data = (await response.json()) as { message: string };
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
  }, [inputValue, messages, profile, detectedMood]);

  const handleQuickReply = (text: string) => {
    setInputValue(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleJournalSave = () => {
    addMoodEntry({ mood: journalMood, note: journalNote });
    setJournalMessage("Terima kasih sudah refleksi, catatanmu tersimpan 🌈");
    setJournalNote("");
    setTimeout(() => setJournalMessage(null), 2500);
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
            Ini versi demo Mirror. Pesanmu dikirim ke model gpt-5 nano dari OpenAI, jadi kamu sudah bisa merasakan empatinya.
          </p>
        </div>
        <button
          className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/45 hover:bg-white/10"
          onClick={onReset}
        >
          Ulangi onboarding 🔁
        </button>
      </header>

      <div className="glass-panel grid h-[600px] grid-rows-[auto_auto_1fr_auto] gap-4 p-6 sm:p-8">
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

        <EmotionSection
          enabled={cameraEnabled}
          onToggle={setCameraEnabled}
          onMoodChange={setDetectedMood}
          consentGiven={profile.consentCamera}
        />

        <div className="scroll-smooth space-y-4 overflow-y-auto pr-2">
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
              disabled={isSending}
            />
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              type="button"
              onClick={handleSend}
              disabled={isSending || !inputValue.trim()}
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
          />
        </div>
      </div>
    </section>
  );
}

function buildIntroMessages(profile: MirrorProfile): ChatMessage[] {
  const nickname = profile.nickname || "teman Mirror";
  const focus = profile.focusAreas.slice(0, 2).join(" & ");
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
}: MoodJournalCardProps) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/8 p-4 text-sm text-white/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-white/90">
          Catat mood kamu barusan ✍️
        </p>
        {feedback && (
          <span className="text-xs text-emerald-200">{feedback}</span>
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
          className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5"
        >
          Simpan mood
        </button>
      </div>
      {entries.length > 0 && (
        <ul className="mt-3 space-y-2 text-xs text-white/60">
          {entries.slice(0, 4).map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span>
                {moodOptions.find((o) => o.value === entry.mood)?.emoji}{" "}
                {entry.mood}
              </span>
              <span>
                {new Date(entry.timestamp).toLocaleString("id-ID", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, Wand2 } from "lucide-react";
import { MirrorProfile } from "@/hooks/useMirrorProfile";

const demoQuickReplies = [
  "Aku lagi cemas soal kuliah 😥",
  "Bisa temenin aku meditasi sebentar? 🧘",
  "Tolong rangkum percakapan kita ya ✨"
];

type ChatPlaygroundProps = {
  profile: MirrorProfile;
  onReset: () => void;
};

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  mood?: "calm" | "warm" | "excited";
};

export function ChatPlayground({ profile, onReset }: ChatPlaygroundProps) {
  const [inputValue, setInputValue] = useState("");

  const messages = useMemo<ChatMessage[]>(() => {
    const nickname = profile.nickname || "teman Mirror";
    const focus = profile.focusAreas.slice(0, 2).join(" & ");
    return [
      {
        id: "m-1",
        role: "bot",
        mood: "warm",
        content: `Hai ${nickname}! ✨ Aku senang banget bisa ada di sini. Aku sudah siap dengerin cerita kamu dan bantu dari sisi ${focus || "hidupmu"}.`
      },
      {
        id: "m-2",
        role: "bot",
        mood: "calm",
        content: "Aku lagi nyari napas bareng kamu dulu ya... tarik nafas yang dalaaaam 🫶 Hembuskan perlahan. Gimana rasanya?"
      },
      {
        id: "m-3",
        role: "user",
        content: "Aku masih tegang sih, tapi udah mulai merasa didengerin."
      },
      {
        id: "m-4",
        role: "bot",
        mood: "warm",
        content: "Terima kasih udah cerita. Aku di sini untuk nemenin kamu. Mau coba latihan grounding 5-4-3-2-1 bareng Mirror?"
      }
    ];
  }, [profile.nickname, profile.focusAreas]);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-20">
      <header className="glass-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="badge inline-flex items-center gap-2 bg-white/15 text-xs text-white/80">
            <Sparkles className="h-4 w-4 text-accent" /> Chat Playground
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-gradient">
            Selamat datang di ruang curhatmu, {profile.nickname || "teman"}! 💜
          </h1>
          <p className="text-sm text-white/80 sm:text-base">
            Ini simulasi obrolan untuk merasakan alur Mirror. Versi penuh akan terhubung ke AI empatik dan psikolog sungguhan.
          </p>
        </div>
        <button
          className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/45 hover:bg-white/10"
          onClick={onReset}
        >
          Ulangi onboarding 🔁
        </button>
      </header>

      <div className="glass-panel grid h-[560px] grid-rows-[auto_1fr_auto] gap-4 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <HeartHandshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Mirror</p>
              <p className="text-xs text-white/65">Always listening with empathy 💞</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/65">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              On-line
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">Mood radar aktif 📡</span>
          </div>
        </div>

        <div className="scroll-smooth space-y-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`max-w-md rounded-3xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
                message.role === "bot"
                  ? "bg-white/15 text-white/90 backdrop-blur"
                  : "ml-auto bg-accent/80 text-white"
              }`}
            >
              {message.content}
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {demoQuickReplies.map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 sm:text-sm"
                onClick={() => setInputValue(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-3">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ketik pesanmu... (versi demo belum mengirim pesan ya)"
              className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/50 focus:outline-none sm:text-base"
            />
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5c4bff] transition-transform hover:-translate-y-0.5 sm:text-sm"
              type="button"
              onClick={() => setInputValue("")}
            >
              <Wand2 className="h-4 w-4" /> Kirim (segera)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

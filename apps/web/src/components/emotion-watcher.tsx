"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Video, VideoOff } from "lucide-react";

type EmotionWatcherProps = {
  enabled: boolean;
  consentGiven: boolean;
  onToggle: (value: boolean) => void;
  onMoodChange: (mood: string | null) => void;
};

export function EmotionWatcher({
  enabled,
  consentGiven,
  onToggle,
  onMoodChange,
}: EmotionWatcherProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      stopCamera();
      return;
    }

    if (!consentGiven) {
      onToggle(false);
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        setStatus("loading");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("active");
        onMoodChange("ceria");
      } catch (error: any) {
        console.error("camera error", error);
        setStatus("error");
        setErrorMessage(error?.message || "Gagal mengakses kamera");
        onToggle(false);
      }
    }

    start();

    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, consentGiven]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    onMoodChange(null);
  };

  if (!consentGiven) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/70">
        <div className="flex items-center gap-3">
          <VideoOff className="h-5 w-5" />
          Kamera belum diizinkan. Kamu bisa mengaktifkannya dari onboarding kapan pun.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-4 text-white/80">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <span className="inline-flex items-center gap-2">
          <Video className="h-4 w-4" /> Emotion Radar (preview)
        </span>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className="rounded-full border border-white/20 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-white/70 transition-colors hover:border-white/40 hover:bg-white/10"
        >
          {enabled ? "Matikan" : "Aktifkan"}
        </button>
      </div>
      <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        {status === "active" && (
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        )}
        {status === "loading" && (
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" /> Menyiapkan kamera...
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-xs text-rose-200">
            <VideoOff className="h-4 w-4" /> {errorMessage}
          </div>
        )}
        {status === "idle" && (
          <div className="text-xs text-white/60">Kamera nonaktif</div>
        )}
      </div>
      <p className="text-xs text-white/60">
        Versi preview belum membaca ekspresi secara otomatis. Mirror akan mengingatkan kamu untuk refleksi suasana hati secara manual.
      </p>
    </div>
  );
}

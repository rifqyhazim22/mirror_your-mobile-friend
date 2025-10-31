"use client";

import { useEffect, useRef, useState } from "react";
import Human from "@vladmandic/human";
import { Loader2, Video, VideoOff } from "lucide-react";

const human = new Human({
  backend: "webgl",
  cacheSensitivity: 0,
  face: { enabled: true, detector: { rotation: true }, emotion: { enabled: true } },
  body: { enabled: false },
  hand: { enabled: false },
  gesture: { enabled: false },
  object: { enabled: false },
  verbose: false,
});

const emotionsOrder = [
  "happy",
  "neutral",
  "sad",
  "angry",
  "fear",
  "disgust",
  "surprise",
];

type EmotionWatcherProps = {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  onMoodChange: (mood: string | null) => void;
};

export function EmotionWatcher({ enabled, onToggle, onMoodChange }: EmotionWatcherProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled) {
      stopWatcher();
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        setStatus("loading");
        if (!human.initialized) {
          await human.load();
          await human.warmup();
        }

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
        detectLoop();
      } catch (error: any) {
        console.error("emotion watcher", error);
        setStatus("error");
        setErrorMessage(error?.message || "Gagal mengakses kamera");
        onToggle(false);
      }
    };

    setup();

    return () => {
      cancelled = true;
      stopWatcher();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const stopWatcher = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
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

  const detectLoop = async () => {
    if (!videoRef.current || !enabled) return;
    const result = await human.detect(videoRef.current);
    if (result.face?.length) {
      const face = result.face[0];
      if (face.emotion?.length) {
        const sorted = [...face.emotion].sort((a, b) => b.score - a.score);
        const best = sorted.find((emotion) => emotion.score > 0.2) ?? sorted[0];
        const label = best?.emotion;
        if (label) {
          onMoodChange(mapEmotionToLabel(label));
        }
      }
    }
    animationRef.current = requestAnimationFrame(detectLoop);
  };

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-4 text-white/80">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <span className="inline-flex items-center gap-2">
          <Video className="h-4 w-4" /> Emotion Radar
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
            <Loader2 className="h-4 w-4 animate-spin" /> Menyiapkan radar emosi...
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
        Mirror hanya membaca ekspresi kamu secara lokal di perangkat ini. Tidak ada video yang dikirim ke server.
      </p>
    </div>
  );
}

function mapEmotionToLabel(emotion: string) {
  switch (emotion) {
    case "happy":
      return "ceria";
    case "sad":
      return "sedih";
    case "angry":
      return "kesal";
    case "fear":
      return "cemas";
    case "disgust":
      return "tidak nyaman";
    case "surprise":
      return "terkejut";
    default:
      return "tenang";
  }
}

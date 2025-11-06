"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type MoodTag = "tenang" | "ceria" | "lelah" | "cemas" | "sedih";
export type MoodEntrySource = "manual" | "camera" | "imported";

export type MoodEntry = {
  id: string;
  timestamp: string;
  mood: MoodTag;
  note?: string | null;
  source: MoodEntrySource;
};

type JournalStatus = "idle" | "loading" | "error";

export function useMoodJournal(
  profileId?: string | null,
  authToken?: string | null,
  onUnauthorized?: () => void,
) {
  const apiBase = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_MIRROR_API_URL || "http://localhost:3001/v1";
    return base.replace(/\/$/, "");
  }, []);

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [status, setStatus] = useState<JournalStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId || !authToken) {
      setEntries([]);
      return;
    }
    const controller = new AbortController();
    const load = async () => {
      try {
        setStatus("loading");
        const response = await fetch(
          `${apiBase}/profiles/${profileId}/mood-entries`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            onUnauthorized?.();
          }
          throw new Error("Gagal memuat mood journal");
        }
        const payload = (await response.json()) as Array<Record<string, any>>;
        setEntries(payload.map(normalizeMoodEntry));
        setStatus("idle");
        setError(null);
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.warn(err);
        setStatus("error");
        setError(err?.message || "Gagal memuat mood journal");
      }
    };
    load();
    return () => controller.abort();
  }, [apiBase, profileId, authToken, onUnauthorized]);

  const addEntry = useCallback(
    async (entry: { mood: MoodTag; note?: string; source?: MoodEntrySource }) => {
      if (!profileId || !authToken) {
        throw new Error("Profile belum tersimpan");
      }
      const response = await fetch(
        `${apiBase}/profiles/${profileId}/mood-entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            mood: entry.mood,
            note: entry.note?.trim() || null,
            source: entry.source ?? "manual",
          }),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized?.();
        }
        throw new Error("Gagal menyimpan mood entry");
      }
      const createdPayload = (await response.json()) as Record<string, any>;
      const created = normalizeMoodEntry(createdPayload);
      setEntries((prev) => [created, ...prev].slice(0, 30));
      return created;
    },
    [apiBase, profileId, authToken, onUnauthorized]
  );

  return {
    entries,
    status,
    error,
    addEntry,
  };
}

const allowedMoodTags: MoodTag[] = ["tenang", "ceria", "lelah", "cemas", "sedih"];

function normalizeMoodEntry(payload: Record<string, any>): MoodEntry {
  const rawMood = typeof payload.mood === "string" ? payload.mood.toLowerCase() : "tenang";
  const mood = allowedMoodTags.includes(rawMood as MoodTag)
    ? (rawMood as MoodTag)
    : "tenang";
  const timestamp =
    typeof payload.timestamp === "string"
      ? payload.timestamp
      : typeof payload.createdAt === "string"
      ? payload.createdAt
      : new Date().toISOString();
  const source =
    typeof payload.source === "string" && ["manual", "camera", "imported"].includes(payload.source)
      ? (payload.source as MoodEntrySource)
      : "manual";
  return {
    id:
      typeof payload.id === "string"
        ? payload.id
        : typeof payload.id === "number"
        ? String(payload.id)
        : (typeof globalThis.crypto !== "undefined" &&
            typeof globalThis.crypto.randomUUID === "function"
            ? globalThis.crypto.randomUUID()
            : `mood-${Math.random().toString(16).slice(2)}`),
    timestamp,
    mood,
    note: typeof payload.note === "string" && payload.note.length > 0 ? payload.note : null,
    source,
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type MoodTag = "tenang" | "ceria" | "lelah" | "cemas" | "sedih";

export type MoodEntry = {
  id: string;
  timestamp: string;
  mood: MoodTag;
  note?: string;
};

const JOURNAL_STORAGE_KEY = "mirror-mood-journal";

function buildKey(profileId?: string | null) {
  return profileId ? `${JOURNAL_STORAGE_KEY}:${profileId}` : JOURNAL_STORAGE_KEY;
}

export function useMoodJournal(profileId?: string | null) {
  const storageKey = useMemo(() => buildKey(profileId), [profileId]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as MoodEntry[];
        setEntries(parsed);
      }
    } catch (error) {
      console.warn("Failed to load mood journal", error);
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, storageKey, hydrated]);

  const addEntry = useCallback((entry: Omit<MoodEntry, "id" | "timestamp">) => {
    const newEntry: MoodEntry = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
      mood: entry.mood,
      note: entry.note?.trim() || undefined,
    };
    setEntries((prev) => [newEntry, ...prev].slice(0, 30));
    return newEntry;
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    entries,
    addEntry,
    clearAll,
  };
}

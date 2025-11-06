"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MoodEntry, MoodEntrySource, MoodTag } from "./useMoodJournal";

export type MoodSummary = {
  period: {
    from: string;
    to: string;
  };
  lookbackDays: number;
  totalEntries: number;
  dominantMood: string | null;
  streakDays: number;
  moodTotals: Record<string, number>;
  averageDailyEntries: number;
  lastEntry: (MoodEntry & { profileId?: string }) | null;
  dailySeries: Array<{
    date: string;
    total: number;
    dominantMood: string | null;
    moods: Array<{ mood: string; count: number }>;
  }>;
  insight: {
    tone: "neutral" | "grounding" | "uplifting" | "balanced";
    message: string;
    suggestions: string[];
  };
};

type SummaryStatus = "idle" | "loading" | "error";

export function useMoodSummary(
  profileId?: string | null,
  authToken?: string | null,
  onUnauthorized?: () => void
) {
  const apiBase = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_MIRROR_API_URL || "http://localhost:3001/v1";
    return base.replace(/\/$/, "");
  }, []);

  const [summary, setSummary] = useState<MoodSummary | null>(null);
  const [status, setStatus] = useState<SummaryStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profileId || !authToken) {
      return;
    }
    try {
      setStatus("loading");
      setError(null);
      const response = await fetch(
        `${apiBase}/profiles/${profileId}/mood-entries/summary`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized?.();
        }
        throw new Error("Gagal memuat ringkasan mood");
      }
      const payload = (await response.json()) as Record<string, any>;
      setSummary(normalizeSummary(payload));
      setStatus("idle");
    } catch (err: any) {
      console.warn(err);
      setError(err?.message || "Gagal memuat ringkasan mood");
      setStatus("error");
    }
  }, [apiBase, profileId, authToken, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    summary,
    status,
    error,
    reload: load,
  };
}

function normalizeSummary(payload: Record<string, any>): MoodSummary {
  return {
    period: {
      from: String(payload?.period?.from ?? ""),
      to: String(payload?.period?.to ?? ""),
    },
    lookbackDays: Number(payload?.lookbackDays ?? 0),
    totalEntries: Number(payload?.totalEntries ?? 0),
    dominantMood: payload?.dominantMood ?? null,
    streakDays: Number(payload?.streakDays ?? 0),
    moodTotals: payload?.moodTotals ?? {},
    averageDailyEntries: Number(payload?.averageDailyEntries ?? 0),
    lastEntry: payload?.lastEntry ? normalizeEntry(payload.lastEntry) : null,
    dailySeries: Array.isArray(payload?.dailySeries)
      ? payload.dailySeries.map((series: Record<string, any>) => ({
          date: String(series?.date ?? ""),
          total: Number(series?.total ?? 0),
          dominantMood: series?.dominantMood ?? null,
          moods: Array.isArray(series?.moods)
            ? series.moods.map((m: Record<string, any>) => ({
                mood: String(m?.mood ?? ""),
                count: Number(m?.count ?? 0),
              }))
            : [],
        }))
      : [],
    insight: {
      tone: normalizeTone(payload?.insight?.tone),
      message: String(payload?.insight?.message ?? ""),
      suggestions: Array.isArray(payload?.insight?.suggestions)
        ? payload.insight.suggestions.map((item: any) => String(item ?? ""))
        : [],
    },
  };
}

function normalizeEntry(entry: Record<string, any>): MoodEntry & { profileId?: string } {
  return {
    id: String(entry?.id ?? ""),
    timestamp: String(entry?.timestamp ?? ""),
    mood: (entry?.mood ?? "tenang") as MoodTag,
    note: entry?.note ?? null,
    source: normalizeSource(entry?.source),
    profileId: entry?.profileId ? String(entry.profileId) : undefined,
  };
}

function normalizeSource(source: any): MoodEntrySource {
  const allowed: MoodEntrySource[] = ["manual", "camera", "imported"];
  return allowed.includes(source) ? source : "manual";
}

function normalizeTone(tone: any): MoodSummary["insight"]["tone"] {
  const allowed: Array<MoodSummary["insight"]["tone"]> = [
    "neutral",
    "grounding",
    "uplifting",
    "balanced",
  ];
  return allowed.includes(tone) ? tone : "neutral";
}

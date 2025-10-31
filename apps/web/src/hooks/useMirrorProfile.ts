"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type MirrorProfile = {
  nickname: string;
  focusAreas: string[];
  consentCamera: boolean;
  consentData: boolean;
  moodBaseline: "tenang" | "bersemangat" | "lelah";
};

const STORAGE_KEY = "mirror-profile";

const defaultProfile: MirrorProfile = {
  nickname: "",
  focusAreas: [],
  consentCamera: false,
  consentData: false,
  moodBaseline: "tenang",
};

export function useMirrorProfile() {
  const [profile, setProfile] = useState<MirrorProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MirrorProfile;
        setProfile({ ...defaultProfile, ...parsed });
      }
    } catch (error) {
      console.warn("Mirror profile hydration failed", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  const updateProfile = useCallback(
    (update: Partial<MirrorProfile>) => {
      setProfile((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const toggleFocusArea = useCallback((area: string) => {
    setProfile((prev) => {
      const exists = prev.focusAreas.includes(area);
      const nextFocus = exists
        ? prev.focusAreas.filter((item) => item !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: nextFocus.slice(0, 4) };
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isComplete = useMemo(() => {
    return (
      profile.nickname.trim().length >= 2 &&
      profile.focusAreas.length > 0 &&
      profile.consentData
    );
  }, [profile]);

  return {
    profile,
    updateProfile,
    toggleFocusArea,
    resetProfile,
    hydrated,
    isComplete,
  };
}

export function getDefaultProfile() {
  return defaultProfile;
}

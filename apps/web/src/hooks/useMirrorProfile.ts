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
const PROFILE_ID_KEY = "mirror-profile-id";

const defaultProfile: MirrorProfile = {
  nickname: "",
  focusAreas: [],
  consentCamera: false,
  consentData: false,
  moodBaseline: "tenang",
};

export function useMirrorProfile(
  authToken?: string | null,
  onUnauthorized?: () => void
) {
  const [profile, setProfile] = useState<MirrorProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const apiBase =
    process.env.NEXT_PUBLIC_MIRROR_API_URL ?? "http://localhost:3001/v1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MirrorProfile;
        setProfile({ ...defaultProfile, ...parsed });
      }
      const storedId = window.localStorage.getItem(PROFILE_ID_KEY);
      if (storedId) {
        setProfileId(storedId);
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

  useEffect(() => {
    if (!profileId || !authToken) {
      return;
    }
    const controller = new AbortController();
    const fetchProfile = async () => {
      try {
        setSyncStatus("loading");
        const response = await fetch(`${apiBase}/profiles/${profileId}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            onUnauthorized?.();
            throw new Error("Unauthorized");
          }
          throw new Error(`Failed to fetch profile ${profileId}`);
        }
        const data = (await response.json()) as MirrorProfile & {
          id: string;
        };
        setProfile({
          nickname: data.nickname,
          focusAreas: data.focusAreas,
          consentCamera: data.consentCamera,
          consentData: data.consentData,
          moodBaseline: data.moodBaseline,
        });
      } catch (error: any) {
        if (controller.signal.aborted) return;
        console.warn("Failed to load profile from API", error);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(PROFILE_ID_KEY);
        }
        setProfileId(null);
        if (error?.message === "Unauthorized") {
          onUnauthorized?.();
        }
      } finally {
        if (!controller.signal.aborted) {
          setSyncStatus("idle");
        }
      }
    };
    fetchProfile();
    return () => controller.abort();
  }, [apiBase, profileId, authToken, onUnauthorized]);

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
      window.localStorage.removeItem(PROFILE_ID_KEY);
    }
    setProfileId(null);
  }, []);

  const isComplete = useMemo(() => {
    return (
      profile.nickname.trim().length >= 2 &&
      profile.focusAreas.length > 0 &&
      profile.consentData
    );
  }, [profile]);

  const persistProfile = useCallback(async () => {
    if (!isComplete) {
      return null;
    }
    try {
      setSyncStatus("loading");
      if (!authToken) {
        throw new Error("Unauthenticated");
      }
      const method = profileId ? "PUT" : "POST";
      const endpoint = profileId
        ? `${apiBase}/profiles/${profileId}`
        : `${apiBase}/profiles`;
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized?.();
          throw Object.assign(new Error("Unauthorized"), { status: 401 });
        }
        throw new Error("Gagal menyimpan profil");
      }
      const data = (await response.json()) as MirrorProfile & { id: string };
      setProfile({
        nickname: data.nickname,
        focusAreas: data.focusAreas,
        consentCamera: data.consentCamera,
        consentData: data.consentData,
        moodBaseline: data.moodBaseline,
      });
      if (!profileId) {
        setProfileId(data.id);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PROFILE_ID_KEY, data.id);
        }
      }
      setSyncStatus("idle");
      return data.id;
    } catch (error: any) {
      console.error(error);
      setSyncStatus("error");
      throw error;
    }
  }, [apiBase, isComplete, profile, profileId, authToken, onUnauthorized]);

  return {
    profile,
    updateProfile,
    toggleFocusArea,
    resetProfile,
    hydrated,
    isComplete,
    profileId,
    persistProfile,
    syncStatus,
  };
}

export function getDefaultProfile() {
  return defaultProfile;
}

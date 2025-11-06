"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "mirror-auth-token";

export type AuthStatus = "idle" | "loading" | "error";

export function useMirrorSession() {
  const apiBase = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_MIRROR_API_URL || "http://localhost:3001/v1";
    return base.replace(/\/$/, "");
  }, []);
  const bypassAuth = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bypassAuth) {
      setToken("bypass-token");
      return;
    }
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
    }
  }, [bypassAuth]);

  const login = useCallback(
    async (code: string) => {
      if (bypassAuth) {
        setToken("bypass-token");
        setStatus("idle");
        setError(null);
        return;
      }
      setStatus("loading");
      setError(null);
      try {
        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          throw new Error(detail?.message || "Kode akses salah");
        }
        const data = (await response.json()) as { accessToken: string };
        if (typeof window !== "undefined") {
          window.localStorage.setItem(TOKEN_KEY, data.accessToken);
        }
        setToken(data.accessToken);
        setStatus("idle");
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Gagal login");
        setStatus("error");
        throw err;
      }
    },
    [apiBase]
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    status,
    error,
    login,
    logout,
  };
}

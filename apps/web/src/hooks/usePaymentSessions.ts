"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type PaymentSession = {
  id: string;
  planId: string;
  status: string;
  amount: number;
  currency: string;
  checkoutUrl?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  metadata?: Record<string, unknown>;
  provider?: string;
  providerReference?: string | null;
};

type PaymentStatus = "idle" | "loading" | "error";

export function usePaymentSessions(
  authToken?: string | null,
  onUnauthorized?: () => void
) {
  const apiBase = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_MIRROR_API_URL || "http://localhost:3001/v1";
    return base.replace(/\/$/, "");
  }, []);

  const [sessions, setSessions] = useState<PaymentSession[]>([]);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!authToken) {
      setSessions([]);
      return;
    }
    const controller = new AbortController();
    try {
      setStatus("loading");
      setError(null);
      const response = await fetch(`${apiBase}/payments/sessions`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: controller.signal,
      });
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized?.();
        }
        throw new Error("Gagal memuat riwayat pembayaran");
      }
      const data = (await response.json()) as PaymentSession[];
      setSessions(data);
      setStatus("idle");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setSessions([]);
      setStatus("error");
      setError(err?.message || "Gagal memuat riwayat pembayaran");
    }
    return () => controller.abort();
  }, [apiBase, authToken, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    void load();
  }, [load]);

  const markPaid = useCallback(
    async (sessionId: string, adminSecret?: string) => {
      if (!authToken) {
        throw new Error("Belum login");
      }
      const response = await fetch(`${apiBase}/payments/sessions/${sessionId}/mark-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          ...(adminSecret ? { "x-payments-admin-secret": adminSecret } : {}),
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized?.();
        }
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.message || "Gagal menandai sesi sebagai selesai");
      }
      await load();
      return response.json().catch(() => ({}));
    },
    [apiBase, authToken, load, onUnauthorized]
  );

  return {
    sessions,
    status,
    error,
    refresh,
    markPaid,
  };
}

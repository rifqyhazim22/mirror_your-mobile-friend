import { Injectable } from "@nestjs/common";
import type { CreateSessionDto } from "./dto/create-session.dto";

export type PaymentSession = {
  id: string;
  url: string;
  expiresAt: string;
  amount: number;
  currency: string;
  status: "draft" | "ready";
};

@Injectable()
export class PaymentsService {
  async createCheckoutSession(dto: CreateSessionDto, ownerId: string): Promise<PaymentSession> {
    const fakeAmount = dto.priceId === "mirror-premium-monthly" ? 499000 : 199000;
    return {
      id: `mock_session_${Date.now()}`,
      url: `${dto.successUrl}?session=mock-${Date.now()}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      amount: fakeAmount,
      currency: "IDR",
      status: "ready",
    };
  }

  async listPlans() {
    return [
      {
        id: "mirror-premium-monthly",
        name: "Mirror Premium Bulanan",
        amount: 499000,
        currency: "IDR",
        benefits: [
          "Sesi chat AI tanpa batas",
          "Insight mingguan + konten coping premium",
          "1x konsultasi psikolog partner setiap bulan",
        ],
      },
      {
        id: "mirror-lite-weekly",
        name: "Mirror Lite 7 Hari",
        amount: 199000,
        currency: "IDR",
        benefits: [
          "Full akses sandbox",
          "Mood insight & jurnal sinkron",
          "Diskon 10% sesi psikolog tambahan",
        ],
      },
    ];
  }
}

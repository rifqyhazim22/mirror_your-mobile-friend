import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
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
  constructor(private readonly prisma: PrismaService) {}

  async createCheckoutSession(dto: CreateSessionDto, ownerId: string): Promise<PaymentSession> {
    const fakeAmount = dto.priceId === "mirror-premium-monthly" ? 499000 : 199000;
    const created = await this.prisma.paymentSession.create({
      data: {
        ownerId,
        planId: dto.priceId,
        amount: fakeAmount,
        status: "ready",
        checkoutUrl: `${dto.successUrl}?session=mock-${Date.now()}`,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        currency: "IDR",
        metadata: {
          isMock: true,
        },
      },
    });

    return {
      id: created.id,
      url: created.checkoutUrl ?? dto.successUrl,
      expiresAt: created.expiresAt?.toISOString() ?? "",
      amount: created.amount,
      currency: created.currency,
      status: created.status as "draft" | "ready",
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

  async listSessions(ownerId: string) {
    const sessions = await this.prisma.paymentSession.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return sessions.map((session) => ({
      id: session.id,
      planId: session.planId,
      amount: session.amount,
      currency: session.currency,
      status: session.status,
      checkoutUrl: session.checkoutUrl,
      expiresAt: session.expiresAt?.toISOString() ?? null,
      createdAt: session.createdAt.toISOString(),
      metadata: session.metadata,
    }));
  }

  async markPaid(sessionId: string, ownerId: string) {
    return this.prisma.paymentSession.updateMany({
      where: { id: sessionId, ownerId },
      data: { status: "paid" },
    });
  }
}

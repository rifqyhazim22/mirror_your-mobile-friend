import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateSessionDto } from "./dto/create-session.dto";
import {
  resolvePaymentProvider,
  type PaymentProviderSession,
} from "./providers/payment.provider";

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
  private readonly providerName: string;
  private readonly provider: {
    createCheckoutSession(
      dto: CreateSessionDto,
      context: { ownerId: string },
    ): Promise<PaymentProviderSession>;
  };

  constructor(private readonly prisma: PrismaService) {
    const resolved = resolvePaymentProvider();
    this.provider = resolved.provider;
    this.providerName = resolved.name;
  }

  async createCheckoutSession(dto: CreateSessionDto, ownerId: string): Promise<PaymentSession> {
    const fakeAmount = dto.priceId === "mirror-premium-monthly" ? 499000 : 199000;
    const providerSession = await this.provider.createCheckoutSession(dto, { ownerId });
    const created = await this.prisma.paymentSession.create({
      data: {
        ownerId,
        planId: dto.priceId,
        amount: fakeAmount,
        status: "ready",
        checkoutUrl: providerSession.checkoutUrl,
        expiresAt: providerSession.expiresAt ?? null,
        currency: "IDR",
        metadata: {
          ...(providerSession.additionalMetadata ?? {}),
          provider: this.providerName,
        },
        provider: this.providerName,
        providerReference: providerSession.providerReference ?? null,
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
      provider: session.provider,
      providerReference: session.providerReference,
    }));
  }

  async markPaid(sessionId: string, ownerId: string, adminSecret?: string) {
    const session = await this.prisma.paymentSession.findUnique({ where: { id: sessionId } });
    if (!session || session.ownerId !== ownerId) {
      throw new NotFoundException("Payment session tidak ditemukan");
    }

    if (session.provider !== "mock") {
      const configuredSecret = process.env.PAYMENTS_ADMIN_SECRET;
      if (!configuredSecret || configuredSecret !== adminSecret) {
        throw new ForbiddenException("Mark paid hanya tersedia via webhook resmi");
      }
    }

    const updated = await this.prisma.paymentSession.update({
      where: { id: sessionId },
      data: { status: "paid" },
    });

    return {
      id: updated.id,
      status: updated.status,
      provider: updated.provider,
      providerReference: updated.providerReference,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  getProviderName() {
    return this.providerName;
  }
}

import type { CreateSessionDto } from "../dto/create-session.dto";

export type PaymentProviderSession = {
  checkoutUrl: string;
  expiresAt?: Date | null;
  providerReference?: string | null;
  additionalMetadata?: Record<string, unknown>;
};

export interface PaymentProvider {
  createCheckoutSession(
    dto: CreateSessionDto,
    context: { ownerId: string }
  ): Promise<PaymentProviderSession>;
}

class MockPaymentProvider implements PaymentProvider {
  async createCheckoutSession(dto: CreateSessionDto): Promise<PaymentProviderSession> {
    return {
      checkoutUrl: `${dto.successUrl}?session=mock-${Date.now()}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      providerReference: `mock-${Math.random().toString(36).slice(2, 10)}`,
      additionalMetadata: { isMock: true },
    };
  }
}

class MidtransPaymentProvider implements PaymentProvider {
  constructor(private readonly serverKey?: string, private readonly baseUrl?: string) {}

  async createCheckoutSession(dto: CreateSessionDto): Promise<PaymentProviderSession> {
    if (!this.serverKey) {
      throw new Error(
        "Midtrans server key belum diatur. Set MIDTRANS_SERVER_KEY dan MIDTRANS_BASE_URL untuk mengaktifkan provider ini.",
      );
    }
    // Placeholder: Integrasi Midtrans Snap akan ditambahkan ketika kredensial siap.
    // Untuk saat ini kita tetap fallback menggunakan URL success agar flow tetap bisa diuji.
    return {
      checkoutUrl: dto.successUrl,
      providerReference: "midtrans-pending",
      additionalMetadata: {
        note: "Midtrans integration placeholder - belum membuat transaksi real.",
      },
    };
  }
}

export function resolvePaymentProvider(): { provider: PaymentProvider; name: string } {
  const configured = (process.env.PAYMENTS_PROVIDER ?? "mock").toLowerCase();
  if (configured === "midtrans") {
    return {
      provider: new MidtransPaymentProvider(
        process.env.MIDTRANS_SERVER_KEY,
        process.env.MIDTRANS_BASE_URL,
      ),
      name: "midtrans",
    };
  }
  return { provider: new MockPaymentProvider(), name: "mock" };
}

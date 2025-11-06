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
    const snapUrl = `${this.baseUrl ?? "https://app.sandbox.midtrans.com"}/snap/v1/transactions`;
    const grossAmount =
      typeof process.env.MIDTRANS_DEFAULT_AMOUNT === "string"
        ? Number.parseInt(process.env.MIDTRANS_DEFAULT_AMOUNT, 10)
        : undefined;

    const payload = {
      transaction_details: {
        order_id: `mirror-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        gross_amount: grossAmount ?? 100000,
      },
      callbacks: {
        finish: dto.successUrl,
      },
      metadata: {
        plan_id: dto.priceId,
      },
    };

    const response = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${this.serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Midtrans Snap request gagal (${response.status}). Detail: ${detail.substring(0, 400)}`,
      );
    }

    const data = (await response.json()) as {
      token: string;
      redirect_url: string;
    };

    return {
      checkoutUrl: data.redirect_url ?? dto.successUrl,
      providerReference: data.token,
      additionalMetadata: {
        provider_token: data.token,
        provider_redirect_url: data.redirect_url,
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

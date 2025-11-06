import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const priceId = String(formData.get("priceId") ?? "");

  if (!priceId) {
    return NextResponse.redirect(new URL("/subscribe?error=missing-plan", request.url));
  }

  try {
    const backendBase =
      process.env.NEXT_PUBLIC_MIRROR_API_URL || "http://localhost:3001/v1";

    const response = await fetch(`${backendBase.replace(/\/$/, "")}/payments/checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") ?? "",
      },
      body: JSON.stringify({
        priceId,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/subscribe/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/subscribe`,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      return NextResponse.redirect(
        new URL(`/subscribe?error=checkout-unavailable&plan=${priceId}`, request.url),
      );
    }

    const session = (await response.json()) as { url: string };
    if (!session?.url) {
      throw new Error("Invalid session payload");
    }

    return NextResponse.redirect(session.url, { status: 302 });
  } catch (error) {
    console.warn("Checkout session fallback", error);
    const fallback = new URL("/subscribe/success", request.url);
    fallback.searchParams.set("plan", priceId);
    fallback.searchParams.set("mock", "1");
    return NextResponse.redirect(fallback);
  }
}

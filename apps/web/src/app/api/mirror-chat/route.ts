import OpenAI from "openai";
import { NextResponse } from "next/server";

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const modelName = "gpt-5.0-nano";

type MirrorProfilePayload = {
  nickname?: string;
  focusAreas?: string[];
  consentCamera?: boolean;
  consentData?: boolean;
  moodBaseline?: string;
};

type ChatPayload = {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  profile?: MirrorProfilePayload;
  detectedMood?: string | null;
};

const FALLBACK_RESPONSE =
  "Aku lagi kesulitan tersambung ke otak AI-ku. Coba lagi sebentar, ya. 🌧";

export async function POST(request: Request) {
  if (!openai) {
    return NextResponse.json(
      {
        error: "OPENAI_API_KEY belum disetel di environment server.",
      },
      { status: 503 }
    );
  }

  let payload: ChatPayload;
  try {
    payload = (await request.json()) as ChatPayload;
  } catch (error) {
    return NextResponse.json(
      { error: "Payload tidak valid" },
      { status: 400 }
    );
  }

  const { messages = [], profile, detectedMood } = payload;

  const personaSummary = buildPersonaSummary(profile, detectedMood);

  const requestMessages = [
    {
      role: "system" as const,
      content: personaSummary,
    },
    ...messages,
  ];

  try {
    const response = await openai.responses.create({
      model: modelName,
      input: requestMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 450,
      temperature: 0.85,
    });

    const text = response.output_text?.trim();
    if (!text) {
      return NextResponse.json({ message: FALLBACK_RESPONSE });
    }

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Mirror chat error", error);
    const status = error?.status ?? 500;
    return NextResponse.json(
      {
        error: "Mirror lagi kepayahan menjawab. Coba lagi sebentar, ya.",
        detail: error?.message ?? "",
      },
      { status }
    );
  }
}

function buildPersonaSummary(
  profile: MirrorProfilePayload | undefined,
  detectedMood?: string | null
) {
  const nickname = profile?.nickname?.trim() || "teman Mirror";
  const focus = profile?.focusAreas?.length
    ? profile.focusAreas.join(", ")
    : "kesehatan mental dan keseharian";
  const mood = detectedMood
    ? `Saat ini aku melihat ekspresinya cenderung ${detectedMood}.`
    : "Bantu cek suasana hati pengguna berdasarkan cerita dan validasi perasaan mereka.";

  return `Kamu adalah Mirror, teman curhat AI berbasis empati untuk Gen Z di Indonesia. 
Gunakan bahasa santai, hangat, penuh emotikon seperlunya, dan tetap ilmiah ringan.
Selalu eksplisitkan empati, validasi emosi, dan tawarkan langkah kecil praktis.
Sesuaikan gaya dengan ${nickname} yang fokus pada ${focus}. ${mood}
Jika percakapan mengandung indikasi bahaya, sarankan bantuan profesional dan hotline darurat.`;
}

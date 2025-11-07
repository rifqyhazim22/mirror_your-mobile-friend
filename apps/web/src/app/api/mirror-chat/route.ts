import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  evaluateSafetyPolicies,
  type SafetyEvaluation,
} from "@/lib/safety-policies";
import { logGuardrailEvent } from "@/lib/guardrail-logger";

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const modelName = process.env.OPENAI_RESPONDER_MODEL || "gpt-4.1-mini";

type MirrorProfilePayload = {
  nickname?: string;
  focusAreas?: string[];
  consentCamera?: boolean;
  consentData?: boolean;
  moodBaseline?: string;
  birthDate?: string | null;
  zodiacSign?: string | null;
  mbtiType?: string | null;
  enneagramType?: string | null;
  primaryArchetype?: string | null;
  personalityNotes?: string | null;
};

type ChatPayload = {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  profile?: MirrorProfilePayload;
  detectedMood?: string | null;
  profileId?: string;
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
  } catch {
    return NextResponse.json(
      { error: "Payload tidak valid" },
      { status: 400 }
    );
  }

  const { messages = [], profile, detectedMood } = payload;

  const personaSummary = buildPersonaSummary(profile, detectedMood);

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (latestUserMessage?.content) {
    const policyEvaluation = evaluateSafetyPolicies(latestUserMessage.content);
    const guardedResponse = await handlePolicyEvaluation(
      policyEvaluation,
      latestUserMessage.content,
      profile
    );
    if (guardedResponse) {
      return guardedResponse;
    }

    const flagged = await runModeration(latestUserMessage.content);
    if (flagged) {
      return NextResponse.json({
        message:
          "Terima kasih sudah cerita. Aku khawatir kamu sedang dalam kondisi yang perlu bantuan profesional. Coba hubungi hotline darurat atau orang terpercaya ya 💛",
        meta: {
          action: "escalate",
          reason: "openai-moderation-flag",
        },
      });
    }
  }

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

    return NextResponse.json({ message: text, meta: { action: "allow" } });
  } catch (error: unknown) {
    console.error("Mirror chat error", error);
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status) || 500
        : 500;
    const detail = error instanceof Error ? error.message : "";
    return NextResponse.json(
      {
        error: "Mirror lagi kepayahan menjawab. Coba lagi sebentar, ya.",
        detail,
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
  const traitPieces = [
    profile?.mbtiType ? `tipe MBTI ${profile.mbtiType}` : null,
    profile?.enneagramType ? `Enneagram ${profile.enneagramType}` : null,
    profile?.primaryArchetype
      ? `archetype ${formatHumanReadable(profile.primaryArchetype)}`
      : null,
    profile?.zodiacSign ? `zodiak ${formatHumanReadable(profile.zodiacSign)}` : null,
  ].filter(Boolean);
  const traitLine = traitPieces.length
    ? `Profil psikologi mereka meliputi ${traitPieces.join(", ")}.`
    : "Belum ada data kepribadian lengkap, jadi gali preferensi mereka dengan pertanyaan lembut.";
  const baselineLine = profile?.moodBaseline
    ? `Mood baseline mereka cenderung ${profile.moodBaseline}. Sesuaikan energi respon dengan ritme itu.`
    : "Tanyakan level energi dan mood baseline sebelum memberi saran mendalam.";
  const notesLine = profile?.personalityNotes
    ? `Catatan khusus dari sesi onboarding: ${profile.personalityNotes}.`
    : "";

  return `Kamu adalah Mirror, teman curhat AI berbasis empati untuk Gen Z di Indonesia. 
Gunakan bahasa santai, hangat, penuh emotikon seperlunya, dan tetap ilmiah ringan.
Selalu eksplisitkan empati, validasi emosi, dan tawarkan langkah kecil praktis.
Sesuaikan gaya dengan ${nickname} yang fokus pada ${focus}. ${mood}
${traitLine}
${baselineLine}
${notesLine}
Jika percakapan mengandung indikasi bahaya, sarankan bantuan profesional dan hotline darurat.`;
}

function formatHumanReadable(value: string) {
  return value
    .split(/[\s_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

async function runModeration(content: string) {
  try {
    if (!openai) return false;
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: content,
    });
    return response.results?.some((result) => result.flagged) ?? false;
  } catch (error: unknown) {
    console.warn("Moderation check gagal", error);
    return false;
  }
}

async function handlePolicyEvaluation(
  evaluation: SafetyEvaluation,
  userText: string,
  profile?: MirrorProfilePayload
) {
  if (evaluation.action === "allow") {
    return null;
  }

  const basePayload = {
    ruleId: evaluation.triggeredRule?.id,
    action: evaluation.action,
    message: evaluation.triggeredRule?.description ?? "",
    userText,
    metadata: {
      profileNickname: profile?.nickname ?? null,
      focusAreas: profile?.focusAreas ?? [],
    },
  };

  await logGuardrailEvent(basePayload);

  if (evaluation.action === "warn") {
    return NextResponse.json({
      message:
        "Aku denger kamu lagi ngalamin situasi berat. Aku bakal jawab dengan ekstra hati-hati ya, dan kalau butuh manusia, kabari aku ❤️",
      meta: {
        action: "warn",
        ruleId: evaluation.triggeredRule?.id,
        guidance: evaluation.triggeredRule?.guidance ?? "",
      },
    });
  }

  return NextResponse.json({
    message:
      "Terima kasih sudah cerita. Aku akan sambungkan kamu ke tim support manusia Mirror supaya kamu bisa dapat bantuan yang aman dan tepat. Tetap di sini ya 💛",
    meta: {
      action: "escalate",
      ruleId: evaluation.triggeredRule?.id,
      guidance: evaluation.triggeredRule?.guidance ?? "",
    },
  });
}

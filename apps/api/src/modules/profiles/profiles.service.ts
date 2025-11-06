import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import {
  ArchetypeKey,
  CreateProfileDto,
  EnneagramType,
  MbtiType,
  ZodiacSign,
} from "./dto/create-profile.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMoodEntryDto } from "./dto/create-mood-entry.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateProfileDto, ownerId: string) {
    return this.prisma.profile.create({
      data: {
        ownerId,
        nickname: payload.nickname.trim(),
        focusAreas: payload.focusAreas ?? [],
        consentCamera: Boolean(payload.consentCamera),
        consentData: Boolean(payload.consentData),
        moodBaseline: payload.moodBaseline ?? "tenang",
        birthDate: coerceBirthDate(payload.birthDate),
        mbtiType: sanitizeMbti(payload.mbtiType),
        enneagramType: sanitizeEnneagram(payload.enneagramType),
        primaryArchetype: sanitizeArchetype(payload.primaryArchetype),
        zodiacSign: sanitizeZodiac(payload.zodiacSign),
        personalityNotes: payload.personalityNotes?.trim() || null,
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, ownerId },
      include: {
        moodEntries: {
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    return {
      ...profile,
      moodEntries: profile.moodEntries.map(serializeMoodEntry),
    };
  }

  async update(id: string, ownerId: string, payload: CreateProfileDto) {
    await this.ensureOwnership(id, ownerId);
    return this.prisma.profile.update({
      where: { id },
      data: {
        nickname: payload.nickname.trim(),
        focusAreas: payload.focusAreas ?? [],
        consentCamera: Boolean(payload.consentCamera),
        consentData: Boolean(payload.consentData),
        moodBaseline: payload.moodBaseline ?? "tenang",
        birthDate: coerceBirthDate(payload.birthDate),
        mbtiType: sanitizeMbti(payload.mbtiType),
        enneagramType: sanitizeEnneagram(payload.enneagramType),
        primaryArchetype: sanitizeArchetype(payload.primaryArchetype),
        zodiacSign: sanitizeZodiac(payload.zodiacSign),
        personalityNotes: payload.personalityNotes?.trim() || null,
      },
    });
  }

  async addMoodEntry(
    profileId: string,
    ownerId: string,
    payload: CreateMoodEntryDto,
  ) {
    await this.ensureOwnership(profileId, ownerId);
    const entry = await this.prisma.moodEntry.create({
      data: {
        profileId,
        mood: payload.mood,
        note: payload.note?.trim() || null,
        source: payload.source ?? "manual",
      },
    });
    return serializeMoodEntry(entry);
  }

  async listMoodEntries(profileId: string, ownerId: string) {
    await this.ensureOwnership(profileId, ownerId);
    const entries = await this.prisma.moodEntry.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return entries.map(serializeMoodEntry);
  }

  async summarizeMoodEntries(profileId: string, ownerId: string) {
    await this.ensureOwnership(profileId, ownerId);
    const lookbackDays = 21;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowStart = new Date(today);
    windowStart.setDate(windowStart.getDate() - (lookbackDays - 1));

    const entries = await this.prisma.moodEntry.findMany({
      where: {
        profileId,
        createdAt: {
          gte: windowStart,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const dayMap = new Map<string, MoodEntryModel[]>();
    const moodTotals: Record<string, number> = {};
    for (const entry of entries) {
      const dayKey = formatDateKey(entry.createdAt);
      const list = dayMap.get(dayKey) ?? [];
      list.push(entry);
      dayMap.set(dayKey, list);
      moodTotals[entry.mood] = (moodTotals[entry.mood] ?? 0) + 1;
    }

    const dailySeries = buildDailySeries(windowStart, lookbackDays, dayMap);

    const dominantMood = getDominantMoodFromTotals(moodTotals);
    const streakDays = calculateStreak(dayMap, today, lookbackDays);
    const lastEntry =
      entries.length > 0
        ? serializeMoodEntry(entries[entries.length - 1])
        : null;
    const averageDailyEntries =
      lookbackDays > 0
        ? Number((entries.length / lookbackDays).toFixed(2))
        : 0;

    const insight = buildInsightSummary({
      totalEntries: entries.length,
      moodTotals,
      dominantMood,
    });

    return {
      period: {
        from: windowStart.toISOString(),
        to: today.toISOString(),
      },
      lookbackDays,
      totalEntries: entries.length,
      dominantMood,
      streakDays,
      moodTotals,
      averageDailyEntries,
      lastEntry,
      dailySeries,
      insight,
    };
  }

  private async ensureOwnership(id: string, ownerId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    if (profile.ownerId !== ownerId) {
      throw new ForbiddenException();
    }
  }
}

const MBTI_TYPES: MbtiType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const ENNEAGRAM_TYPES: EnneagramType[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

const ARCHETYPES: ArchetypeKey[] = [
  "caregiver",
  "creator",
  "explorer",
  "hero",
  "innocent",
  "lover",
  "magician",
  "rebel",
  "sage",
  "jester",
];

const ZODIAC_SIGNS: ZodiacSign[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

function sanitizeMbti(input?: MbtiType | null) {
  if (!input) return null;
  const upper = input.toUpperCase() as MbtiType;
  return MBTI_TYPES.includes(upper) ? upper : null;
}

function sanitizeEnneagram(input?: EnneagramType | null) {
  if (!input) return null;
  return ENNEAGRAM_TYPES.includes(input) ? input : null;
}

function sanitizeArchetype(input?: ArchetypeKey | null) {
  if (!input) return null;
  return ARCHETYPES.includes(input) ? input : null;
}

function sanitizeZodiac(input?: ZodiacSign | null) {
  if (!input) return null;
  return ZODIAC_SIGNS.includes(input) ? input : null;
}

function coerceBirthDate(input?: string | null) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function serializeMoodEntry(entry: MoodEntryModel) {
  return {
    id: entry.id,
    profileId: entry.profileId,
    mood: entry.mood,
    note: entry.note,
    source: entry.source ?? "manual",
    timestamp: entry.createdAt.toISOString(),
  };
}

function formatDateKey(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function buildDailySeries(
  windowStart: Date,
  lookbackDays: number,
  dayMap: Map<string, MoodEntryModel[]>,
) {
  const series: Array<{
    date: string;
    total: number;
    dominantMood: string | null;
    moods: Array<{ mood: string; count: number }>;
  }> = [];

  for (let offset = 0; offset < lookbackDays; offset += 1) {
    const day = new Date(windowStart);
    day.setDate(windowStart.getDate() + offset);
    const key = formatDateKey(day);
    const entries = dayMap.get(key) ?? [];
    const counts: Record<string, number> = {};
    for (const entry of entries) {
      counts[entry.mood] = (counts[entry.mood] ?? 0) + 1;
    }
    const dominantMood = getDominantMoodFromTotals(counts);
    series.push({
      date: key,
      total: entries.length,
      dominantMood,
      moods: Object.entries(counts).map(([mood, count]) => ({
        mood,
        count,
      })),
    });
  }
  return series;
}

function getDominantMoodFromTotals(totals: Record<string, number>) {
  const entries = Object.entries(totals);
  if (entries.length === 0) {
    return null;
  }
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function calculateStreak(
  dayMap: Map<string, MoodEntryModel[]>,
  today: Date,
  lookbackDays: number,
) {
  let streak = 0;
  const cursor = new Date(today);
  for (let offset = 0; offset < lookbackDays; offset += 1) {
    const key = formatDateKey(cursor);
    const hasEntry = (dayMap.get(key)?.length ?? 0) > 0;
    if (!hasEntry) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function buildInsightSummary(params: {
  totalEntries: number;
  moodTotals: Record<string, number>;
  dominantMood: string | null;
}) {
  const { totalEntries, moodTotals, dominantMood } = params;
  if (totalEntries === 0) {
    return {
      tone: "neutral",
      message:
        "Belum ada catatan mood di 21 hari terakhir. Mulai dengan jurnal singkat 1x sehari supaya Mirror bisa kasih insight personal.",
      suggestions: [
        "Set pengingat harian untuk catat mood setelah sesi chat.",
        "Tambahkan catatan singkat supaya konteksnya gampang diingat.",
      ],
    };
  }

  const groundingMoods = ["sedih", "cemas", "lelah"];
  const upliftingMoods = ["ceria", "tenang"];

  const groundingScore = groundingMoods.reduce(
    (acc, mood) => acc + (moodTotals[mood] ?? 0),
    0,
  );
  const upliftingScore = upliftingMoods.reduce(
    (acc, mood) => acc + (moodTotals[mood] ?? 0),
    0,
  );

  if (
    dominantMood &&
    groundingMoods.includes(dominantMood) &&
    groundingScore >= upliftingScore
  ) {
    return {
      tone: "grounding",
      message:
        "Mood kamu lagi cenderung berat dalam tiga minggu terakhir. Yuk luangin waktu buat napas, journaling, atau reach out ke support system.",
      suggestions: [
        "Cobain teknik 4-7-8 breathing pas malam sebelum tidur.",
        "Jadwalkan sesi ngobrol dengan orang dipercaya atau psikolog.",
        "Catat pemicu utama di jurnal biar gampang diurai bareng Mirror.",
      ],
    };
  }

  if (dominantMood && upliftingMoods.includes(dominantMood)) {
    return {
      tone: "uplifting",
      message:
        "Good job! Mood kamu banyak di zona positif akhir-akhir ini. Jaga ritme self-care dan apresiasi effort yang sudah kamu jalanin.",
      suggestions: [
        "Tuliskan 3 hal yang kamu syukuri tiap malam.",
        "Bagikan energi positifmu ke teman terdekat atau komunitas.",
        "Eksplor mini activities yang bikin kamu tambah recharge.",
      ],
    };
  }

  return {
    tone: "balanced",
    message:
      "Mood kamu cukup dinamis. Tetap lanjut catat mood supaya pola naik-turun emosi gampang kamu track.",
    suggestions: [
      "Gunakan skala 1-5 buat tandai intensitas emosi di catatan.",
      "Kalau ada hari spesial (baik atau buruk), tambahin konteks singkat.",
    ],
  };
}
type MoodEntryModel = {
  id: string;
  profileId: string;
  mood: string;
  note: string | null;
  source: string | null;
  createdAt: Date;
};

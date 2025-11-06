export type MbtiType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type EnneagramType =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

export type ArchetypeKey =
  | "caregiver"
  | "creator"
  | "explorer"
  | "hero"
  | "innocent"
  | "lover"
  | "magician"
  | "rebel"
  | "sage"
  | "jester";

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export class CreateProfileDto {
  nickname!: string;
  focusAreas?: string[];
  consentCamera?: boolean;
  consentData?: boolean;
  moodBaseline?: "tenang" | "bersemangat" | "lelah";
  birthDate?: string | null;
  mbtiType?: MbtiType | null;
  enneagramType?: EnneagramType | null;
  primaryArchetype?: ArchetypeKey | null;
  zodiacSign?: ZodiacSign | null;
  personalityNotes?: string | null;
  premiumPlanId?: string | null;
  premiumStatus?: string | null;
  premiumActiveSince?: string | null;
}

"use client";

export type SafetyAction = "allow" | "warn" | "escalate";

export type SafetyRule = {
  id: string;
  description: string;
  action: SafetyAction;
  patterns: RegExp[];
  guidance?: string;
};

export const safetyRules: SafetyRule[] = [
  {
    id: "self-harm-escalate",
    description: "Deteksi indikasi bunuh diri atau self-harm berat",
    action: "escalate",
    patterns: [
      /bunuh\s*dir[ia]/i,
      /mengakhiri\s+(hidup|semua)/i,
      /tidak\s+ingin\s+hidup/i,
      /self[-\s]?harm/i,
      /aku\s+ingin\s+mati/i,
    ],
    guidance:
      "Tetap tenang, validasi emosi, dan hubungkan pengguna ke bantuan manusia/hotline.",
  },
  {
    id: "violence-escalate",
    description: "Ancaman kekerasan ke orang lain",
    action: "escalate",
    patterns: [
      /aku\s+akan\s+melukai/i,
      /aku\s+mau\s+(membunuh|menghajar)/i,
      /dirampas\s+dan\s+aku\s+balas/i,
    ],
    guidance:
      "Aktifkan protokol bahaya: eskalasi ke tim manusia dan informasikan hotline darurat.",
  },
  {
    id: "abuse-warn",
    description: "Curhat kekerasan atau pelecehan – perlu respons hati-hati",
    action: "warn",
    patterns: [
      /aku\s+dianiaya/i,
      /digaslighting/i,
      /ditampar|dipukul/i,
      /pelecehan/i,
    ],
    guidance:
      "Pastikan respon sangat empatik, sertakan saran aman + hotline, pertimbangkan penawaran human handoff.",
  },
  {
    id: "drug-warning",
    description: "Permintaan saran obat atau diagnosa medis",
    action: "warn",
    patterns: [
      /obat\s+apa\s+yang\s+harus\s+aku\s+minum/i,
      /tolong\s+diagnosa/i,
      /psikolog\s+atau\s+psikiater\s+mana/i,
    ],
    guidance:
      "Ingatkan Mirror bukan profesional medis, anjurkan konsultasi langsung dengan ahli.",
  },
];

export type SafetyEvaluation = {
  action: SafetyAction;
  triggeredRule?: SafetyRule;
  details?: string;
};

export function evaluateSafetyPolicies(text: string): SafetyEvaluation {
  const cleaned = text.trim();
  if (!cleaned) {
    return { action: "allow" };
  }
  for (const rule of safetyRules) {
    if (rule.patterns.some((pattern) => pattern.test(cleaned))) {
      return { action: rule.action, triggeredRule: rule };
    }
  }
  return { action: "allow" };
}

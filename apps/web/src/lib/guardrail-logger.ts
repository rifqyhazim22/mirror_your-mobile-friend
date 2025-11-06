type GuardrailEventPayload = {
  ruleId?: string;
  action: "warn" | "escalate";
  message: string;
  userText: string;
  metadata?: Record<string, unknown>;
};

export async function logGuardrailEvent(payload: GuardrailEventPayload) {
  try {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      ...payload,
    };
    console.info("[guardrail-event]", JSON.stringify(entry));
  } catch (error) {
    console.warn("Failed to log guardrail event", error);
  }
}

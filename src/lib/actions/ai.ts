"use server";

import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  generateListingDescriptionAI,
  parseNaturalLanguageSearch,
  translateText,
  chatWithAssistant,
  type ChatMessage,
} from "@/lib/services/ai";
import { aiGenerateSchema, nlSearchSchema } from "@/lib/validation";

export async function generateListingDescription(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere" };

  const { allowed } = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGenerate);
  if (!allowed) return { error: "Limite di generazioni raggiunto. Riprova domani." };

  const parsed = aiGenerateSchema.safeParse({
    type: formData.get("type"),
    zone: formData.get("zone"),
    size: formData.get("size") || undefined,
    price: formData.get("price") || undefined,
    features: formData.get("features") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Input non valido" };
  }

  const result = await generateListingDescriptionAI(parsed.data);

  return {
    success: true,
    descriptionIt: result.descriptionIt,
    descriptionEn: result.descriptionEn,
  };
}

export async function naturalLanguageSearch(formData: FormData) {
  const parsed = nlSearchSchema.safeParse({
    query: formData.get("query"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ricerca non valida" };
  }

  const result = await parseNaturalLanguageSearch(parsed.data.query);

  return {
    success: true,
    filters: result.filters,
    interpretation: result.interpretation,
  };
}

export async function translateMessage(formData: FormData) {
  const text = formData.get("text") as string;
  const targetLang = formData.get("targetLang") as string || "en";

  if (!text) return { error: "Testo mancante" };

  const result = await translateText(text, targetLang);

  return {
    success: true,
    originalText: text,
    translatedText: result.translatedText,
    sourceLang: result.detectedLang || "auto-detected",
    targetLang,
  };
}

export async function chatAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere" };

  const { allowed } = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGenerate);
  if (!allowed) return { error: "Limite di messaggi raggiunto. Riprova domani." };

  const message = formData.get("message") as string;
  const historyRaw = formData.get("history") as string;

  if (!message) return { error: "Messaggio mancante" };

  let history: ChatMessage[] = [];
  if (historyRaw) {
    try {
      history = JSON.parse(historyRaw);
    } catch {
      history = [];
    }
  }

  const messages: ChatMessage[] = [
    ...history.slice(-10), // Keep last 10 messages for context
    { role: "user", content: message },
  ];

  const response = await chatWithAssistant(messages, { userName: user.name });

  return {
    success: true,
    response,
  };
}

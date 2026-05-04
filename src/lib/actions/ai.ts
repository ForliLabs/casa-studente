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

export async function generateListingDescription(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere" };

  const { allowed } = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGenerate);
  if (!allowed) return { error: "Limite di generazioni raggiunto. Riprova domani." };

  const type = formData.get("type") as string;
  const zone = formData.get("zone") as string;
  const size = formData.get("size") as string;
  const price = formData.get("price") as string;
  const features = formData.get("features") as string;

  if (!type || !zone) {
    return { error: "Tipo e zona sono obbligatori per generare la descrizione" };
  }

  const result = await generateListingDescriptionAI({ type, zone, size, price, features });

  return {
    success: true,
    descriptionIt: result.descriptionIt,
    descriptionEn: result.descriptionEn,
  };
}

export async function naturalLanguageSearch(formData: FormData) {
  const query = (formData.get("query") as string || "").trim();

  if (!query || query.length < 3) {
    return { error: "Inserisci almeno 3 caratteri per la ricerca" };
  }

  const result = await parseNaturalLanguageSearch(query);

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

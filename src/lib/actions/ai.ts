"use server";

import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// AI-Powered Listing Assistant — server actions
// Uses structured prompts; in production, wire to OpenAI/Anthropic API

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

  // Simulated AI generation (structured template-based for demo)
  const descIt = generateStructuredDescription("it", { type, zone, size, price, features });
  const descEn = generateStructuredDescription("en", { type, zone, size, price, features });

  return {
    success: true,
    descriptionIt: descIt,
    descriptionEn: descEn,
  };
}

function generateStructuredDescription(
  lang: "it" | "en",
  data: { type: string; zone: string; size: string; price: string; features: string }
): string {
  const featureList = data.features ? data.features.split(",").map((f) => f.trim()).filter(Boolean) : [];

  if (lang === "it") {
    const typeLabel: Record<string, string> = {
      "stanza singola": "Stanza singola",
      "stanza doppia": "Stanza doppia",
      monolocale: "Monolocale",
      bilocale: "Bilocale",
    };
    const t = typeLabel[data.type] || data.type;
    let desc = `${t} in zona ${data.zone}`;
    if (data.size) desc += `, ${data.size} mq`;
    desc += `. `;
    if (data.zone === "Centro") desc += "Posizione strategica nel cuore di Forlì, a pochi passi da Piazza Saffi, biblioteche e facoltà universitarie. ";
    else if (data.zone === "Campus") desc += "A pochi minuti a piedi dal campus universitario, ideale per chi vuole ridurre al minimo gli spostamenti. ";
    else if (data.zone === "Stazione") desc += "Zona ben collegata con la stazione ferroviaria, perfetta per chi viaggia verso Bologna o la Riviera. ";
    else desc += `Situato nella tranquilla zona di ${data.zone}, ambiente residenziale e servito. `;
    if (featureList.length > 0) desc += `Dotato di: ${featureList.join(", ")}. `;
    if (data.price) desc += `Canone mensile: €${data.price}. `;
    desc += "Contratto flessibile per studenti universitari.";
    return desc;
  } else {
    const typeLabel: Record<string, string> = {
      "stanza singola": "Single room",
      "stanza doppia": "Shared room",
      monolocale: "Studio apartment",
      bilocale: "One-bedroom apartment",
    };
    const t = typeLabel[data.type] || data.type;
    let desc = `${t} in the ${data.zone} area`;
    if (data.size) desc += `, ${data.size} sqm`;
    desc += `. `;
    if (data.zone === "Centro") desc += "Strategically located in the heart of Forlì, steps from Piazza Saffi, libraries, and university faculties. ";
    else if (data.zone === "Campus") desc += "Just minutes on foot from the university campus, ideal for minimizing commute time. ";
    else if (data.zone === "Stazione") desc += "Well-connected area with the train station, perfect for traveling to Bologna or the coast. ";
    else desc += `Located in the quiet ${data.zone} area, a residential and well-served neighborhood. `;
    if (featureList.length > 0) desc += `Features: ${featureList.join(", ")}. `;
    if (data.price) desc += `Monthly rent: €${data.price}. `;
    desc += "Flexible contract for university students.";
    return desc;
  }
}

export async function naturalLanguageSearch(formData: FormData) {
  const query = (formData.get("query") as string || "").toLowerCase();

  if (!query || query.length < 3) {
    return { error: "Inserisci almeno 3 caratteri per la ricerca" };
  }

  // Parse natural language into structured filters
  const filters: Record<string, string | number | boolean> = {};

  // Zone detection
  const zones = ["centro", "campus", "stazione", "san benedetto", "cava", "ronco", "ospedaletto"];
  for (const zone of zones) {
    if (query.includes(zone)) {
      filters.zone = zone.charAt(0).toUpperCase() + zone.slice(1);
      break;
    }
  }

  // Type detection
  if (query.includes("monolocale") || query.includes("studio")) filters.type = "monolocale";
  else if (query.includes("bilocale") || query.includes("one-bedroom")) filters.type = "bilocale";
  else if (query.includes("singola") || query.includes("single")) filters.type = "stanza singola";
  else if (query.includes("doppia") || query.includes("shared")) filters.type = "stanza doppia";

  // Price detection
  const priceMatch = query.match(/(?:sotto|under|max|fino a|meno di)\s*€?\s*(\d+)/);
  if (priceMatch) filters.maxPrice = parseInt(priceMatch[1]);
  const minPriceMatch = query.match(/(?:sopra|over|min|almeno|più di)\s*€?\s*(\d+)/);
  if (minPriceMatch) filters.minPrice = parseInt(minPriceMatch[1]);

  // Feature detection
  if (query.includes("wifi") || query.includes("wi-fi") || query.includes("internet")) filters.hasWifi = true;
  if (query.includes("verificat") || query.includes("verified")) filters.verified = true;
  if (query.includes("tour virtuale") || query.includes("virtual tour")) filters.virtualTour = true;

  return {
    success: true,
    filters,
    interpretation: `Cercando: ${Object.entries(filters).map(([k, v]) => `${k}=${v}`).join(", ") || "tutti gli annunci"}`,
  };
}

export async function translateMessage(formData: FormData) {
  const text = formData.get("text") as string;
  const targetLang = formData.get("targetLang") as string || "en";

  if (!text) return { error: "Testo mancante" };

  // In production, this would call a translation API
  // For demo, return a placeholder indicating the translation feature
  return {
    success: true,
    originalText: text,
    translatedText: `[${targetLang.toUpperCase()}] ${text}`,
    sourceLang: "auto-detected",
    targetLang,
  };
}

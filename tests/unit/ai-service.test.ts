import { describe, it, expect } from "vitest";

// Test the AI service fallback (template-based) functions directly
// These work without OPENAI_API_KEY set
import {
  parseNaturalLanguageSearch,
  generateListingDescriptionAI,
  chatWithAssistant,
  translateText,
  isAIConfigured,
} from "@/lib/services/ai";

describe("AI Service — Fallback Mode", () => {
  it("reports AI as not configured without API key", () => {
    expect(isAIConfigured()).toBe(false);
  });

  describe("Natural Language Search (fallback)", () => {
    it("detects zone from query", async () => {
      const result = await parseNaturalLanguageSearch("monolocale in centro");
      expect(result.filters.zone).toBe("Centro");
      expect(result.filters.type).toBe("monolocale");
    });

    it("detects price range", async () => {
      const result = await parseNaturalLanguageSearch("stanza singola sotto 400");
      expect(result.filters.maxPrice).toBe(400);
      expect(result.filters.type).toBe("stanza singola");
    });

    it("detects English terms", async () => {
      const result = await parseNaturalLanguageSearch("studio apartment under 500");
      expect(result.filters.type).toBe("monolocale");
      expect(result.filters.maxPrice).toBe(500);
    });

    it("detects advanced amenities and safety preferences", async () => {
      const result = await parseNaturalLanguageSearch(
        "furnished room with secure payments, wifi, bills included and virtual tour"
      );
      expect(result.filters.furnished).toBe(true);
      expect(result.filters.securePayments).toBe(true);
      expect(result.filters.utilitiesIncluded).toBe(true);
      expect(result.filters.virtualTour).toBe(true);
      expect(result.filters.features).toContain("wifi");
    });

    it("detects explicit price ranges", async () => {
      const result = await parseNaturalLanguageSearch("bilocale tra 500 e 750 euro");
      expect(result.filters.type).toBe("bilocale");
      expect(result.filters.minPrice).toBe(500);
      expect(result.filters.maxPrice).toBe(750);
    });

    it("provides interpretation", async () => {
      const result = await parseNaturalLanguageSearch("bilocale campus verified");
      expect(result.interpretation).toBeTruthy();
      expect(result.filters.zone).toBe("Campus");
    });

    it("returns empty filters for unrecognized query", async () => {
      const result = await parseNaturalLanguageSearch("something random");
      expect(Object.keys(result.filters).length).toBe(0);
    });
  });

  describe("Listing Description Generation (fallback)", () => {
    it("generates Italian and English descriptions", async () => {
      const result = await generateListingDescriptionAI({
        type: "monolocale",
        zone: "Centro",
        size: "30",
        price: "500",
        features: "wifi, lavatrice",
      });
      expect(result.descriptionIt).toContain("Centro");
      expect(result.descriptionIt).toContain("€500");
      expect(result.descriptionEn).toContain("Centro");
      expect(result.descriptionEn).toContain("€500");
    });

    it("handles campus zone descriptions", async () => {
      const result = await generateListingDescriptionAI({
        type: "stanza singola",
        zone: "Campus",
      });
      expect(result.descriptionIt).toContain("campus");
      expect(result.descriptionEn).toContain("campus");
    });

    it("handles missing optional fields", async () => {
      const result = await generateListingDescriptionAI({
        type: "bilocale",
        zone: "Stazione",
      });
      expect(result.descriptionIt).toBeTruthy();
      expect(result.descriptionEn).toBeTruthy();
    });
  });

  describe("Chat Assistant (fallback)", () => {
    it("responds to greetings", async () => {
      const response = await chatWithAssistant([{ role: "user", content: "Ciao!" }]);
      expect(response).toContain("CasaStudente");
    });

    it("responds to contract questions", async () => {
      const response = await chatWithAssistant([
        { role: "user", content: "Come funzionano i contratti?" },
      ]);
      expect(response).toContain("Transitorio");
      expect(response).toContain("cedolare secca");
    });

    it("responds to neighborhood questions", async () => {
      const response = await chatWithAssistant([
        { role: "user", content: "Quali sono le zone migliori?" },
      ]);
      expect(response).toContain("Campus");
      expect(response).toContain("Centro");
    });

    it("provides a helpful default response", async () => {
      const response = await chatWithAssistant([
        { role: "user", content: "qualcosa di generico" },
      ]);
      expect(response).toBeTruthy();
      expect(response.length).toBeGreaterThan(20);
    });
  });

  describe("Translation (fallback)", () => {
    it("returns mock translation with language prefix", async () => {
      const result = await translateText("Ciao mondo", "en");
      expect(result.translatedText).toContain("[EN]");
      expect(result.translatedText).toContain("Ciao mondo");
    });
  });
});

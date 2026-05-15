import { describe, it, expect } from "vitest";
import {
  t,
  getLocaleFromCookie,
  getLocaleFromHeader,
  formatCurrency,
  formatDate,
  supportedLocales,
  localeLabels,
} from "@/lib/i18n";

describe("i18n - Translation Function", () => {
  it("returns Italian translation by default", () => {
    expect(t("nav.home")).toBe("Home");
    expect(t("nav.listings")).toBe("Annunci");
    expect(t("common.save")).toBe("Salva");
  });

  it("returns English translation when specified", () => {
    expect(t("nav.listings", "en")).toBe("Listings");
    expect(t("common.save", "en")).toBe("Save");
    expect(t("auth.login", "en")).toBe("Log in to CasaStudente");
  });

  it("returns Spanish translation when specified", () => {
    expect(t("nav.listings", "es")).toBe("Anuncios");
    expect(t("common.save", "es")).toBe("Guardar");
    expect(t("auth.student", "es")).toBe("Estudiante");
  });

  it("returns French translation when specified", () => {
    expect(t("nav.listings", "fr")).toBe("Annonces");
    expect(t("common.save", "fr")).toBe("Enregistrer");
    expect(t("auth.student", "fr")).toBe("Étudiant");
  });

  it("covers all 4 locales with same key set", () => {
    const key = "nav.home";
    for (const locale of supportedLocales) {
      const result = t(key, locale);
      expect(result).toBeTruthy();
      expect(result).not.toBe(key); // Should not fall back to key name
    }
  });

  it("has labels for all supported locales", () => {
    for (const locale of supportedLocales) {
      expect(localeLabels[locale]).toBeTruthy();
    }
  });

  // New iter5 keys
  it("includes dashboard section keys for iter4 pages", () => {
    expect(t("dashboard.payments")).toBe("Pagamenti");
    expect(t("dashboard.documents")).toBe("Documenti");
    expect(t("dashboard.reviews")).toBe("Recensioni");
    expect(t("dashboard.groups")).toBe("Gruppi");
    expect(t("dashboard.insurance")).toBe("Assicurazione");
    expect(t("dashboard.disputes")).toBe("Contestazioni");
    expect(t("dashboard.legalCompliance")).toBe("Conformità legale");
  });

  it("includes payment keys", () => {
    expect(t("payments.title")).toBe("Pagamenti");
    expect(t("payments.completed")).toBe("Completato");
    expect(t("payments.rent", "en")).toBe("Rent");
  });

  it("includes error keys", () => {
    expect(t("error.generic")).toBeTruthy();
    expect(t("error.notFound")).toBeTruthy();
    expect(t("error.rateLimited")).toBeTruthy();
  });

  it("includes new common keys", () => {
    expect(t("common.next")).toBe("Avanti");
    expect(t("common.delete")).toBe("Elimina");
    expect(t("common.confirm")).toBe("Conferma");
    expect(t("common.search")).toBe("Cerca");
  });
});

describe("i18n - Locale Detection", () => {
  it("returns locale from valid cookie", () => {
    expect(getLocaleFromCookie("it")).toBe("it");
    expect(getLocaleFromCookie("en")).toBe("en");
    expect(getLocaleFromCookie("es")).toBe("es");
    expect(getLocaleFromCookie("fr")).toBe("fr");
  });

  it("returns default for invalid cookie", () => {
    expect(getLocaleFromCookie("de")).toBe("it");
    expect(getLocaleFromCookie("")).toBe("it");
    expect(getLocaleFromCookie(undefined)).toBe("it");
  });

  it("detects locale from Accept-Language header", () => {
    expect(getLocaleFromHeader("en-US,en;q=0.9")).toBe("en");
    expect(getLocaleFromHeader("es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(getLocaleFromHeader("fr-FR,fr;q=0.9")).toBe("fr");
    expect(getLocaleFromHeader("it-IT")).toBe("it");
  });

  it("returns default for unsupported Accept-Language", () => {
    expect(getLocaleFromHeader("de-DE,de;q=0.9")).toBe("it");
    expect(getLocaleFromHeader("")).toBe("it");
    expect(getLocaleFromHeader(undefined)).toBe("it");
  });

  it("prefers higher quality language", () => {
    expect(getLocaleFromHeader("de;q=0.9,en;q=0.8,fr;q=0.7")).toBe("en");
  });
});

describe("i18n - Formatting", () => {
  it("formats currency for different locales", () => {
    const amount = 360;
    const itFormatted = formatCurrency(amount, "it");
    expect(itFormatted).toContain("360");
    expect(itFormatted).toContain("€");

    const enFormatted = formatCurrency(amount, "en");
    expect(enFormatted).toContain("360");
    expect(enFormatted).toContain("€");
  });

  it("formats dates for different locales", () => {
    const date = new Date("2026-09-01");
    const itFormatted = formatDate(date, "it");
    expect(itFormatted).toBeTruthy();
    expect(itFormatted.length).toBeGreaterThan(5);

    const enFormatted = formatDate(date, "en");
    expect(enFormatted).toBeTruthy();
  });

  it("accepts string dates", () => {
    const formatted = formatDate("2026-09-01", "it");
    expect(formatted).toBeTruthy();
  });
});

import { describe, it, expect, vi } from "vitest";
import { generalContactAction } from "@/lib/actions/messages";

describe("General Contact Action", () => {
  it("validates required fields", async () => {
    const formData = new FormData();
    formData.set("name", "");
    formData.set("email", "bad-email");
    formData.set("subject", "");
    formData.set("message", "");

    const result = await generalContactAction(null, formData);
    expect(result).toHaveProperty("error");
    expect(typeof result.error).toBe("string");
  });

  it("rejects a short name", async () => {
    const formData = new FormData();
    formData.set("name", "A");
    formData.set("email", "test@example.com");
    formData.set("subject", "Test subject");
    formData.set("message", "This is a valid test message with enough length.");

    const result = await generalContactAction(null, formData);
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("2 caratteri");
  });

  it("rejects an invalid email", async () => {
    const formData = new FormData();
    formData.set("name", "Giulia Bianchi");
    formData.set("email", "not-an-email");
    formData.set("subject", "Test subject");
    formData.set("message", "This is a valid test message with enough length.");

    const result = await generalContactAction(null, formData);
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("Email");
  });

  it("rejects a short subject", async () => {
    const formData = new FormData();
    formData.set("name", "Giulia Bianchi");
    formData.set("email", "test@example.com");
    formData.set("subject", "AB");
    formData.set("message", "This is a valid test message with enough length.");

    const result = await generalContactAction(null, formData);
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("3 caratteri");
  });

  it("rejects a short message", async () => {
    const formData = new FormData();
    formData.set("name", "Giulia Bianchi");
    formData.set("email", "test@example.com");
    formData.set("subject", "Test subject");
    formData.set("message", "Short");

    const result = await generalContactAction(null, formData);
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("10 caratteri");
  });

  it("succeeds with valid input", async () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const formData = new FormData();
    formData.set("name", "Giulia Bianchi");
    formData.set("email", "giulia@universita.it");
    formData.set("subject", "Domanda sul pagamento");
    formData.set("message", "Vorrei chiedere informazioni sulla procedura di pagamento del deposito cauzionale.");

    const result = await generalContactAction(null, formData);
    expect(result).toEqual({
      success: true,
      message: expect.stringContaining("Messaggio ricevuto"),
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Contact Form]",
      expect.objectContaining({
        name: "Giulia Bianchi",
        email: "giulia@universita.it",
        subject: "Domanda sul pagamento",
      })
    );

    consoleSpy.mockRestore();
  });
});

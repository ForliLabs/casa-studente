import { describe, expect, it } from "vitest";
import {
  ALLOWED_UPLOAD_CATEGORIES,
  detectThreatSignals,
  hasThreatSignals,
  isAllowedUploadCategory,
  isSafeIdentifier,
  sanitizeTextInput,
} from "@/lib/security";

describe("security helpers", () => {
  it("sanitizes script tags and javascript protocols", () => {
    const result = sanitizeTextInput('<script>alert(1)</script><a href="javascript:alert(2)">ciao</a>');
    expect(result).toBe("ciao");
  });

  it("detects common threat signals", () => {
    const result = detectThreatSignals('<img src=x onerror="alert(1)"> UNION SELECT password');
    expect(result).toContain("event-handler");
    expect(result).toContain("sql-injection");
    expect(hasThreatSignals("hello<script>boom</script>")).toBe(true);
  });

  it("validates upload categories", () => {
    expect(ALLOWED_UPLOAD_CATEGORIES).toContain("listing_photo");
    expect(isAllowedUploadCategory("profile")).toBe(true);
    expect(isAllowedUploadCategory("malware")).toBe(false);
  });

  it("validates safe identifiers", () => {
    expect(isSafeIdentifier("listing-123_safe:id")).toBe(true);
    expect(isSafeIdentifier("../../etc/passwd")).toBe(false);
  });
});

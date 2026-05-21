import { describe, it, expect } from "vitest";
import {
  aggregateClaims,
  getTrustSigningSecret,
  issuePortableTrust,
  scoreToTier,
  tenantScoreToPortableClaims,
  verifyPortableTrust,
  type PortableTrustClaim,
} from "@/lib/trust/portable-trust";
import type { TenantScore } from "@/lib/stores/tenant-score";

const NOW = new Date("2026-06-15T12:00:00.000Z");
const SECRET = "casa-studente-test-secret-do-not-use-anywhere-else";

const sampleClaim = (overrides: Partial<PortableTrustClaim> = {}): PortableTrustClaim => ({
  app: "casa-studente",
  dimension: "tenant-score",
  value: 93,
  tier: "excellent",
  evidenceCount: 12,
  lastEventAt: "2026-06-15T11:30:00.000Z",
  ...overrides,
});

const sampleScore = (overrides: Partial<TenantScore> = {}): TenantScore => ({
  id: "ts-test",
  tenantId: "user-student-test",
  tenantName: "Test Student",
  paymentPunctuality: 90,
  leaseCompletion: 100,
  landlordReviews: 85,
  documentCompliance: 90,
  verificationStatus: 100,
  platformTenure: 70,
  overallScore: 91,
  tier: "excellent",
  hasGuarantor: true,
  previousLandlordVerified: true,
  scoreHistory: [
    { month: "2026-04", score: 85 },
    { month: "2026-05", score: 88 },
    { month: "2026-06", score: 91 },
  ],
  improvementTips: [],
  lastComputedAt: NOW.toISOString(),
  ...overrides,
});

describe("portable-trust — scoreToTier", () => {
  it.each([
    [0, "developing"],
    [40, "developing"],
    [41, "reliable"],
    [65, "reliable"],
    [66, "trusted"],
    [85, "trusted"],
    [86, "excellent"],
    [100, "excellent"],
  ] as const)("score %i → %s", (score, tier) => {
    expect(scoreToTier(score)).toBe(tier);
  });
});

describe("portable-trust — aggregateClaims", () => {
  it("returns 0 for empty input", () => {
    expect(aggregateClaims([])).toBe(0);
  });

  it("returns the evidence-weighted mean for healthy input", () => {
    const result = aggregateClaims([
      sampleClaim({ value: 90, evidenceCount: 10 }),
      sampleClaim({
        app: "ospite-facile",
        dimension: "host-score",
        value: 60,
        evidenceCount: 5,
      }),
    ]);
    expect(result).toBe(80);
  });

  it("caps the aggregate at 75 when evidence is below threshold", () => {
    expect(aggregateClaims([sampleClaim({ value: 100, evidenceCount: 1 })])).toBe(75);
  });

  it("clamps individual claim values to 0..100", () => {
    expect(
      aggregateClaims([sampleClaim({ value: 200, evidenceCount: 10 })]),
    ).toBe(100);
  });
});

describe("portable-trust — tenantScoreToPortableClaims", () => {
  it("produces a single tenant-score claim with combined evidence count", () => {
    const claims = tenantScoreToPortableClaims(sampleScore());
    expect(claims).toHaveLength(1);
    const [claim] = claims;
    expect(claim.app).toBe("casa-studente");
    expect(claim.dimension).toBe("tenant-score");
    expect(claim.value).toBe(91);
    expect(claim.tier).toBe("excellent");
    // 3 history rows + guarantor + previous landlord = 5
    expect(claim.evidenceCount).toBe(5);
    expect(claim.lastEventAt).toBe(NOW.toISOString());
  });

  it("counts evidence even when guarantor / previous landlord are absent", () => {
    const claims = tenantScoreToPortableClaims(
      sampleScore({
        hasGuarantor: false,
        previousLandlordVerified: false,
        scoreHistory: [{ month: "2026-06", score: 50 }],
      }),
    );
    expect(claims[0].evidenceCount).toBe(1);
  });
});

describe("portable-trust — issue / verify round-trip", () => {
  it("issues a VC-shaped credential that verifies with the same secret", async () => {
    const credential = await issuePortableTrust({
      subjectId: "did:forli:cs:user-student-1",
      claims: tenantScoreToPortableClaims(sampleScore()),
      signingSecret: SECRET,
      now: NOW,
    });

    expect(credential["@context"]).toContain(
      "https://www.w3.org/2018/credentials/v1",
    );
    expect(credential.type).toEqual([
      "VerifiableCredential",
      "PortableTrustCredential",
    ]);
    expect(credential.credentialSubject.id).toBe("did:forli:cs:user-student-1");
    expect(credential.credentialSubject.aggregateScore).toBe(91);
    expect(credential.credentialSubject.aggregateTier).toBe("excellent");
    expect(credential.proof.type).toBe("HmacSha256-2026");
    expect(credential.proof.signatureValue).toMatch(/^[a-f0-9]{64}$/);

    const verdict = await verifyPortableTrust(credential, {
      signingSecret: SECRET,
      now: new Date(NOW.getTime() + 60_000),
    });
    expect(verdict).toEqual({
      ok: true,
      subjectId: "did:forli:cs:user-student-1",
      aggregateScore: 91,
    });
  });

  it("rejects a tampered credential", async () => {
    const credential = await issuePortableTrust({
      subjectId: "did:forli:cs:user-student-1",
      claims: tenantScoreToPortableClaims(sampleScore()),
      signingSecret: SECRET,
      now: NOW,
    });
    const tampered = {
      ...credential,
      credentialSubject: { ...credential.credentialSubject, aggregateScore: 100 },
    };
    const verdict = await verifyPortableTrust(tampered, {
      signingSecret: SECRET,
      now: NOW,
    });
    expect(verdict).toEqual({ ok: false, reason: "invalid-signature" });
  });

  it("rejects an expired credential", async () => {
    const credential = await issuePortableTrust({
      subjectId: "did:forli:cs:user-student-1",
      claims: tenantScoreToPortableClaims(sampleScore()),
      signingSecret: SECRET,
      now: NOW,
      ttlMs: 60_000,
    });
    const verdict = await verifyPortableTrust(credential, {
      signingSecret: SECRET,
      now: new Date(NOW.getTime() + 5 * 60_000),
    });
    expect(verdict).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects an unknown-algorithm credential", async () => {
    const credential = await issuePortableTrust({
      subjectId: "did:forli:cs:user-student-1",
      claims: tenantScoreToPortableClaims(sampleScore()),
      signingSecret: SECRET,
      now: NOW,
    });
    const wrong = {
      ...credential,
      proof: { ...credential.proof, type: "Ed25519Signature2020" as never },
    };
    const verdict = await verifyPortableTrust(wrong, {
      signingSecret: SECRET,
      now: NOW,
    });
    expect(verdict).toEqual({ ok: false, reason: "unknown-algorithm" });
  });

  it("rejects a credential with the wrong issuer when expectedIssuer is set", async () => {
    const credential = await issuePortableTrust({
      subjectId: "did:forli:cs:user-student-1",
      claims: tenantScoreToPortableClaims(sampleScore()),
      signingSecret: SECRET,
      issuer: "did:web:other.it",
      now: NOW,
    });
    const verdict = await verifyPortableTrust(credential, {
      signingSecret: SECRET,
      expectedIssuer: "did:web:forlilabs.it",
      now: NOW,
    });
    expect(verdict).toEqual({ ok: false, reason: "issuer-mismatch" });
  });

  it("rejects empty subject id", async () => {
    await expect(
      issuePortableTrust({
        subjectId: "",
        claims: tenantScoreToPortableClaims(sampleScore()),
        signingSecret: SECRET,
        now: NOW,
      }),
    ).rejects.toThrow(/subjectId/);
  });
});

describe("portable-trust — getTrustSigningSecret", () => {
  it("returns the dev fallback when no env var is set", () => {
    const original = process.env.FORLI_TRUST_SECRET;
    delete process.env.FORLI_TRUST_SECRET;
    try {
      expect(getTrustSigningSecret().length).toBeGreaterThanOrEqual(32);
    } finally {
      if (original !== undefined) process.env.FORLI_TRUST_SECRET = original;
    }
  });

  it("prefers the env var when it is long enough", () => {
    const original = process.env.FORLI_TRUST_SECRET;
    process.env.FORLI_TRUST_SECRET = "x".repeat(40);
    try {
      expect(getTrustSigningSecret()).toBe("x".repeat(40));
    } finally {
      if (original === undefined) delete process.env.FORLI_TRUST_SECRET;
      else process.env.FORLI_TRUST_SECRET = original;
    }
  });

  it("falls back to dev secret when env var is too short", () => {
    const original = process.env.FORLI_TRUST_SECRET;
    process.env.FORLI_TRUST_SECRET = "too-short";
    try {
      expect(getTrustSigningSecret()).not.toBe("too-short");
    } finally {
      if (original === undefined) delete process.env.FORLI_TRUST_SECRET;
      else process.env.FORLI_TRUST_SECRET = original;
    }
  });
});

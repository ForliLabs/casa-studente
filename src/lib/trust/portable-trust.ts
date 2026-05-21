/**
 * PortableTrust adapter for CasaStudente.
 *
 * Bridge between the locally-stored `TenantScore` records and the
 * cross-portfolio **PortableTrust** verifiable-credential format
 * defined by feature #4 in `../../../../NEXT-GEN-PLANNING.md`.
 *
 * This file is a *local copy* of the canonical implementation that lives
 * in `packages/forli-os/src/trust.ts` at the portfolio root. The local
 * copy exists so CasaStudente keeps building independently while the
 * workspace plumbing (feature #8) is not yet in place; once the package
 * is published / linked, the import can be flipped to
 * `@forlilabs/forli-os/trust` without changing any call sites.
 *
 * Signing uses HMAC-SHA-256 with a shared secret — no external KMS
 * required. The proof carries an algorithm tag so we can rotate to
 * ed25519 later without breaking the wire format.
 *
 * @module @/lib/trust/portable-trust
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import {
  computeTier,
  type ScoreTier,
  type TenantScore,
} from "@/lib/stores/tenant-score";

/** Sub-portfolio identifiers — extend cautiously, this is a wire enum. */
export type PortableTrustApp =
  | "casa-studente"
  | "bottega-digitale"
  | "cura-vicina"
  | "energia-nostra"
  | "ospite-facile"
  | "piazza-viva"
  | "tavola-romagna"
  | "terra-ferma"
  | "visit-romagna"
  | "agri-romagna";

/** Coarse human-readable tier on the 0-100 scale. */
export type PortableTrustTier = ScoreTier;

/** A single per-app score that participates in the aggregate credential. */
export interface PortableTrustClaim {
  app: PortableTrustApp;
  dimension: string;
  value: number;
  tier: PortableTrustTier;
  evidenceCount: number;
  lastEventAt: string;
  note?: string;
}

export interface IssuePortableTrustParams {
  subjectId: string;
  claims: readonly PortableTrustClaim[];
  signingSecret: string;
  issuer?: string;
  ttlMs?: number;
  now?: Date;
}

export interface PortableTrustProof {
  type: "HmacSha256-2026";
  created: string;
  verificationMethod: string;
  signatureValue: string;
}

export interface PortableTrustCredential {
  "@context": readonly string[];
  type: readonly string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    aggregateScore: number;
    aggregateTier: PortableTrustTier;
    claims: readonly PortableTrustClaim[];
  };
  proof: PortableTrustProof;
}

export type PortableTrustVerification =
  | { ok: true; subjectId: string; aggregateScore: number }
  | {
      ok: false;
      reason:
        | "invalid-signature"
        | "expired"
        | "not-yet-valid"
        | "malformed"
        | "issuer-mismatch"
        | "unknown-algorithm";
    };

export interface VerifyPortableTrustParams {
  signingSecret: string;
  expectedIssuer?: string;
  now?: Date;
}

const DEFAULT_ISSUER = "did:web:forlilabs.it";
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const PROOF_TYPE = "HmacSha256-2026" as const;

export function scoreToTier(score: number): PortableTrustTier {
  return computeTier(Math.max(0, Math.min(100, score)));
}

/**
 * Evidence-weighted aggregation with a small-sample-size cap.
 *
 * - Empty list → 0.
 * - All-zero evidence → plain mean, capped at 75.
 * - Mixed evidence → weighted mean; cap at 75 when total evidence < 5.
 */
export function aggregateClaims(
  claims: readonly PortableTrustClaim[],
): number {
  if (claims.length === 0) return 0;

  const totalEvidence = claims.reduce(
    (sum, c) => sum + Math.max(0, c.evidenceCount),
    0,
  );

  if (totalEvidence === 0) {
    const mean =
      claims.reduce((sum, c) => sum + clamp(c.value), 0) / claims.length;
    return Math.min(75, Math.round(mean));
  }

  const weighted = claims.reduce(
    (sum, c) => sum + clamp(c.value) * Math.max(0, c.evidenceCount),
    0,
  );
  const raw = weighted / totalEvidence;
  const cap = totalEvidence < 5 ? 75 : 100;
  return Math.min(cap, Math.round(raw));
}

/**
 * Convert a CasaStudente `TenantScore` record into the canonical
 * PortableTrust claim list. One score record produces one claim today;
 * future versions may emit per-dimension claims so a landlord can
 * evaluate component scores in isolation.
 */
export function tenantScoreToPortableClaims(
  score: TenantScore,
): PortableTrustClaim[] {
  const evidenceCount =
    Math.max(0, score.scoreHistory.length) +
    (score.hasGuarantor ? 1 : 0) +
    (score.previousLandlordVerified ? 1 : 0);

  return [
    {
      app: "casa-studente",
      dimension: "tenant-score",
      value: clamp(score.overallScore),
      tier: score.tier,
      evidenceCount,
      lastEventAt: score.lastComputedAt,
      note: "Aggregate TenantScore from CasaStudente (payment punctuality, lease completion, landlord reviews, documents, verification, tenure).",
    },
  ];
}

export async function issuePortableTrust(
  params: IssuePortableTrustParams,
): Promise<PortableTrustCredential> {
  if (!params.subjectId) throw new TypeError("subjectId is required");
  if (!params.signingSecret) throw new TypeError("signingSecret is required");
  if (params.claims.length === 0) {
    throw new TypeError("at least one claim is required");
  }
  for (const claim of params.claims) {
    if (!Number.isFinite(claim.value)) {
      throw new TypeError(
        `claim ${claim.app}/${claim.dimension} has non-finite value`,
      );
    }
    if (!claim.lastEventAt || Number.isNaN(Date.parse(claim.lastEventAt))) {
      throw new TypeError(
        `claim ${claim.app}/${claim.dimension} has invalid lastEventAt`,
      );
    }
  }

  const issuer = params.issuer ?? DEFAULT_ISSUER;
  const ttl = params.ttlMs ?? DEFAULT_TTL_MS;
  const now = params.now ?? new Date();
  const issuanceDate = now.toISOString();
  const expirationDate = new Date(now.getTime() + ttl).toISOString();
  const aggregateScore = aggregateClaims(params.claims);
  const aggregateTier = scoreToTier(aggregateScore);

  const unsigned: Omit<PortableTrustCredential, "proof"> = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://forlilabs.it/contexts/portable-trust/v1",
    ],
    type: ["VerifiableCredential", "PortableTrustCredential"],
    issuer,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: params.subjectId,
      aggregateScore,
      aggregateTier,
      claims: params.claims.map((c) => ({ ...c })),
    },
  };

  const proof: PortableTrustProof = {
    type: PROOF_TYPE,
    created: issuanceDate,
    verificationMethod: `${issuer}#hmac-2026`,
    signatureValue: signCanonical(unsigned, params.signingSecret),
  };

  return { ...unsigned, proof };
}

export async function verifyPortableTrust(
  credential: PortableTrustCredential,
  params: VerifyPortableTrustParams,
): Promise<PortableTrustVerification> {
  if (!credential || typeof credential !== "object") {
    return { ok: false, reason: "malformed" };
  }
  const { proof, credentialSubject, issuanceDate, expirationDate, issuer } =
    credential;
  if (
    !proof ||
    !credentialSubject ||
    !credentialSubject.id ||
    !Array.isArray(credentialSubject.claims) ||
    !issuanceDate ||
    !expirationDate ||
    !issuer
  ) {
    return { ok: false, reason: "malformed" };
  }
  if (proof.type !== PROOF_TYPE) {
    return { ok: false, reason: "unknown-algorithm" };
  }
  if (params.expectedIssuer && params.expectedIssuer !== issuer) {
    return { ok: false, reason: "issuer-mismatch" };
  }

  const issued = Date.parse(issuanceDate);
  const expires = Date.parse(expirationDate);
  if (Number.isNaN(issued) || Number.isNaN(expires)) {
    return { ok: false, reason: "malformed" };
  }
  const now = (params.now ?? new Date()).getTime();
  if (now < issued - 60_000) return { ok: false, reason: "not-yet-valid" };
  if (now > expires) return { ok: false, reason: "expired" };

  const { proof: _proof, ...unsigned } = credential;
  void _proof;
  const expectedSig = signCanonical(unsigned, params.signingSecret);
  if (!constantTimeEqualHex(proof.signatureValue, expectedSig)) {
    return { ok: false, reason: "invalid-signature" };
  }

  return {
    ok: true,
    subjectId: credentialSubject.id,
    aggregateScore: credentialSubject.aggregateScore,
  };
}

/**
 * Get the active signing secret. In dev (no env) we fall back to a
 * stable string so the route still works locally; in prod the env var
 * must be set and at least 32 chars.
 *
 * Callers should treat the return value as confidential.
 */
export function getTrustSigningSecret(): string {
  const fromEnv = process.env.FORLI_TRUST_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FORLI_TRUST_SECRET must be set (≥32 chars) in production",
    );
  }
  return "casa-studente-dev-trust-secret-do-not-use-in-prod";
}

/* ------------------------------------------------------------------ */
/* internal helpers                                                   */
/* ------------------------------------------------------------------ */

function canonicalise(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalise).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalise(v)}`);
  return `{${entries.join(",")}}`;
}

function signCanonical(payload: unknown, secret: string): string {
  return createHmac("sha256", secret)
    .update(canonicalise(payload))
    .digest("hex");
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function constantTimeEqualHex(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

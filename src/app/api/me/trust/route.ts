import { apiError, apiSuccess } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { tenantScoreStore } from "@/lib/stores/tenant-score";
import {
  getTrustSigningSecret,
  issuePortableTrust,
  tenantScoreToPortableClaims,
} from "@/lib/trust/portable-trust";

/**
 * GET /api/me/trust — issue a PortableTrust verifiable credential
 * for the currently-authenticated student.
 *
 * Feature #4 (PortableTrust) from `NEXT-GEN-PLANNING.md`. The credential
 * aggregates this student's CasaStudente TenantScore into a portable
 * JSON object that other ForliLabs apps can verify offline using the
 * shared `FORLI_TRUST_SECRET`.
 *
 * Authorisation: any authenticated student. Landlords / admins use the
 * landlord-facing summary endpoint (`getTenantScoreForLandlord`) instead;
 * they should not be able to mint a credential on behalf of someone else
 * via this route.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("Unauthorized", { status: 401 });
  }
  if (user.role !== "student") {
    return apiError(
      "PortableTrust credentials are only issued for student accounts",
      { status: 403 },
    );
  }

  const scores = await tenantScoreStore.filter((s) => s.tenantId === user.id);
  const score = scores[0];
  if (!score) {
    return apiError("No tenant score available yet for this user", {
      status: 404,
    });
  }

  const claims = tenantScoreToPortableClaims(score);
  const credential = await issuePortableTrust({
    subjectId: `did:forli:cs:${user.id}`,
    claims,
    signingSecret: getTrustSigningSecret(),
  });

  return apiSuccess(credential, {
    meta: {
      subject: user.id,
      claimCount: claims.length,
      aggregateScore: credential.credentialSubject.aggregateScore,
      aggregateTier: credential.credentialSubject.aggregateTier,
    },
  });
}

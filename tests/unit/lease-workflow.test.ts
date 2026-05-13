import { describe, expect, it } from "vitest";
import type { LeaseContract } from "@/lib/stores";
import {
  canSendLeaseForSignature,
  canSignLease,
  getLeaseProgress,
  validateLeaseDates,
} from "@/lib/lease-workflow";

const draftLease: LeaseContract = {
  id: "lease-1",
  tenantId: "tenant-1",
  tenantName: "Tenant",
  landlordId: "landlord-1",
  landlordName: "Landlord",
  listingId: "listing-1",
  listingTitle: "Via Roma",
  address: "Via Roma 1",
  monthlyRent: 400,
  deposit: 800,
  startDate: "2026-09-01",
  endDate: "2027-08-31",
  contractType: "transitorio",
  taxRegime: "cedolare_secca",
  status: "draft",
  createdAt: new Date().toISOString(),
  signatureAuditTrail: ["Bozza creata dal proprietario"],
};

describe("lease workflow helpers", () => {
  it("rejects inverted lease dates", () => {
    expect(validateLeaseDates("2027-08-31", "2026-09-01")).toBeTruthy();
  });

  it("allows landlord to send draft lease for signature", () => {
    expect(canSendLeaseForSignature(draftLease, { id: "landlord-1", role: "landlord" })).toBe(true);
    expect(canSendLeaseForSignature(draftLease, { id: "tenant-1", role: "student" })).toBe(false);
  });

  it("allows tenant to sign only when pending signature", () => {
    const pendingLease: LeaseContract = {
      ...draftLease,
      status: "pending_signature",
      sentForSignatureAt: new Date().toISOString(),
      landlordSignedAt: new Date().toISOString(),
    };

    expect(canSignLease(pendingLease, { id: "tenant-1", role: "student" })).toBe(true);
    expect(canSignLease(pendingLease, { id: "landlord-1", role: "landlord" })).toBe(false);
  });

  it("builds progress cards with completed steps", () => {
    const activeLease: LeaseContract = {
      ...draftLease,
      status: "active",
      sentForSignatureAt: new Date().toISOString(),
      landlordSignedAt: new Date().toISOString(),
      tenantSignedAt: new Date().toISOString(),
    };

    const progress = getLeaseProgress(activeLease);
    expect(progress).toHaveLength(3);
    expect(progress.every((step) => step.completed)).toBe(true);
  });
});

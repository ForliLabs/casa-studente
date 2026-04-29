"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  qualityScoreStore,
  supplyDemandStore,
  landlordReferralStore,
  bulkImportStore,
  computeListingQuality,
  calculateVacancyCost,
  type ListingQualityScore,
  type SupplyDemandMetric,
  type LandlordReferral,
  type BulkImportJob,
} from "@/lib/stores/marketplace";
import { listingStore } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function getMarketplaceHealth(): Promise<{
  supplyDemand: SupplyDemandMetric[];
  qualityScores: ListingQualityScore[];
  referrals: LandlordReferral[];
  imports: BulkImportJob[];
  overview: {
    totalListings: number;
    avgQuality: number;
    deficitZones: number;
    totalReferrals: number;
  };
}> {
  const supplyDemand = await supplyDemandStore.findAll();
  const qualityScores = await qualityScoreStore.findAll();
  const referrals = await landlordReferralStore.findAll();
  const imports = await bulkImportStore.findAll();
  const listings = await listingStore.findAll();

  const avgQuality = qualityScores.length > 0
    ? Math.round((qualityScores.reduce((sum, q) => sum + q.overallScore, 0) / qualityScores.length) * 10) / 10
    : 0;

  return {
    supplyDemand: supplyDemand.sort((a, b) => b.ratio - a.ratio),
    qualityScores,
    referrals,
    imports,
    overview: {
      totalListings: listings.length,
      avgQuality,
      deficitZones: supplyDemand.filter((sd) => sd.gap === "deficit").length,
      totalReferrals: referrals.length,
    },
  };
}

export async function createReferralAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "landlord") {
    return { error: "Solo i proprietari possono invitare altri proprietari" };
  }

  const referredEmail = formData.get("referredEmail") as string;
  const referredName = formData.get("referredName") as string;

  if (!referredEmail) {
    return { error: "Email obbligatoria" };
  }

  // Check cap (max 10 referrals)
  const existing = await landlordReferralStore.filter((r) => r.referrerId === user.id);
  if (existing.length >= 10) {
    return { error: "Hai raggiunto il limite massimo di 10 referral" };
  }

  const referral: LandlordReferral = {
    id: `ref-${Date.now().toString(36)}`,
    referrerId: user.id,
    referrerName: user.name,
    referralCode: `${user.name.split(" ")[0].toUpperCase()}-CS2026`,
    referredEmail,
    referredName: referredName || undefined,
    status: "pending",
    rewardType: "fee_reduction",
    rewardValue: 2,
    createdAt: new Date().toISOString(),
  };

  await landlordReferralStore.create(referral);
  revalidatePath("/admin/marketplace");
  return { success: true };
}

export async function startBulkImportAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return { error: "Non autorizzato" };
  }

  const csvContent = formData.get("csvContent") as string;
  if (!csvContent) {
    return { error: "Contenuto CSV obbligatorio" };
  }

  const rows = csvContent.split("\n").filter((r) => r.trim().length > 0);
  const totalRows = Math.max(0, rows.length - 1); // minus header

  const job: BulkImportJob = {
    id: `import-${Date.now().toString(36)}`,
    userId: user.id,
    status: "completed",
    totalRows,
    processedRows: totalRows,
    successCount: totalRows,
    errorCount: 0,
    errors: [],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  await bulkImportStore.create(job);
  revalidatePath("/admin/marketplace");
  return { success: true, jobId: job.id, imported: totalRows };
}

export async function getVacancyCostEstimate(formData: FormData) {
  const monthlyRent = Number(formData.get("monthlyRent")) || 500;
  const utilityCost = Number(formData.get("utilityCost")) || 80;
  const daysVacant = Number(formData.get("daysVacant")) || 30;

  return calculateVacancyCost(monthlyRent, utilityCost, daysVacant);
}

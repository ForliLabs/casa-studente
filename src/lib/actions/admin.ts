"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { reviewStore } from "@/lib/stores";
import { journeyStore } from "@/lib/stores/journey";

export async function getAdminStats() {
  await requireAdmin();

  const users = await userStore.findAll();
  const listings = await listingStore.findAll();
  const reviews = await reviewStore.findAll();
  const journeys = await journeyStore.findAll();

  const students = users.filter((u) => u.role === "student");
  const landlords = users.filter((u) => u.role === "landlord");
  const pendingVerifications = users.filter((u) => !u.verified && u.role === "student");
  const flaggedReviews = reviews.filter((r) => r.flagged);
  const activeListings = listings.filter((l) => l.status === "Disponibile");
  const activeJourneys = journeys.filter((j) => !["completed", "reviewed", "cancelled"].includes(j.stage));

  return {
    totalUsers: users.length,
    students: students.length,
    landlords: landlords.length,
    totalListings: listings.length,
    activeListings: activeListings.length,
    pendingVerifications: pendingVerifications.length,
    flaggedReviews: flaggedReviews.length,
    totalReviews: reviews.length,
    activeJourneys: activeJourneys.length,
    totalJourneys: journeys.length,
  };
}

export async function getAllUsers() {
  await requireAdmin();
  return userStore.findAll();
}

export async function updateUserAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const userId = formData.get("userId") as string;
  const action = formData.get("action") as string;

  if (!userId || !action) return;

  const user = await userStore.findById(userId);
  if (!user) return;

  switch (action) {
    case "verify":
      await userStore.update(userId, { verified: true });
      break;
    case "unverify":
      await userStore.update(userId, { verified: false });
      break;
    case "ban":
      await userStore.update(userId, { banned: true, banReason: formData.get("reason") as string || "Violazione termini di servizio" });
      break;
    case "unban":
      await userStore.update(userId, { banned: false, banReason: undefined });
      break;
  }

  revalidatePath("/admin/users");
}

export async function approveListingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  if (!listingId) return;

  await listingStore.update(listingId, { verified: true });
  revalidatePath("/admin/moderation");
  revalidatePath("/listings");
}

export async function flagReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const reviewId = formData.get("reviewId") as string;
  const action = formData.get("action") as "approve" | "remove";

  if (!reviewId) return;

  if (action === "approve") {
    await reviewStore.update(reviewId, { flagged: false });
  } else if (action === "remove") {
    await reviewStore.delete(reviewId);
  }

  revalidatePath("/admin/moderation");
}

export async function getConversionFunnel() {
  await requireAdmin();

  const users = await userStore.findAll();
  const journeys = await journeyStore.findAll();

  const signups = users.length;
  const profileComplete = users.filter((u) => u.profileComplete).length;
  const contacted = journeys.filter((j) => j.stageHistory.some((s) => s.stage === "contacted")).length;
  const applied = journeys.filter((j) => j.stageHistory.some((s) => s.stage === "applied")).length;
  const leaseSigned = journeys.filter((j) => j.stageHistory.some((s) => s.stage === "lease_signed")).length;

  return [
    { stage: "Registrazioni", count: signups },
    { stage: "Profilo completo", count: profileComplete },
    { stage: "Primo contatto", count: contacted },
    { stage: "Candidatura", count: applied },
    { stage: "Contratto firmato", count: leaseSigned },
  ];
}

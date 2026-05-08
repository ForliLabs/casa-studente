"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validation";
import { reviewStore, type Review } from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitReviewAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per lasciare una recensione" };
  }

  const parsed = createReviewSchema.safeParse({
    revieweeId: formData.get("revieweeId"),
    revieweeName: formData.get("revieweeName"),
    listingId: formData.get("listingId"),
    listingTitle: formData.get("listingTitle"),
    ratingOverall: formData.get("ratingOverall"),
    ratingCleanliness: formData.get("ratingCleanliness") || formData.get("ratingOverall"),
    ratingCommunication: formData.get("ratingCommunication") || formData.get("ratingOverall"),
    ratingAccuracy: formData.get("ratingAccuracy") || formData.get("ratingOverall"),
    ratingValue: formData.get("ratingValue") || formData.get("ratingOverall"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const review: Review = {
    id: `review-${generateId()}`,
    reviewerId: user.id,
    reviewerName: user.name,
    reviewerRole: user.role as "student" | "landlord",
    revieweeId: parsed.data.revieweeId,
    revieweeName: parsed.data.revieweeName,
    listingId: parsed.data.listingId,
    listingTitle: parsed.data.listingTitle,
    ratingOverall: parsed.data.ratingOverall,
    ratingCleanliness: parsed.data.ratingCleanliness,
    ratingCommunication: parsed.data.ratingCommunication,
    ratingAccuracy: parsed.data.ratingAccuracy,
    ratingValue: parsed.data.ratingValue,
    comment: parsed.data.comment,
    verifiedLease: false,
    createdAt: new Date().toISOString(),
    flagged: false,
  };

  await reviewStore.create(review);
  revalidatePath("/reviews");
  revalidatePath(`/listings/${parsed.data.listingId}`);
  return { success: true };
}

export async function flagReviewAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per segnalare una recensione" };
  }

  const reviewId = formData.get("reviewId") as string;
  if (!reviewId) return { error: "ID recensione mancante" };

  await reviewStore.update(reviewId, { flagged: true });
  revalidatePath("/reviews");
  return { success: true, message: "Recensione segnalata. Verrà esaminata dal team." };
}

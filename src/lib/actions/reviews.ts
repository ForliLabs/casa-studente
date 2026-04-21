"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { reviewStore, type Review } from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitReviewAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per lasciare una recensione" };
  }

  const revieweeId = formData.get("revieweeId") as string;
  const revieweeName = formData.get("revieweeName") as string;
  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const ratingOverall = Number(formData.get("ratingOverall"));
  const ratingCleanliness = Number(formData.get("ratingCleanliness"));
  const ratingCommunication = Number(formData.get("ratingCommunication"));
  const ratingAccuracy = Number(formData.get("ratingAccuracy"));
  const ratingValue = Number(formData.get("ratingValue"));
  const comment = formData.get("comment") as string;

  if (!ratingOverall || ratingOverall < 1 || ratingOverall > 5) {
    return { error: "Valutazione complessiva obbligatoria (1-5)" };
  }

  if (!comment?.trim()) {
    return { error: "Il commento è obbligatorio" };
  }

  const review: Review = {
    id: `review-${generateId()}`,
    reviewerId: user.id,
    reviewerName: user.name,
    reviewerRole: user.role as "student" | "landlord",
    revieweeId,
    revieweeName,
    listingId,
    listingTitle,
    ratingOverall,
    ratingCleanliness: ratingCleanliness || ratingOverall,
    ratingCommunication: ratingCommunication || ratingOverall,
    ratingAccuracy: ratingAccuracy || ratingOverall,
    ratingValue: ratingValue || ratingOverall,
    comment: comment.trim(),
    verifiedLease: false,
    createdAt: new Date().toISOString(),
    flagged: false,
  };

  await reviewStore.create(review);
  revalidatePath("/reviews");
  revalidatePath(`/listings/${listingId}`);
  return { success: true };
}

export async function flagReviewAction(formData: FormData) {
  const reviewId = formData.get("reviewId") as string;
  if (!reviewId) return { error: "ID recensione mancante" };

  await reviewStore.update(reviewId, { flagged: true });
  revalidatePath("/reviews");
  return { success: true, message: "Recensione segnalata. Verrà esaminata dal team." };
}

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, userStore } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validation";
import { reviewStore, type Review } from "@/lib/stores";
import { getListingById } from "@/lib/data";

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
    ratingCleanliness: formData.get("ratingCleanliness"),
    ratingCommunication: formData.get("ratingCommunication"),
    ratingAccuracy: formData.get("ratingAccuracy"),
    ratingValue: formData.get("ratingValue"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // --- Server-side verification: do not trust client-supplied identity ---

  // Prevent self-reviews
  if (user.id === parsed.data.revieweeId) {
    return { error: "Non puoi recensire te stesso" };
  }

  // Verify listing exists
  const listing = await getListingById(parsed.data.listingId);
  if (!listing) {
    return { error: "Annuncio non trovato" };
  }

  // Resolve the actual landlord from the listing
  const landlordAccounts = await userStore.filter(
    (u) => u.email === listing.landlord.email
  );
  const landlordAccount = landlordAccounts[0];
  if (!landlordAccount) {
    return { error: "Proprietario non trovato" };
  }

  // Verify the reviewee matches the listing's actual landlord
  if (landlordAccount.id !== parsed.data.revieweeId) {
    return { error: "Il destinatario della recensione non corrisponde al proprietario dell'annuncio" };
  }

  // Prevent duplicate reviews (same reviewer + same listing)
  const existingReviews = await reviewStore.filter(
    (r) => r.reviewerId === user.id && r.listingId === parsed.data.listingId
  );
  if (existingReviews.length > 0) {
    return { error: "Hai già lasciato una recensione per questo annuncio" };
  }

  const review: Review = {
    id: `review-${generateId()}`,
    reviewerId: user.id,
    reviewerName: user.name,
    reviewerRole: user.role as "student" | "landlord",
    revieweeId: landlordAccount.id,
    revieweeName: landlordAccount.name,
    listingId: listing.id,
    listingTitle: listing.title,
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
  revalidatePath(`/listings/${listing.id}`);
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

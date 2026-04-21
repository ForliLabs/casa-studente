import type { Metadata } from "next";
import { reviewStore, calculateTrustScore } from "@/lib/stores";
import { ReviewList } from "@/components/review-list";

export const metadata: Metadata = {
  title: "Recensioni",
  description: "Recensioni verificate di proprietari e studenti su CasaStudente.",
};

export default async function ReviewsPage() {
  const reviews = await reviewStore.findAll();

  // Calculate trust scores per user
  const reviewsByUser = new Map<string, typeof reviews>();
  for (const review of reviews) {
    const existing = reviewsByUser.get(review.revieweeId) || [];
    existing.push(review);
    reviewsByUser.set(review.revieweeId, existing);
  }

  const trustScores = new Map<string, ReturnType<typeof calculateTrustScore>>();
  for (const [userId, userReviews] of reviewsByUser) {
    trustScores.set(userId, calculateTrustScore(userReviews, true, 180));
  }

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Recensioni e fiducia
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Cosa dicono studenti e proprietari
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Recensioni verificate da utenti con contratti reali. Il sistema di trust score premia
            chi mantiene standard elevati.
          </p>
        </div>

        <div className="mt-10">
          <ReviewList reviews={reviews} trustScores={Object.fromEntries(trustScores)} />
        </div>
      </div>
    </main>
  );
}

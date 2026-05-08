"use client";

import { cn } from "@/lib/utils";

interface ReviewData {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "student" | "landlord";
  revieweeId: string;
  revieweeName: string;
  listingTitle: string;
  ratingOverall: number;
  ratingCleanliness: number;
  ratingCommunication: number;
  ratingAccuracy: number;
  ratingValue: number;
  comment: string;
  verifiedLease: boolean;
  createdAt: string;
  flagged: boolean;
}

interface TrustScoreData {
  score: number;
  badge: "bronze" | "silver" | "gold" | "none";
}

interface ReviewListProps {
  reviews: ReviewData[];
  trustScores: Record<string, TrustScoreData>;
}

const badgeColors = {
  none: "",
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-gray-200 text-gray-800",
  gold: "bg-yellow-100 text-yellow-800",
};

const badgeLabels = {
  none: "",
  bronze: "🥉 Bronze",
  silver: "🥈 Silver",
  gold: "🥇 Gold",
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div
      role="img"
      aria-label={`${rating} su 5 stelle`}
      className={cn("flex gap-0.5", size === "lg" ? "text-lg" : "text-sm")}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true" className={star <= rating ? "text-amber-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewList({ reviews, trustScores }: ReviewListProps) {
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Trust score summary */}
      {Object.keys(trustScores).length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(trustScores).map(([userId, score]) => {
            const userReviews = reviews.filter((r) => r.revieweeId === userId);
            const userName = userReviews[0]?.revieweeName || "Utente";
            return (
              <div key={userId} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{userName}</h3>
                  {score.badge !== "none" && (
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", badgeColors[score.badge])}>
                      {badgeLabels[score.badge]}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{score.score}</span>
                  <span className="text-sm text-gray-500">/ 5.0</span>
                  <StarRating rating={Math.round(score.score)} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{userReviews.length} recensioni</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Review cards */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {review.reviewerRole === "student" ? "Studente" : "Proprietario"}
                  </span>
                  {review.verifiedLease && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      ✓ Contratto verificato
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Recensione per <span className="font-medium">{review.revieweeName}</span> · {review.listingTitle}
                </p>
              </div>
              <StarRating rating={review.ratingOverall} size="lg" />
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">{review.comment}</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Pulizia", value: review.ratingCleanliness },
                { label: "Comunicazione", value: review.ratingCommunication },
                { label: "Precisione", value: review.ratingAccuracy },
                { label: "Rapporto qualità/prezzo", value: review.ratingValue },
              ].map((cat) => (
                <div key={cat.label} className="rounded-xl bg-gray-50 p-2 text-center">
                  <p className="text-xs text-gray-500">{cat.label}</p>
                  <div className="mt-1 flex justify-center">
                    <StarRating rating={cat.value} />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </article>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">Nessuna recensione ancora</p>
          <p className="mt-2 text-sm text-gray-500">
            Le recensioni appariranno qui dopo il completamento dei primi contratti.
          </p>
        </div>
      )}
    </div>
  );
}

import { userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { reviewStore } from "@/lib/stores";
import { approveListingAction, flagReviewAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { AlertTriangle, BadgeCheck, Flag } from "lucide-react";

export default async function ModerationPage() {
  await requireAdmin();

  const users = await userStore.findAll();
  const pendingVerifications = users.filter((u) => !u.verified && u.role === "student");
  const listings = await listingStore.findAll();
  const unverifiedListings = listings.filter((l) => !l.verified);
  const reviews = await reviewStore.findAll();
  const flaggedReviews = reviews.filter((r) => r.flagged);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Moderazione</h1>

      {/* Verification Queue */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
          Verifiche in attesa ({pendingVerifications.length})
        </h2>
        {pendingVerifications.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Nessuna verifica in attesa ✓</p>
        ) : (
          <div className="space-y-3">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email} · Matricola: {user.universityId || "Non fornita"}</p>
                </div>
                <form action={async (formData: FormData) => {
                  "use server";
                  const { updateUserAction } = await import("@/lib/actions/admin");
                  await updateUserAction(formData);
                }}>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="action" value="verify" />
                  <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                    Approva
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listing Approval */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Annunci da verificare ({unverifiedListings.length})
        </h2>
        {unverifiedListings.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Tutti gli annunci sono verificati ✓</p>
        ) : (
          <div className="space-y-3">
            {unverifiedListings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500">{listing.address} · €{listing.price}/mese · {listing.landlord.name}</p>
                </div>
                <form action={approveListingAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Verifica
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Flagged Reviews */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Flag className="h-5 w-5 text-red-600" />
          Recensioni segnalate ({flaggedReviews.length})
        </h2>
        {flaggedReviews.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Nessuna recensione segnalata ✓</p>
        ) : (
          <div className="space-y-3">
            {flaggedReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-3">
                  <p className="font-medium text-gray-900">{review.reviewerName} → {review.revieweeName}</p>
                  <p className="text-sm text-gray-600">&ldquo;{review.comment}&rdquo;</p>
                  <p className="mt-1 text-xs text-gray-400">Voto: {review.ratingOverall}/5 · {review.listingTitle}</p>
                </div>
                <div className="flex gap-2">
                  <form action={flagReviewAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button type="submit" className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                      Approva
                    </button>
                  </form>
                  <form action={flagReviewAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="action" value="remove" />
                    <button type="submit" className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                      Rimuovi
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

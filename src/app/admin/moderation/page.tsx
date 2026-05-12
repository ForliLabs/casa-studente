import { requireAdmin, userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { reviewStore } from "@/lib/stores";
import { approveListingAction, flagReviewAction, updateUserAction } from "@/lib/actions/admin";
import { AlertTriangle, BadgeCheck, FileText, Flag, ShieldAlert } from "lucide-react";

export default async function ModerationPage() {
  await requireAdmin();

  const [users, listings, reviews] = await Promise.all([
    userStore.findAll(),
    listingStore.findAll(),
    reviewStore.findAll(),
  ]);
  const pendingVerifications = users
    .filter((user) => !user.verified && user.role === "student")
    .sort((a, b) => Number(Boolean(a.universityDocument)) - Number(Boolean(b.universityDocument)));
  const unverifiedListings = listings
    .filter((listing) => !listing.verified)
    .sort((a, b) => Number(b.virtualTour) - Number(a.virtualTour) || b.price - a.price);
  const flaggedReviews = reviews
    .filter((review) => review.flagged)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const summaryCards = [
    {
      label: "Verifiche studenti",
      value: pendingVerifications.length,
      description: "Documenti e onboarding da controllare",
      color: "bg-blue-50 text-blue-700",
      icon: <BadgeCheck className="h-5 w-5" />,
    },
    {
      label: "Annunci da moderare",
      value: unverifiedListings.length,
      description: "Priorità agli annunci senza tour o con dati incompleti",
      color: "bg-amber-50 text-amber-700",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      label: "Recensioni segnalate",
      value: flaggedReviews.length,
      description: "Valuta contenuti e rimuovi eventuali abusi",
      color: "bg-red-50 text-red-700",
      icon: <Flag className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Admin moderation</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Code di moderazione</h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600">
          Vista operativa per gestire verifiche studente, annunci non verificati e recensioni segnalate con contesto sufficiente per prendere decisioni rapide.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-full p-2 ${card.color}`}>{card.icon}</div>
            <p className="mt-4 text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
          Verifiche in attesa ({pendingVerifications.length})
        </h2>
        {pendingVerifications.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Nessuna verifica in attesa ✓</p>
        ) : (
          <div className="space-y-3">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.universityDocument ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {user.universityDocument ? "Documento caricato" : "Documento mancante"}
                      </span>
                      {!user.profileComplete && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Profilo incompleto</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{user.email} · Matricola: {user.universityId || "Non fornita"}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Registrato il {new Date(user.createdAt).toLocaleDateString("it-IT")} · Onboarding {user.onboardingComplete ? "completato" : "non completato"}
                    </p>
                  </div>
                  <form action={updateUserAction}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="action" value="verify" />
                    <button type="submit" className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700">
                      Approva verifica
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Annunci da verificare ({unverifiedListings.length})
        </h2>
        {unverifiedListings.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Tutti gli annunci sono verificati ✓</p>
        ) : (
          <div className="space-y-3">
            {unverifiedListings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-900">{listing.title}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${listing.virtualTour ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {listing.virtualTour ? "Tour virtuale presente" : "Tour virtuale assente"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {listing.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{listing.address} · €{listing.price}/mese · {listing.landlord.name}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {listing.features.slice(0, 3).join(" · ")} · Disponibile da {listing.availableFrom}
                    </p>
                  </div>
                  <form action={approveListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                      Verifica annuncio
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Flag className="h-5 w-5 text-red-600" />
          Recensioni segnalate ({flaggedReviews.length})
        </h2>
        {flaggedReviews.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Nessuna recensione segnalata ✓</p>
        ) : (
          <div className="space-y-3">
            {flaggedReviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-900">{review.reviewerName} → {review.revieweeName}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-red-700">
                        <ShieldAlert className="h-3.5 w-3.5" /> Flag attivo
                      </span>
                      {review.verifiedLease && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <FileText className="h-3.5 w-3.5" /> Lease verificata
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">&ldquo;{review.comment}&rdquo;</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Voto: {review.ratingOverall}/5 · {review.listingTitle} · {new Date(review.createdAt).toLocaleDateString("it-IT")}
                    </p>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

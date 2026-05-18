import { formatAvailableFrom } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { FavoriteButton } from "@/components/favorite-button";
import { ImageGallery } from "@/components/image-upload";
import { MonthlyCostCalculator } from "@/components/monthly-cost-calculator";
import { ReviewForm } from "@/components/review-form";
import { ShareListingButton } from "@/components/share-listing-button";
import { SingleListingMap } from "@/components/listing-map";
import { TourRequestPanel } from "@/components/tour-request-panel";
import { getCurrentUser, userStore } from "@/lib/auth";
import { getListingById } from "@/lib/data";
import { getLandlordAvailability, getVirtualTour360 } from "@/lib/actions/tours";
import { getFavoriteListingIds } from "@/lib/actions/favorites";
import { reviewStore, calculateTrustScore } from "@/lib/stores";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return { title: "Annuncio non trovato" };
  }

  return {
    title: listing.title,
    description: `${listing.type} in ${listing.address} a ${listing.price}/mese. ${listing.description}`,
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // Resolve landlord account first so we can filter reviews by the stable revieweeId,
  // not the mutable display name which can be changed independently.
  const [listingReviews, landlordAccount, currentUser, favoriteIds] = await Promise.all([
    reviewStore.filter((review) => review.listingId === id),
    userStore.filter((candidate) => candidate.email === listing.landlord.email).then((users) => users[0] ?? null),
    getCurrentUser(),
    getFavoriteListingIds(),
  ]);
  const landlordReviews = landlordAccount
    ? await reviewStore.filter((review) => review.revieweeId === landlordAccount.id)
    : [];
  const [virtualTour360, landlordAvailability] = await Promise.all([
    getVirtualTour360(listing.id),
    landlordAccount ? getLandlordAvailability(landlordAccount.id) : Promise.resolve([]),
  ]);
  const trustScore = calculateTrustScore(landlordReviews, listing.verified, 180);

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/listings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          &larr; Torna agli annunci
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="space-y-8">
            {/* Main info */}
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {listing.type}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {listing.neighborhood}
                    </span>
                    {listing.verified && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Annuncio verificato
                      </span>
                    )}
                  </div>
                  <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
                    {listing.title}
                  </h1>
                  <p className="mt-3 text-lg text-gray-600">{listing.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-lg">
                    <p className="text-sm text-slate-300">Canone mensile</p>
                    <p className="mt-1 text-3xl font-bold">&euro;{listing.price}</p>
                  </div>
                  <FavoriteButton
                    listingId={listing.id}
                    isFavorited={favoriteIds.includes(listing.id)}
                    size="md"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Superficie</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{listing.size} m&sup2;</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Camere</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{listing.rooms}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Bagni</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{listing.bathrooms}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Disponibilit&agrave;</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatAvailableFrom(listing.availableFrom)}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Descrizione</h2>
                <p className="mt-3 leading-7 text-gray-600">{listing.description}</p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Servizi e caratteristiche</h2>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600">
                    {listing.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Dettagli economici</h2>
                  <dl className="mt-4 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                      <dt>Deposito cauzionale</dt>
                      <dd className="font-semibold text-gray-900">&euro;{listing.deposit}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                      <dt>Utenze e spese</dt>
                      <dd className="font-semibold text-right text-gray-900">{listing.utilities}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                      <dt>Piano</dt>
                      <dd className="font-semibold text-gray-900">{listing.floor}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            {/* Monthly Cost Calculator */}
            <MonthlyCostCalculator
              rent={listing.price}
              utilities={listing.utilities}
              zone={listing.zone}
            />

            {/* Image Gallery (Feature 3) */}
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <ImageGallery
                images={listing.photos}
                virtualTour={listing.virtualTour}
                virtualTourData={virtualTour360}
              />
            </section>

            {/* Interactive Map (Feature 5) */}
            <SingleListingMap listingId={listing.id} address={listing.address} nearby={listing.nearby} />

            {/* Reviews for this listing (Feature 8) */}
            {listingReviews.length > 0 && (
              <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">Recensioni</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {listingReviews.length} recensioni per questo annuncio
                </p>
                <div className="mt-6 space-y-4">
                  {listingReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                          {review.verifiedLease && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                              Verificato
                            </span>
                          )}
                        </div>
                        <div className="flex gap-0.5 text-sm">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={s <= review.ratingOverall ? "text-amber-500" : "text-gray-300"}>
                              &#9733;
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Review submission form — visible only to logged-in users */}
            {currentUser && landlordAccount && currentUser.id !== landlordAccount.id && (
              <ReviewForm
                listingId={listing.id}
                listingTitle={listing.title}
                revieweeId={landlordAccount.id}
                revieweeName={listing.landlord.name}
              />
            )}
          </div>

          {/* Sidebar — sticky on desktop so CTAs stay reachable while scrolling */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Proprietario</h2>
              <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{listing.landlord.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{listing.landlord.role}</p>
                  </div>
                  {trustScore.badge !== "none" && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      trustScore.badge === "gold" ? "bg-yellow-100 text-yellow-800" :
                      trustScore.badge === "silver" ? "bg-gray-200 text-gray-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {trustScore.badge === "gold" ? "Gold" : trustScore.badge === "silver" ? "Silver" : "Bronze"}
                    </span>
                  )}
                </div>
                {landlordReviews.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-0.5 text-sm">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={s <= Math.round(trustScore.score) ? "text-amber-500" : "text-gray-300"}>
                          &#9733;
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{trustScore.score}</span>
                    <span className="text-xs text-gray-500">({landlordReviews.length} recensioni)</span>
                  </div>
                )}
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-900">Email:</span> {listing.landlord.email}</p>
                  <p><span className="font-medium text-gray-900">Telefono:</span> {listing.landlord.phone}</p>
                  <p><span className="font-medium text-gray-900">Lingue:</span> {listing.landlord.languages.join(", ")}</p>
                  <p><span className="font-medium text-gray-900">Tasso di risposta:</span> {listing.landlord.responseRate}</p>
                  <p><span className="font-medium text-gray-900">Tempo medio:</span> {listing.landlord.responseTime}</p>
                </div>
              </div>
            </section>

            <ContactForm
              listingId={listing.id}
              listingTitle={listing.title}
              landlordName={listing.landlord.name}
              landlordEmail={listing.landlord.email}
              landlordId={landlordAccount?.id}
              isLoggedIn={!!currentUser}
              userName={currentUser?.name}
              userEmail={currentUser?.email}
            />

            {landlordAccount && (
              <TourRequestPanel
                listingId={listing.id}
                listingTitle={listing.title}
                landlordId={landlordAccount.id}
                landlordName={listing.landlord.name}
                availability={landlordAvailability}
                isLoggedIn={!!currentUser}
              />
            )}

            {/* Sidebar quick actions — only genuinely conversion-relevant items */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Azioni rapide</h3>
              <div className="mt-4 space-y-3">
                <ShareListingButton listingId={listing.id} listingTitle={listing.title} />
                {favoriteIds.length >= 2 && (
                  <Link
                    href={`/listings/compare?ids=${favoriteIds.slice(0, 4).join(",")}`}
                    className="block rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Confronta preferiti ({Math.min(favoriteIds.length, 4)})
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

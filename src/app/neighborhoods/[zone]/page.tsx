import { neighborhoodStore, neighborhoodTipStore } from "@/lib/stores/neighborhoods";
import { listingStore } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bus, MapPin, Shield, ThumbsUp, Users, Volume2 } from "lucide-react";

export default async function NeighborhoodDetailPage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params;
  const neighborhoods = await neighborhoodStore.findAll();
  const neighborhood = neighborhoods.find(
    (n) => n.zone.toLowerCase().replace(/\s+/g, "-") === zone
  );

  if (!neighborhood) notFound();

  const tips = await neighborhoodTipStore.filter((t) => t.neighborhoodId === neighborhood.id);
  const listings = await listingStore.filter((l) => l.zone === neighborhood.zone);

  const noiseLabelIt: Record<string, string> = { quiet: "Tranquillo", moderate: "Moderato", lively: "Vivace" };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/neighborhoods" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Tutti i quartieri
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{neighborhood.name}</h1>
        <p className="mt-3 text-lg text-gray-600">{neighborhood.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4 text-green-600" /> Sicurezza
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{neighborhood.safetyRating}/5</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Volume2 className="h-4 w-4 text-amber-600" /> Rumore
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{noiseLabelIt[neighborhood.noiseLevel]}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4 text-blue-600" /> Studenti
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 capitalize">{neighborhood.studentDensity}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 text-purple-600" /> Affitto medio
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">€{neighborhood.avgRent}</p>
        </div>
      </div>

      {/* Amenities */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Servizi e punti di interesse</h2>
        <div className="flex flex-wrap gap-2">
          {neighborhood.amenities.map((a) => (
            <span key={a} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{a}</span>
          ))}
        </div>
      </section>

      {/* Bus Routes */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Bus className="h-5 w-5 text-gray-600" /> Trasporto pubblico
        </h2>
        <div className="space-y-2">
          {neighborhood.busRoutes.map((route) => (
            <div key={route.line} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                {route.line}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{route.destination}</p>
                <p className="text-xs text-gray-500">{route.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Annunci disponibili ({listings.length})
          </h2>
          <div className="space-y-2">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500">{listing.type} · {listing.size} mq</p>
                </div>
                <p className="text-lg font-bold text-gray-900">€{listing.price}<span className="text-sm font-normal text-gray-500">/mese</span></p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Community tips */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Consigli degli studenti</h2>
        {tips.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Nessun consiglio ancora. Sii il primo!</p>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div key={tip.id} className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-700">{tip.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {tip.userName} · {new Date(tip.createdAt).toLocaleDateString("it-IT")}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ThumbsUp className="h-3 w-3" /> {tip.upvotes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

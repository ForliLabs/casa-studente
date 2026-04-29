import type { Metadata } from "next";
import Link from "next/link";
import { getPersonalizedFeed } from "@/lib/actions/matching";
import { Heart, MapPin, Sparkles, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Per Te",
  description: "Annunci personalizzati selezionati per te dal nostro motore di raccomandazione.",
};

export default async function ForYouPage() {
  const feed = await getPersonalizedFeed();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
              Per Te
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Annunci selezionati per te
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Il nostro motore di raccomandazione analizza le tue preferenze, ricerche salvate e comportamento
          per trovare gli annunci più adatti a te. Più usi la piattaforma, migliori diventano i suggerimenti.
        </p>
      </section>

      {feed.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Heart className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Nessun suggerimento ancora</h2>
          <p className="mt-2 text-gray-500">
            Esplora gli annunci, salva le ricerche e il motore di raccomandazione imparerà le tue preferenze.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
          >
            Esplora annunci
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((match, index) => (
            <Link
              key={match.listingId}
              href={`/listings/${match.listingId}`}
              className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        Top match
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{match.listingTitle}</h3>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {match.zone}
                    </span>
                    <span>€{match.price}/mese</span>
                    <span>{match.type}</span>
                  </div>

                  {/* Match reasons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.matchReasons
                      .filter((r) => r.score > 10)
                      .slice(0, 4)
                      .map((reason) => (
                        <span
                          key={reason.factor}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                        >
                          {reason.label}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative h-14 w-14">
                    <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle
                        cx="28" cy="28" r="24" fill="none"
                        stroke={match.matchScore >= 80 ? "#7c3aed" : match.matchScore >= 60 ? "#3b82f6" : "#9ca3af"}
                        strokeWidth="4"
                        strokeDasharray={`${(match.matchScore / 100) * 150.8} 150.8`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                      {match.matchScore}%
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">Match</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
        <h3 className="font-semibold text-purple-900">Come funziona il matching?</h3>
        <ul className="mt-3 space-y-2 text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span><strong>Budget (25%)</strong> — Confronto con il tuo range di prezzo</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span><strong>Zona (20%)</strong> — Match con le zone preferite e visitate</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span><strong>Tipologia (20%)</strong> — Tipo di alloggio preferito</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span><strong>Reputazione (10%)</strong> — Punteggio del proprietario</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span><strong>Social proof (10%)</strong> — Popolarità tra studenti simili</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getAllListings, type Listing } from "@/lib/data";
import { getFavoriteListingIds } from "@/lib/actions/favorites";
import { calculateMonthlyCost } from "@/lib/stores";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareExportBar } from "@/components/share-export-bar";

export const metadata: Metadata = {
  title: "Confronta annunci",
  description: "Confronta fianco a fianco gli annunci salvati per trovare la soluzione migliore.",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { ids: idsParam } = await searchParams;
  const allListings = await getAllListings();
  const favoriteIds = await getFavoriteListingIds();

  // Use provided IDs or fall back to all favorites; sanitize and cap at 4
  const MAX_COMPARE = 4;
  const requestedIds = (idsParam
    ? idsParam.split(",").filter(Boolean)
    : favoriteIds
  ).filter((id) => /^[\w-]+$/.test(id)).slice(0, MAX_COMPARE);

  const listings: Listing[] = requestedIds
    .map((id) => allListings.find((l) => l.id === id))
    .filter((l): l is Listing => l !== undefined);

  if (listings.length < 2) {
    return (
      <main className="flex-1 bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/listings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            &larr; Torna agli annunci
          </Link>
          <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-12 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Confronta annunci</h1>
            <p className="mt-4 text-gray-600">
              Salva almeno 2 annunci tra i preferiti per poterli confrontare fianco a fianco.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Esplora annunci
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const breakdowns = listings.map((l) => calculateMonthlyCost(l.price, l.utilities, l.zone));

  const compareFields: Array<{ label: string; render: (index: number) => string }> = [
    { label: "Tipo", render: (i) => listings[i].type },
    { label: "Zona", render: (i) => listings[i].zone },
    { label: "Indirizzo", render: (i) => listings[i].address },
    { label: "Canone", render: (i) => `€${listings[i].price}/mese` },
    { label: "Deposito", render: (i) => `€${listings[i].deposit}` },
    { label: "Utenze", render: (i) => listings[i].utilities },
    { label: "Costo totale stimato", render: (i) => `€${breakdowns[i].totalEstimate}/mese` },
    { label: "Superficie", render: (i) => `${listings[i].size} m²` },
    { label: "Camere", render: (i) => String(listings[i].rooms) },
    { label: "Bagni", render: (i) => String(listings[i].bathrooms) },
    { label: "Piano", render: (i) => listings[i].floor },
    { label: "Disponibilità", render: (i) => listings[i].availableFrom },
    { label: "Stato", render: (i) => listings[i].status },
  ];

  type BooleanListingKey = "verified" | "virtualTour" | "securePayments" | "furnished";

  const booleanFields: Array<{ label: string; key: BooleanListingKey }> = [
    { label: "Verificato", key: "verified" },
    { label: "Tour virtuale", key: "virtualTour" },
    { label: "Pagamenti sicuri", key: "securePayments" },
    { label: "Arredato", key: "furnished" },
  ];

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/listings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          &larr; Torna agli annunci
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Confronto
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Confronta {listings.length} annunci
            </h1>
          </div>
          <ShareExportBar listings={listings} />
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <caption className="sr-only">
              Confronto tra {listings.length} annunci selezionati
            </caption>
            {/* Header row with listing cards */}
            <thead>
              <tr>
                <th scope="col" className="w-40 p-2">
                  <span className="sr-only">Caratteristica</span>
                </th>
                {listings.map((listing, i) => (
                  <th key={listing.id} scope="col" className="p-2 align-top">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-left text-base font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {listing.title}
                        </Link>
                        <FavoriteButton
                          listingId={listing.id}
                          isFavorited={favoriteIds.includes(listing.id)}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{listing.neighborhood}</p>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">&euro;{listing.price}</span>
                        <span className="text-sm text-gray-500">/mese</span>
                      </div>
                      <div className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-center text-sm font-medium text-indigo-700">
                        Totale stimato: &euro;{breakdowns[i].totalEstimate}/mese
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {compareFields.map((field) => (
                <tr key={field.label} className="border-t border-gray-100">
                  <th scope="row" className="p-3 text-left text-sm font-medium text-gray-500">{field.label}</th>
                  {listings.map((_, i) => {
                    const val = field.render(i);
                    const isLowest = field.label === "Canone" || field.label === "Costo totale stimato";
                    const values = listings.map((__, j) => field.render(j));
                    const highlight = isLowest && val === values.sort()[0];
                    return (
                      <td
                        key={listings[i].id}
                        className={`p-3 text-sm ${highlight ? "font-semibold text-emerald-700" : "text-gray-900"}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Boolean feature rows */}
              {booleanFields.map((field) => (
                <tr key={field.label} className="border-t border-gray-100">
                  <th scope="row" className="p-3 text-left text-sm font-medium text-gray-500">{field.label}</th>
                  {listings.map((listing) => (
                    <td key={listing.id} className="p-3 text-center">
                      {listing[field.key] ? (
                        <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          ✓ Sì
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          — No
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Features */}
              <tr className="border-t border-gray-200">
                <th scope="row" className="p-3 text-left text-sm font-medium text-gray-500">Servizi</th>
                {listings.map((listing) => (
                  <td key={listing.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {listing.features.map((f) => (
                        <span key={f} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr className="border-t border-gray-200">
                <td className="p-3" />
                {listings.map((listing) => (
                  <td key={listing.id} className="p-3">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Vedi dettaglio
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

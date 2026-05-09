"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/feedback";
import { cn } from "@/lib/utils";
import type { Listing, ListingType } from "@/lib/data";

interface ListingsBrowserProps {
  listings: Listing[];
}

const typeOptions: Array<ListingType | "tutti"> = [
  "tutti",
  "stanza singola",
  "stanza doppia",
  "monolocale",
  "bilocale",
];

export function ListingsBrowser({ listings }: ListingsBrowserProps) {
  const [zone, setZone] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState<ListingType | "tutti">("tutti");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [virtualTourOnly, setVirtualTourOnly] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);

  const hasActiveFilters =
    Boolean(zone) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    type !== "tutti" ||
    verifiedOnly ||
    virtualTourOnly ||
    utilitiesIncluded;

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesZone =
        zone.length === 0 ||
        `${listing.zone} ${listing.neighborhood} ${listing.address}`
          .toLowerCase()
          .includes(zone.toLowerCase());
      const matchesMin = minPrice.length === 0 || listing.price >= Number(minPrice);
      const matchesMax = maxPrice.length === 0 || listing.price <= Number(maxPrice);
      const matchesType = type === "tutti" || listing.type === type;
      const matchesVerified = !verifiedOnly || listing.verified;
      const matchesTour = !virtualTourOnly || listing.virtualTour;
      const matchesUtilities = !utilitiesIncluded || listing.utilities.toLowerCase().includes("incl");

      return (
        matchesZone &&
        matchesMin &&
        matchesMax &&
        matchesType &&
        matchesVerified &&
        matchesTour &&
        matchesUtilities
      );
    });
  }, [
    listings,
    zone,
    minPrice,
    maxPrice,
    type,
    verifiedOnly,
    virtualTourOnly,
    utilitiesIncluded,
  ]);

  function resetFilters() {
    setZone("");
    setMinPrice("");
    setMaxPrice("");
    setType("tutti");
    setVerifiedOnly(false);
    setVirtualTourOnly(false);
    setUtilitiesIncluded(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
        <FilterControls
          zone={zone}
          minPrice={minPrice}
          maxPrice={maxPrice}
          type={type}
          verifiedOnly={verifiedOnly}
          virtualTourOnly={virtualTourOnly}
          utilitiesIncluded={utilitiesIncluded}
          onZoneChange={setZone}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onTypeChange={setType}
          onVerifiedOnlyChange={setVerifiedOnly}
          onVirtualTourOnlyChange={setVirtualTourOnly}
          onUtilitiesIncludedChange={setUtilitiesIncluded}
          onReset={resetFilters}
        />
      </aside>

      <div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:hidden">
          <FilterControls
            zone={zone}
            minPrice={minPrice}
            maxPrice={maxPrice}
            type={type}
            verifiedOnly={verifiedOnly}
            virtualTourOnly={virtualTourOnly}
            utilitiesIncluded={utilitiesIncluded}
            onZoneChange={setZone}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onTypeChange={setType}
            onVerifiedOnlyChange={setVerifiedOnly}
            onVirtualTourOnlyChange={setVirtualTourOnly}
            onUtilitiesIncludedChange={setUtilitiesIncluded}
            onReset={resetFilters}
            compact
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Annunci disponibili</h2>
            <p className="text-sm text-gray-500">
              {filteredListings.length} risultati trovati per il tuo budget a Forlì.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Resetta filtri
            </button>
          )}
        </div>

        {filteredListings.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon="search"
              title="Nessun annuncio corrisponde ai filtri"
              description="Prova ad allargare il budget, rimuovere qualche filtro o cercare un'altra zona di Forlì."
              actionLabel="Cancella i filtri"
              onAction={resetFilters}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((listing) => (
              <article
                key={listing.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-48 items-end bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-5 text-white">
                  <div className="w-full">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                      <span>{listing.zone}</span>
                      {listing.virtualTour && <span>Tour virtuale</span>}
                    </div>
                    <p className="mt-3 text-lg font-semibold">{listing.title}</p>
                    <p className="mt-2 text-sm text-blue-50 line-clamp-2">{listing.features.slice(0, 2).join(" · ")}</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">€{listing.price}</p>
                      <p className="text-sm text-gray-500">al mese</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {listing.type}
                      </span>
                      {listing.verified && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          Verificato
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700">{listing.address}</p>
                  <p className="mt-1 text-sm text-gray-500">{listing.neighborhood}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">Deposito</p>
                      <p>€{listing.deposit}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Disponibile da</p>
                      <p>{listing.availableFrom}</p>
                    </div>
                  </div>

                  <Link
                    href={`/listings/${listing.id}`}
                    className={cn(
                      "mt-6 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition",
                      listing.status === "Disponibile"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                  >
                    {listing.status === "Disponibile" ? "Vedi dettaglio" : "Apri annuncio"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterControlsProps {
  zone: string;
  minPrice: string;
  maxPrice: string;
  type: ListingType | "tutti";
  verifiedOnly: boolean;
  virtualTourOnly: boolean;
  utilitiesIncluded: boolean;
  compact?: boolean;
  onZoneChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onTypeChange: (value: ListingType | "tutti") => void;
  onVerifiedOnlyChange: (value: boolean) => void;
  onVirtualTourOnlyChange: (value: boolean) => void;
  onUtilitiesIncludedChange: (value: boolean) => void;
  onReset: () => void;
}

function FilterControls({
  zone,
  minPrice,
  maxPrice,
  type,
  verifiedOnly,
  virtualTourOnly,
  utilitiesIncluded,
  compact = false,
  onZoneChange,
  onMinPriceChange,
  onMaxPriceChange,
  onTypeChange,
  onVerifiedOnlyChange,
  onVirtualTourOnlyChange,
  onUtilitiesIncludedChange,
  onReset,
}: FilterControlsProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Filtri</h2>
          <p className="mt-1 text-sm text-gray-500">Restringi la ricerca in base alle tue esigenze.</p>
        </div>
        {!compact && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Pulisci
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Zona o via</span>
          <input
            value={zone}
            onChange={(event) => onZoneChange(event.target.value)}
            placeholder="Es. Centro, Viale Roma"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none ring-0 transition focus:border-blue-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Prezzo min</span>
            <input
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="300"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Prezzo max</span>
            <input
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="750"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Tipo di alloggio</span>
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value as ListingType | "tutti")}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "tutti" ? "Tutti i tipi" : option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => onVerifiedOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Solo annunci verificati
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={virtualTourOnly}
            onChange={(event) => onVirtualTourOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Con tour virtuale
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={utilitiesIncluded}
            onChange={(event) => onUtilitiesIncludedChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Utenze incluse
        </label>
      </div>
    </>
  );
}

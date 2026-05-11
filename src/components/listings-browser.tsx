"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/feedback";
import { NaturalLanguageSearch } from "@/components/nl-search";
import {
  applyListingFilters,
  hasActiveListingFilters,
  parseListingFiltersFromSearchParams,
  sortListings,
  type ListingSortOption,
} from "@/lib/listings-search";
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

const sortOptions: Array<{ value: ListingSortOption; label: string }> = [
  { value: "recommended", label: "Consigliati" },
  { value: "price-asc", label: "Prezzo crescente" },
  { value: "price-desc", label: "Prezzo decrescente" },
  { value: "availability-soon", label: "Disponibili prima" },
];

export function ListingsBrowser({ listings }: ListingsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const { sort, ...filters } = useMemo(
    () => parseListingFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const filteredListings = useMemo(
    () => sortListings(applyListingFilters(listings, filters), sort),
    [filters, listings, sort]
  );
  const hasActiveFilters = hasActiveListingFilters(filters);

  function replaceParams(next: URLSearchParams) {
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function updateTextParam(key: string, value: string) {
    const next = new URLSearchParams(currentParams.toString());
    if (value.trim()) next.set(key, value.trim());
    else next.delete(key);
    replaceParams(next);
  }

  function updateBooleanParam(key: string, value: boolean) {
    const next = new URLSearchParams(currentParams.toString());
    if (value) next.set(key, "1");
    else next.delete(key);
    replaceParams(next);
  }

  function updateSort(value: ListingSortOption) {
    const next = new URLSearchParams(currentParams.toString());
    if (value === "recommended") next.delete("sort");
    else next.set("sort", value);
    replaceParams(next);
  }

  function resetFilters() {
    router.replace(pathname);
  }

  function applyNaturalFilters(extracted: Record<string, string | number | boolean>) {
    const next = new URLSearchParams(currentParams.toString());
    const textMappings = [
      ["zone", "zone"],
      ["type", "type"],
    ] as const;

    for (const [source, target] of textMappings) {
      const value = extracted[source];
      if (typeof value === "string" && value) next.set(target, value);
    }

    if (typeof extracted.minPrice === "number") next.set("minPrice", String(extracted.minPrice));
    if (typeof extracted.maxPrice === "number") next.set("maxPrice", String(extracted.maxPrice));
    if (extracted.verified === true) next.set("verified", "1");
    if (extracted.virtualTour === true) next.set("virtualTour", "1");
    replaceParams(next);
  }

  const chips = [
    filters.zone ? { label: `Zona: ${filters.zone}`, onRemove: () => updateTextParam("zone", "") } : null,
    filters.minPrice !== undefined
      ? { label: `Da €${filters.minPrice}`, onRemove: () => updateTextParam("minPrice", "") }
      : null,
    filters.maxPrice !== undefined
      ? { label: `Fino a €${filters.maxPrice}`, onRemove: () => updateTextParam("maxPrice", "") }
      : null,
    filters.type && filters.type !== "tutti"
      ? { label: filters.type, onRemove: () => updateTextParam("type", "") }
      : null,
    filters.verifiedOnly
      ? { label: "Verificati", onRemove: () => updateBooleanParam("verified", false) }
      : null,
    filters.virtualTourOnly
      ? { label: "Tour virtuale", onRemove: () => updateBooleanParam("virtualTour", false) }
      : null,
    filters.utilitiesIncluded
      ? { label: "Utenze incluse", onRemove: () => updateBooleanParam("utilities", false) }
      : null,
  ].filter(Boolean) as Array<{ label: string; onRemove: () => void }>;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
        <FilterControls
          zone={filters.zone ?? ""}
          minPrice={filters.minPrice ? String(filters.minPrice) : ""}
          maxPrice={filters.maxPrice ? String(filters.maxPrice) : ""}
          type={filters.type ?? "tutti"}
          verifiedOnly={Boolean(filters.verifiedOnly)}
          virtualTourOnly={Boolean(filters.virtualTourOnly)}
          utilitiesIncluded={Boolean(filters.utilitiesIncluded)}
          sort={sort}
          onZoneChange={(value) => updateTextParam("zone", value)}
          onMinPriceChange={(value) => updateTextParam("minPrice", value)}
          onMaxPriceChange={(value) => updateTextParam("maxPrice", value)}
          onTypeChange={(value) => updateTextParam("type", value === "tutti" ? "" : value)}
          onVerifiedOnlyChange={(value) => updateBooleanParam("verified", value)}
          onVirtualTourOnlyChange={(value) => updateBooleanParam("virtualTour", value)}
          onUtilitiesIncludedChange={(value) => updateBooleanParam("utilities", value)}
          onSortChange={updateSort}
          onReset={resetFilters}
        />
      </aside>

      <div>
        <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Ricerca assistita</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Descrivi la casa ideale con parole tue</h2>
          <p className="mt-1 text-sm text-gray-500">
            Esempio: &ldquo;stanza singola vicino al campus sotto 450€ con tour virtuale&rdquo;.
          </p>
          <div className="mt-4">
            <NaturalLanguageSearch onFiltersExtracted={applyNaturalFilters} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:hidden">
          <FilterControls
            zone={filters.zone ?? ""}
            minPrice={filters.minPrice ? String(filters.minPrice) : ""}
            maxPrice={filters.maxPrice ? String(filters.maxPrice) : ""}
            type={filters.type ?? "tutti"}
            verifiedOnly={Boolean(filters.verifiedOnly)}
            virtualTourOnly={Boolean(filters.virtualTourOnly)}
            utilitiesIncluded={Boolean(filters.utilitiesIncluded)}
            sort={sort}
            onZoneChange={(value) => updateTextParam("zone", value)}
            onMinPriceChange={(value) => updateTextParam("minPrice", value)}
            onMaxPriceChange={(value) => updateTextParam("maxPrice", value)}
            onTypeChange={(value) => updateTextParam("type", value === "tutti" ? "" : value)}
            onVerifiedOnlyChange={(value) => updateBooleanParam("verified", value)}
            onVirtualTourOnlyChange={(value) => updateBooleanParam("virtualTour", value)}
            onUtilitiesIncludedChange={(value) => updateBooleanParam("utilities", value)}
            onSortChange={updateSort}
            onReset={resetFilters}
            compact
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Annunci disponibili</h2>
            <p className="text-sm text-gray-500">
              {filteredListings.length} risultati su {listings.length} annunci per studenti a Forlì.
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

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onRemove}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
              >
                {chip.label} ×
              </button>
            ))}
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="mt-6 space-y-4">
            <EmptyState
              icon="search"
              title="Nessun annuncio corrisponde ai filtri"
              description="Prova ad allargare il budget, rimuovere qualche filtro o usare la ricerca assistita per riformulare la richiesta."
              actionLabel="Cancella i filtri"
              onAction={resetFilters}
            />
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600 shadow-sm">
              <p className="font-semibold text-gray-900">Suggerimento rapido</p>
              <p className="mt-2">
                Se stai cercando un quartiere adatto al tuo stile di vita, prova il quiz dei quartieri per ottenere una shortlist pronta da applicare agli annunci.
              </p>
              <Link href="/neighborhoods/quiz" className="mt-4 inline-flex rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-800">
                Fai il quiz quartieri
              </Link>
            </div>
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
  sort: ListingSortOption;
  compact?: boolean;
  onZoneChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onTypeChange: (value: ListingType | "tutti") => void;
  onVerifiedOnlyChange: (value: boolean) => void;
  onVirtualTourOnlyChange: (value: boolean) => void;
  onUtilitiesIncludedChange: (value: boolean) => void;
  onSortChange: (value: ListingSortOption) => void;
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
  sort,
  compact = false,
  onZoneChange,
  onMinPriceChange,
  onMaxPriceChange,
  onTypeChange,
  onVerifiedOnlyChange,
  onVirtualTourOnlyChange,
  onUtilitiesIncludedChange,
  onSortChange,
  onReset,
}: FilterControlsProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Filtri</h2>
          <p className="mt-1 text-sm text-gray-500">Restringi la ricerca o riordina i risultati in tempo reale.</p>
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

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Ordina per</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ListingSortOption)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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

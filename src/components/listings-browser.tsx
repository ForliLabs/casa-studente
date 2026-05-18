"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/feedback";
import { FavoriteButton } from "@/components/favorite-button";
import { NaturalLanguageSearch } from "@/components/nl-search";
import {
  applyListingFilters,
  getRecommendedListings,
  hasActiveListingFilters,
  parseListingFiltersFromSearchParams,
  sortListings,
  type ListingSortOption,
} from "@/lib/listings-search";
import { cn, formatAvailableFrom } from "@/lib/utils";
import type { Listing, ListingType } from "@/lib/data";

interface ListingsBrowserProps {
  listings: Listing[];
  favoriteIds?: string[];
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
  { value: "best-match", label: "Best match AI" },
  { value: "price-asc", label: "Prezzo crescente" },
  { value: "price-desc", label: "Prezzo decrescente" },
  { value: "availability-soon", label: "Disponibili prima" },
];

const amenitySuggestions = ["wifi", "lavatrice", "balcone", "aria condizionata"];

export function ListingsBrowser({ listings, favoriteIds = [] }: ListingsBrowserProps) {
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"cozy" | "compact">("cozy");
  // Mobile filter panel is collapsed by default; auto-opens when filters are active.
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const { sort, ...filters } = useMemo(
    () => parseListingFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const filteredListings = useMemo(
    () => sortListings(applyListingFilters(listings, filters), sort, filters),
    [filters, listings, sort]
  );
  const recommendedListings = useMemo(
    () => getRecommendedListings(applyListingFilters(listings, filters), filters),
    [filters, listings]
  );
  const hasActiveFilters = hasActiveListingFilters(filters);

  function updateViewMode(nextMode: "cozy" | "compact") {
    setViewMode(nextMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("casastudente:listings-view-mode", nextMode);
    }
  }

  function replaceParams(next: URLSearchParams) {
    const query = next.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
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

  function toggleFeature(feature: string) {
    const next = new URLSearchParams(currentParams.toString());
    const selected = new Set(filters.features ?? []);
    if (selected.has(feature)) selected.delete(feature);
    else selected.add(feature);

    if (selected.size > 0) next.set("features", Array.from(selected).join(","));
    else next.delete("features");

    if (next.get("sort") !== "best-match") next.set("sort", "best-match");
    replaceParams(next);
  }

  function resetFilters() {
    router.replace(pathname);
  }

  function applyNaturalFilters(extracted: Record<string, string | number | boolean | string[]>) {
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
    if (extracted.utilitiesIncluded === true) next.set("utilities", "1");
    if (extracted.furnished === true) next.set("furnished", "1");
    if (extracted.securePayments === true) next.set("secure", "1");
    const features = extracted.features;
    if (Array.isArray(features) && features.length > 0) {
      next.set("features", features.map((value) => String(value)).join(","));
    }
    next.set("sort", "best-match");
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
    filters.furnishedOnly
      ? { label: "Arredato", onRemove: () => updateBooleanParam("furnished", false) }
      : null,
    filters.securePaymentsOnly
      ? { label: "Pagamenti sicuri", onRemove: () => updateBooleanParam("secure", false) }
      : null,
    ...(filters.features ?? []).map((feature) => ({
      label: feature,
      onRemove: () => updateTextParam("features", (filters.features ?? []).filter((item) => item !== feature).join(",")),
    })),
  ].filter(Boolean) as Array<{ label: string; onRemove: () => void }>;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:block">
        <FilterControls
          key={[
            "desktop",
            filters.zone ?? "",
            filters.minPrice ?? "",
            filters.maxPrice ?? "",
            filters.type ?? "tutti",
            filters.verifiedOnly ? 1 : 0,
            filters.virtualTourOnly ? 1 : 0,
            filters.utilitiesIncluded ? 1 : 0,
            filters.furnishedOnly ? 1 : 0,
            filters.securePaymentsOnly ? 1 : 0,
            sort,
          ].join(":")}
          zone={filters.zone ?? ""}
          minPrice={filters.minPrice ? String(filters.minPrice) : ""}
          maxPrice={filters.maxPrice ? String(filters.maxPrice) : ""}
          type={filters.type ?? "tutti"}
          verifiedOnly={Boolean(filters.verifiedOnly)}
          virtualTourOnly={Boolean(filters.virtualTourOnly)}
          utilitiesIncluded={Boolean(filters.utilitiesIncluded)}
          furnishedOnly={Boolean(filters.furnishedOnly)}
          securePaymentsOnly={Boolean(filters.securePaymentsOnly)}
          sort={sort}
          onZoneChange={(value) => updateTextParam("zone", value)}
          onMinPriceChange={(value) => updateTextParam("minPrice", value)}
          onMaxPriceChange={(value) => updateTextParam("maxPrice", value)}
          onTypeChange={(value) => updateTextParam("type", value === "tutti" ? "" : value)}
          onVerifiedOnlyChange={(value) => updateBooleanParam("verified", value)}
          onVirtualTourOnlyChange={(value) => updateBooleanParam("virtualTour", value)}
          onUtilitiesIncludedChange={(value) => updateBooleanParam("utilities", value)}
          onFurnishedOnlyChange={(value) => updateBooleanParam("furnished", value)}
          onSecurePaymentsOnlyChange={(value) => updateBooleanParam("secure", value)}
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
          <div className="mt-4 flex flex-wrap gap-2">
            {amenitySuggestions.map((feature) => {
              const active = filters.features?.includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  aria-pressed={!!active}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {feature}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => updateBooleanParam("furnished", !filters.furnishedOnly)}
              aria-pressed={!!filters.furnishedOnly}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                filters.furnishedOnly
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              Arredato
            </button>
            <button
              type="button"
              onClick={() => updateBooleanParam("secure", !filters.securePaymentsOnly)}
              aria-pressed={!!filters.securePaymentsOnly}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                filters.securePaymentsOnly
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              Pagamenti sicuri
            </button>
          </div>
        </div>

        {/* Mobile filter panel — collapsed by default, toggled by button */}
        <div className="mt-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filter-panel"
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500" aria-hidden="true">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.66 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
              </svg>
              Filtri
              {chips.length > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                  {chips.length}
                </span>
              )}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={cn("h-4 w-4 text-gray-400 transition-transform", mobileFiltersOpen && "rotate-180")}
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Always render so aria-controls points at a valid element; hide via the HTML `hidden` attribute */}
          <div id="mobile-filter-panel" hidden={!mobileFiltersOpen} className="mt-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <FilterControls
                key={[
                  "mobile",
                  filters.zone ?? "",
                  filters.minPrice ?? "",
                  filters.maxPrice ?? "",
                  filters.type ?? "tutti",
                  filters.verifiedOnly ? 1 : 0,
                  filters.virtualTourOnly ? 1 : 0,
                  filters.utilitiesIncluded ? 1 : 0,
                  filters.furnishedOnly ? 1 : 0,
                  filters.securePaymentsOnly ? 1 : 0,
                  sort,
                ].join(":")}
                zone={filters.zone ?? ""}
                minPrice={filters.minPrice ? String(filters.minPrice) : ""}
                maxPrice={filters.maxPrice ? String(filters.maxPrice) : ""}
                type={filters.type ?? "tutti"}
                verifiedOnly={Boolean(filters.verifiedOnly)}
                virtualTourOnly={Boolean(filters.virtualTourOnly)}
                utilitiesIncluded={Boolean(filters.utilitiesIncluded)}
                furnishedOnly={Boolean(filters.furnishedOnly)}
                securePaymentsOnly={Boolean(filters.securePaymentsOnly)}
                sort={sort}
                onZoneChange={(value) => updateTextParam("zone", value)}
                onMinPriceChange={(value) => updateTextParam("minPrice", value)}
                onMaxPriceChange={(value) => updateTextParam("maxPrice", value)}
                onTypeChange={(value) => updateTextParam("type", value === "tutti" ? "" : value)}
                onVerifiedOnlyChange={(value) => updateBooleanParam("verified", value)}
                onVirtualTourOnlyChange={(value) => updateBooleanParam("virtualTour", value)}
                onUtilitiesIncludedChange={(value) => updateBooleanParam("utilities", value)}
                onFurnishedOnlyChange={(value) => updateBooleanParam("furnished", value)}
                onSecurePaymentsOnlyChange={(value) => updateBooleanParam("secure", value)}
                onSortChange={updateSort}
                onReset={resetFilters}
                compact
              />
            </div>
        </div>

        {recommendedListings.length > 0 && hasActiveFilters && (
          <section className="mt-6 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Match AI</p>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">I risultati più vicini alla tua richiesta</h2>
              </div>
              <p className="text-sm text-gray-500">Classifica dinamica basata su budget, zona, servizi e fiducia.</p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {recommendedListings.map((item) => (
                <article key={item.listing.id} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.listing.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.listing.zone} · €{item.listing.price}/mese</p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      Score {item.score}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {item.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/listings/${item.listing.id}`} className="mt-4 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                    Apri scheda →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {isPending && (
          <div role="status" aria-live="polite" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-sm">
            Aggiornamento risultati in corso…
          </div>
        )}

        {sort === "best-match" && hasActiveFilters && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-sm">
            I risultati sono ordinati per affinità AI in base ai tuoi filtri attivi.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Annunci disponibili</h2>
            <p className="text-sm text-gray-500" role="status" aria-live="polite">
              {filteredListings.length} risultati su {listings.length} annunci per studenti a Forlì.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              {([
                { value: "cozy", label: "Ampia" },
                { value: "compact", label: "Compatta" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateViewMode(option.value)}
                  aria-pressed={viewMode === option.value}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    viewMode === option.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {option.label}
                </button>
              ))}
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
            {favoriteIds.length >= 2 && (
              <Link
                href={`/listings/compare?ids=${favoriteIds.slice(0, 4).join(",")}`}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Confronta ({Math.min(favoriteIds.length, 4)})
              </Link>
            )}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onRemove}
                aria-label={`Rimuovi filtro: ${chip.label}`}
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
          <div
            className={cn(
              "mt-6 grid gap-6",
              viewMode === "cozy" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 xl:grid-cols-2"
            )}
          >
            {filteredListings.map((listing) => {
              const isUnavailable = listing.status !== "Disponibile";
              return (
              <article
                key={listing.id}
                className={cn(
                  "overflow-hidden rounded-3xl border bg-white shadow-sm transition motion-reduce:transform-none",
                  isUnavailable ? "border-amber-200" : "border-gray-200",
                  viewMode === "cozy" ? "hover:-translate-y-1 hover:shadow-lg" : "hover:shadow-md"
                )}
              >
                {/* Card header — faded gradient for unavailable listings */}
                <div
                  className={cn(
                    "relative flex items-end p-5 text-white",
                    isUnavailable
                      ? "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"
                      : "bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600",
                    viewMode === "cozy" ? "h-48" : "h-36"
                  )}
                >
                  {/* Availability status badge — shown prominently on unavailable cards */}
                  {isUnavailable && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow">
                      In trattativa
                    </span>
                  )}
                  <div className="w-full">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                      <span>{listing.zone}</span>
                      {listing.virtualTour && <span>Tour virtuale</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{listing.title}</h3>
                    <p className="mt-2 text-sm text-blue-50 line-clamp-2">{listing.features.slice(0, 2).join(" · ")}</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cn("text-2xl font-bold", isUnavailable ? "text-gray-500" : "text-gray-900")}>€{listing.price}</p>
                      <p className="text-sm text-gray-500">al mese</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FavoriteButton
                        listingId={listing.id}
                        isFavorited={favoriteSet.has(listing.id)}
                      />
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
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700">{listing.address}</p>
                  <p className="mt-1 text-sm text-gray-500">{listing.neighborhood}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.features.slice(0, viewMode === "cozy" ? 3 : 2).map((feature) => (
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
                      <p>{formatAvailableFrom(listing.availableFrom)}</p>
                    </div>
                  </div>

                  {isUnavailable && (
                    <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      Questo annuncio è attualmente in trattativa — puoi comunque salvarlo nei preferiti.
                    </p>
                  )}

                  <Link
                    href={`/listings/${listing.id}`}
                    className={cn(
                      "mt-4 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition",
                      isUnavailable
                        ? "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {isUnavailable ? "Apri scheda" : "Vedi dettaglio"}
                  </Link>
                </div>
              </article>
              );
            })}
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
  furnishedOnly: boolean;
  securePaymentsOnly: boolean;
  sort: ListingSortOption;
  compact?: boolean;
  onZoneChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onTypeChange: (value: ListingType | "tutti") => void;
  onVerifiedOnlyChange: (value: boolean) => void;
  onVirtualTourOnlyChange: (value: boolean) => void;
  onUtilitiesIncludedChange: (value: boolean) => void;
  onFurnishedOnlyChange: (value: boolean) => void;
  onSecurePaymentsOnlyChange: (value: boolean) => void;
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
  furnishedOnly,
  securePaymentsOnly,
  sort,
  compact = false,
  onZoneChange,
  onMinPriceChange,
  onMaxPriceChange,
  onTypeChange,
  onVerifiedOnlyChange,
  onVirtualTourOnlyChange,
  onUtilitiesIncludedChange,
  onFurnishedOnlyChange,
  onSecurePaymentsOnlyChange,
  onSortChange,
  onReset,
}: FilterControlsProps) {
  const [draftZone, setDraftZone] = useState(zone);
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (draftZone !== zone) onZoneChange(draftZone);
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [draftZone, onZoneChange, zone]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (draftMinPrice !== minPrice) onMinPriceChange(draftMinPrice);
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [draftMinPrice, minPrice, onMinPriceChange]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (draftMaxPrice !== maxPrice) onMaxPriceChange(draftMaxPrice);
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [draftMaxPrice, maxPrice, onMaxPriceChange]);

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
            value={draftZone}
            onChange={(event) => setDraftZone(event.target.value)}
            placeholder="Es. Centro, Viale Roma"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none ring-0 transition focus:border-blue-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Prezzo min</span>
            <input
              value={draftMinPrice}
              onChange={(event) => setDraftMinPrice(event.target.value)}
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
              value={draftMaxPrice}
              onChange={(event) => setDraftMaxPrice(event.target.value)}
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
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={furnishedOnly}
            onChange={(event) => onFurnishedOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Già arredato
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={securePaymentsOnly}
            onChange={(event) => onSecurePaymentsOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Pagamenti sicuri
        </label>
      </div>
    </>
  );
}

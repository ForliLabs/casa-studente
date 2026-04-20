import type { Metadata } from "next";
import { ListingsBrowser } from "@/components/listings-browser";
import { getAllListings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Annunci",
  description: "Esplora alloggi per studenti a Forlì filtrando per zona, prezzo e tipologia.",
};

export default async function ListingsPage() {
  const listings = await getAllListings();

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Cerca casa a Forlì
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Annunci selezionati per studenti universitari
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Filtra per zona, fascia di prezzo e tipo di alloggio. Ogni scheda mostra dettagli chiari su costi, servizi inclusi e disponibilità.
          </p>
        </div>

        <div className="mt-10">
          <ListingsBrowser listings={listings} />
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteListingAction, updateListingStatusAction } from "@/lib/actions/listings";
import { getCurrentUser } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { conversationStore } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Gestione annunci",
  description: "Gestisci stato, prezzo e richieste degli annunci pubblicati su CasaStudente.",
};

export default async function DashboardListingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "landlord" && user.role !== "admin") redirect("/dashboard");

  const [{ created } = {}, listings, conversations] = await Promise.all([
    searchParams,
    listingStore.findAll().then((all) =>
      all.filter((listing) => user.role === "admin" || listing.landlord.email === user.email)
    ),
    conversationStore.findAll(),
  ]);

  return (
    <div className="space-y-8">
      {/* Success banner shown after a new listing is created */}
      {created === "1" && (
        <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm" role="alert">
          <span className="text-xl" aria-hidden="true">✅</span>
          <div>
            <p className="font-semibold">Annuncio pubblicato con successo!</p>
            <p className="mt-0.5 text-emerald-700">
              Il tuo alloggio è ora visibile nel catalogo pubblico. Aggiorna disponibilità e foto quando necessario.
            </p>
          </div>
          <Link
            href="/listings"
            className="ml-auto shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Vedi catalogo →
          </Link>
        </div>
      )}

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Gestione annunci
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              I tuoi alloggi pubblicati
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-gray-600">
              Controlla stato, richieste e disponibilità reale dei tuoi annunci senza dati demo separati dal catalogo pubblico.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/listings/new"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Nuovo annuncio
            </Link>
            <Link
              href="/listings"
              className="rounded-xl border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Vedi catalogo pubblico
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Proprietà
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Tipo
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Stato
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Prezzo
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Richieste
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Disponibilità
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {listings.map((listing) => {
                const inquiries = conversations.filter((conversation) => conversation.listingId === listing.id).length;

                return (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-gray-900">{listing.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{listing.address}</p>
                        <p className="mt-1 text-xs text-gray-400">ID annuncio: {listing.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{listing.type}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          listing.status === "Disponibile"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">€{listing.price}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{inquiries}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{listing.availableFrom}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Apri
                        </Link>
                        <form action={updateListingStatusAction}>
                          <input type="hidden" name="id" value={listing.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={listing.status === "Disponibile" ? "In trattativa" : "Disponibile"}
                          />
                          <button
                            type="submit"
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            {listing.status === "Disponibile" ? "Segna trattativa" : "Riapri"}
                          </button>
                        </form>
                        <form action={deleteListingAction}>
                          <input type="hidden" name="id" value={listing.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Elimina
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Nessun annuncio ancora pubblicato. Crea il tuo primo alloggio per iniziare a ricevere richieste.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

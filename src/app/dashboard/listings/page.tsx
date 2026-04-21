import type { Metadata } from "next";
import Link from "next/link";
import { landlordListings } from "@/lib/data";
import { deleteListingAction, updateListingStatusAction } from "@/lib/actions/listings";

export const metadata: Metadata = {
  title: "Gestione annunci",
  description: "Gestisci stato, prezzo e richieste degli annunci pubblicati su CasaStudente.",
};

export default function DashboardListingsPage() {
  return (
    <div className="space-y-8">
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
              Controlla lo stato delle proprietà, monitora le richieste ricevute e aggiorna rapidamente i dettagli principali.
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
              Vedi annuncio pubblico
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
                  Aggiornato
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {landlordListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-gray-900">{listing.title}</p>
                      <p className="mt-1 text-sm text-gray-500">ID annuncio: {listing.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">{listing.type}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        listing.status === "Pubblicato"
                          ? "bg-emerald-50 text-emerald-700"
                          : listing.status === "Bozza"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{listing.price}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{listing.inquiries}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{listing.updatedAt}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <form action={updateListingStatusAction}>
                        <input type="hidden" name="id" value={listing.id} />
                        <input type="hidden" name="status" value={listing.status === "Pubblicato" ? "In trattativa" : "Disponibile"} />
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cambia stato
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

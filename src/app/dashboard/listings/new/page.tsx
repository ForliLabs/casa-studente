"use client";

import { useActionState } from "react";
import { createListingAction } from "@/lib/actions/listings";

export default function NewListingPage() {
  const [state, formAction, isPending] = useActionState(createListingAction, null);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Nuovo annuncio
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Pubblica un alloggio
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600">
          Compila i campi per creare un nuovo annuncio visibile agli studenti.
        </p>
      </section>

      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Titolo annuncio *</span>
            <input
              name="title"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. Stanza singola luminosa vicino al Campus"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Indirizzo *</span>
            <input
              name="address"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Via Cristoforo Colombo 21, Forlì"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Quartiere</span>
            <input
              name="neighborhood"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. Zona Campus"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Zona</span>
            <select
              name="zone"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              <option value="Centro">Centro</option>
              <option value="Campus">Campus</option>
              <option value="Stazione">Stazione</option>
              <option value="San Benedetto">San Benedetto</option>
              <option value="Cava">Cava</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Tipo di alloggio *</span>
            <select
              name="type"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              <option value="stanza singola">Stanza singola</option>
              <option value="stanza doppia">Stanza doppia</option>
              <option value="monolocale">Monolocale</option>
              <option value="bilocale">Bilocale</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Prezzo mensile (€) *</span>
            <input
              name="price"
              type="number"
              required
              min={100}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="360"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Deposito (€)</span>
            <input
              name="deposit"
              type="number"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="720"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Utenze</span>
            <input
              name="utilities"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Utenze incluse fino a €60/mese"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Superficie (m²)</span>
            <input
              name="size"
              type="number"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="18"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Camere</span>
            <input
              name="rooms"
              type="number"
              min={1}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Bagni</span>
            <input
              name="bathrooms"
              type="number"
              min={1}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Piano</span>
            <input
              name="floor"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="2° piano"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Disponibile da</span>
            <input
              name="availableFrom"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="1 settembre 2026"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Descrizione</span>
            <textarea
              name="description"
              rows={4}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Descrivi l'alloggio in dettaglio..."
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Caratteristiche (separate da virgola)</span>
            <input
              name="features"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Wi-Fi fibra, Scrivania ampia, Lavatrice, Balcone"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Punti di interesse vicini (separati da virgola)</span>
            <input
              name="nearby"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="8 min a piedi dal Campus, Fermata bus sotto casa"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Pubblicazione in corso..." : "Pubblica annuncio"}
          </button>
        </div>
      </form>
    </div>
  );
}

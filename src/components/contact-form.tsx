"use client";

import { FormEvent, useState } from "react";

interface ContactFormProps {
  listingTitle: string;
  landlordName: string;
}

export function ContactForm({ listingTitle, landlordName }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Contatta il proprietario</h2>
      <p className="mt-2 text-sm text-gray-500">
        Invia un messaggio a {landlordName} per ricevere dettagli su {listingTitle.toLowerCase()}.
      </p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Messaggio inviato. Riceverai una risposta nella tua inbox appena il proprietario lo leggerà.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Nome e cognome</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. Giulia Bianchi"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              required
              type="email"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="nome@universita.it"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Messaggio</span>
            <textarea
              required
              rows={5}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              defaultValue={`Ciao ${landlordName}, sono interessato/a a ${listingTitle.toLowerCase()}. Vorrei sapere se è ancora disponibile e quando sarebbe possibile visitarlo.`}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Invia richiesta
          </button>
        </form>
      )}
    </div>
  );
}

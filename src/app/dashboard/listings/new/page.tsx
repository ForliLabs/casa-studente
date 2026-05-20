"use client";

import { useActionState, useMemo, useState } from "react";
import { AIListingAssistant } from "@/components/ai-assistant";
import { ImageUpload } from "@/components/image-upload";
import { createListingAction } from "@/lib/actions/listings";

const publishingChecklist = [
  "Titolo chiaro con tipo di stanza e zona",
  "Canone, deposito e utenze specificati",
  "Foto principali caricate in ordine logico",
  "Dettagli utili per studenti Erasmus e fuori sede",
];

export default function NewListingPage() {
  const [state, formAction, isPending] = useActionState(createListingAction, null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [aiInputs, setAiInputs] = useState({
    zone: "Campus",
    type: "stanza singola",
    size: "",
    price: "",
    features: "",
    description: "",
  });

  const photoSummary = useMemo(() => {
    if (photos.length === 0) return "Aggiungi almeno 3 foto per aumentare fiducia e conversione.";
    if (photos.length < 3) return "Buon inizio: aggiungi ancora qualche foto per mostrare stanza, bagno e cucina.";
    return "Ottimo: con 3+ foto l'annuncio sarà più completo e il tour virtuale verrà evidenziato automaticamente.";
  }, [photos.length]);

  function updateAIField(field: keyof typeof aiInputs, value: string) {
    setAiInputs((current) => ({ ...current, [field]: value }));
  }

  function applyAIDescription(text: string, lang: "it" | "en") {
    setAiInputs((current) => {
      if (lang === "it") {
        return { ...current, description: text };
      }

      const englishBlock = `English version:\n${text}`;
      const nextDescription = current.description.trim()
        ? `${current.description.trim()}\n\n${englishBlock}`
        : englishBlock;

      return { ...current, description: nextDescription };
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Nuovo annuncio</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Pubblica un alloggio</h1>
            <p className="mt-3 max-w-3xl text-sm text-gray-600">
              Compila i dettagli essenziali, carica le foto e scegli se pubblicare subito o salvare come bozza.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 lg:max-w-sm">
            <p className="text-sm font-semibold text-blue-900">Checklist prima della pubblicazione</p>
            <ul className="mt-3 space-y-2 text-sm text-blue-800">
              {publishingChecklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="space-y-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Dettagli dell&apos;alloggio</h2>
            <p className="mt-2 text-sm text-gray-600">Queste informazioni aiutano gli studenti a capire subito se l&apos;annuncio è in linea con budget, zona e tipologia cercata.</p>
          </div>

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
                value={aiInputs.zone}
                onChange={(event) => updateAIField("zone", event.target.value)}
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
                value={aiInputs.type}
                onChange={(event) => updateAIField("type", event.target.value)}
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
                value={aiInputs.price}
                onChange={(event) => updateAIField("price", event.target.value)}
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
                value={aiInputs.size}
                onChange={(event) => updateAIField("size", event.target.value)}
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
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">Lascia vuoto se la data non è ancora definita.</p>
            </label>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700">Bozza assistita</p>
              <p className="mt-2 text-sm text-gray-500">
                Genera una descrizione pronta in italiano e inglese usando i dati già inseriti e applicala al form con un click.
              </p>
              <div className="mt-4">
                <AIListingAssistant
                  type={aiInputs.type}
                  zone={aiInputs.zone}
                  size={aiInputs.size}
                  price={aiInputs.price}
                  features={aiInputs.features}
                  onApply={applyAIDescription}
                />
              </div>
            </div>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Descrizione</span>
              <textarea
                name="description"
                rows={6}
                value={aiInputs.description}
                onChange={(event) => updateAIField("description", event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                placeholder="Descrivi l'alloggio in dettaglio, cosa è incluso e perché è adatto a studenti fuori sede..."
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Caratteristiche (separate da virgola)</span>
              <input
                name="features"
                value={aiInputs.features}
                onChange={(event) => updateAIField("features", event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                placeholder="Wi‑Fi fibra, Scrivania ampia, Lavatrice, Balcone"
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
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Foto e fiducia</h2>
              <p className="mt-2 text-sm text-gray-600">Le foto vengono usate anche per evidenziare gli annunci più completi nei risultati e nelle richieste di visita.</p>
              <input type="hidden" name="photos" value={JSON.stringify(photos)} />
              <div className="mt-5">
                <ImageUpload maxImages={10} onImagesChange={setPhotos} />
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">Consiglio rapido</p>
              <p className="mt-2 text-sm text-amber-800">{photoSummary}</p>
              <div className="mt-4 rounded-2xl bg-white/80 p-4 text-sm text-amber-900 shadow-sm">
                <p className="font-medium">Ordine suggerito</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-amber-800">
                  <li>Foto principale della stanza o dell&apos;ambiente più forte</li>
                  <li>Cucina e bagno</li>
                  <li>Scrivania, armadi e spazi comuni</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <label className="block md:min-w-72">
              <span className="text-sm font-medium text-gray-700">Stato pubblicazione</span>
              <select
                name="status"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                defaultValue="Disponibile"
              >
                <option value="Disponibile">Pubblica subito</option>
                <option value="In trattativa">Salva come non ancora disponibile</option>
              </select>
            </label>
            <div className="max-w-xl text-sm text-gray-600">
              Se l&apos;alloggio non è ancora pronto per ricevere contatti, puoi salvarlo come non disponibile e aggiornarlo più tardi dalla dashboard annunci.
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Pubblicazione in corso..." : "Salva annuncio"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

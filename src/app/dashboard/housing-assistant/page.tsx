import type { Metadata } from "next";
import { BookOpenText, Languages, MapPinned, ShieldCheck } from "lucide-react";
import { HousingAssistantChat } from "@/components/housing-assistant-chat";
import { requireAuth } from "@/lib/auth";
import { isAIConfigured } from "@/lib/services/ai";

export const metadata: Metadata = {
  title: "Assistente casa AI",
  description:
    "Chatta con l'assistente CasaStudente per orientarti tra quartieri, contratti e processo di affitto studentesco a Forlì.",
};

const supportAreas = [
  {
    title: "Zone e quartieri",
    description: "Capisci differenze tra Campus, Centro, Stazione e aree più tranquille in base al tuo stile di vita.",
    icon: MapPinned,
  },
  {
    title: "Contratti e documenti",
    description: "Ottieni spiegazioni chiare su contratti transitori, deposito, cedolare secca e documenti da preparare.",
    icon: BookOpenText,
  },
  {
    title: "Supporto multilingue",
    description: "Puoi fare domande in italiano, inglese, spagnolo o francese e ricevere una risposta coerente.",
    icon: Languages,
  },
  {
    title: "Guardrail integrati",
    description: "L'assistente resta focalizzato su casa e vita universitaria e ti indirizza verso supporto umano per aspetti legali.",
    icon: ShieldCheck,
  },
] as const;

export default async function HousingAssistantPage() {
  const user = await requireAuth();
  const configured = isAIConfigured();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Assistente casa AI
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Un punto di accesso visibile per domande su alloggi, quartieri e contratti
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
          Usa questa chat per sbloccare dubbi frequenti prima di contattare un proprietario, prenotare
          un tour o firmare un contratto. È pensata per studenti internazionali, fuorisede e team che
          vogliono valutare l&apos;esperienza guidata da AI.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
            configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            {configured ? "OpenAI configurato" : "Fallback demo attivo"}
          </span>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Disponibile dalla dashboard principale
          </span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <HousingAssistantChat userName={user.name} configured={configured} />

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Cosa puoi chiedere</h2>
            <div className="mt-5 space-y-4">
              {supportAreas.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-950">Suggerimento rapido</h2>
            <p className="mt-3 text-sm leading-6 text-blue-900">
              Parti da domande concrete — budget, quartiere, tipo di contratto o documenti — e poi usa
              le risposte per decidere se aprire gli annunci, prenotare un tour o scrivere al proprietario.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

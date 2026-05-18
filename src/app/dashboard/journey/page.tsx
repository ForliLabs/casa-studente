import { getMyJourneys } from "@/lib/actions/journey";
import { advanceJourneyAction } from "@/lib/actions/journey";
import { requireAuth } from "@/lib/auth";
import { STAGE_LABELS, STAGE_ORDER, getNextStages, type JourneyStage } from "@/lib/stores/journey";
import { ArrowRight, CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { ConfirmActionButton } from "@/components/confirm-action-button";

/** Short description shown in the "current stage" context card. */
const STAGE_DESCRIPTIONS: Record<JourneyStage, string> = {
  discovered: "Hai salvato o visitato questo annuncio. Il prossimo passo è contattare il proprietario.",
  contacted: "Hai inviato un messaggio al proprietario. Attendi risposta o prenota una visita.",
  visiting: "La visita è programmata. Verifica spazi, luminosità e dettagli prima di candidarti.",
  applied: "Candidatura inviata. Il proprietario valuterà il tuo profilo e ti risponderà a breve.",
  lease_pending: "Il contratto è in fase di preparazione. Controlla e firma digitalmente quando disponibile.",
  lease_signed: "Contratto firmato da entrambe le parti. Prepara l'ingresso nell'alloggio.",
  active_tenancy: "Stai vivendo nell'alloggio. Al termine della locazione potrai completare il percorso.",
  completed: "Locazione conclusa. Lascia una recensione per aiutare altri studenti.",
  reviewed: "Percorso completato e recensito. Grazie per il contributo alla community!",
  cancelled: "Questo percorso è stato annullato.",
};

export default async function JourneyPage() {
  const user = await requireAuth();
  const journeys = await getMyJourneys();

  const isStudent = user.role === "student";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isStudent ? "Il mio percorso abitativo" : "Pipeline candidati"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isStudent
            ? "Traccia il tuo percorso dalla scoperta dell'annuncio al contratto"
            : "Visualizza lo stato di ogni candidatura ricevuta"}
        </p>
      </div>

      {journeys.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-8 text-center">
          <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">Nessun percorso attivo</p>
          {isStudent && (
            <Link href="/listings" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
              Esplora gli annunci →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {journeys.map((journey) => {
            const nextStages = getNextStages(journey.stage);
            const stageIndex = STAGE_ORDER.indexOf(journey.stage);
            const isCancelled = journey.stage === "cancelled";

            return (
              <div key={journey.id} className="rounded-xl border border-gray-200 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{journey.listingTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {isStudent ? `Proprietario: ${journey.landlordName}` : `Studente: ${journey.studentName}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isCancelled ? "bg-red-100 text-red-700" :
                    journey.stage === "reviewed" ? "bg-green-100 text-green-700" :
                    journey.stage === "active_tenancy" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {STAGE_LABELS[journey.stage].it}
                  </span>
                </div>

                {/* ── Labelled step progress tracker ─────────────────────── */}
                {!isCancelled && (
                  <div className="mb-5 overflow-x-auto">
                    <ol className="flex min-w-max items-start gap-0">
                      {STAGE_ORDER.map((stage, i) => {
                        const isCompleted = i < stageIndex;
                        const isCurrent = i === stageIndex;
                        const isLast = i === STAGE_ORDER.length - 1;
                        return (
                          <li key={stage} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                              {/* Connector line before the dot */}
                              {i > 0 && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    isCompleted || isCurrent ? "bg-blue-500" : "bg-gray-200"
                                  }`}
                                />
                              )}
                              {/* Step dot */}
                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ${
                                  isCurrent
                                    ? "bg-blue-600 text-white ring-blue-200"
                                    : isCompleted
                                      ? "bg-blue-500 text-white ring-blue-100"
                                      : "bg-gray-100 text-gray-400 ring-gray-200"
                                }`}
                                aria-label={`${STAGE_LABELS[stage].it}${isCurrent ? " (corrente)" : isCompleted ? " (completato)" : ""}`}
                              >
                                {isCompleted ? "✓" : i + 1}
                              </div>
                              {/* Connector line after the dot */}
                              {!isLast && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    isCompleted ? "bg-blue-500" : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                            {/* Stage label */}
                            <p
                              className={`mt-1.5 text-center text-[10px] leading-tight ${
                                isCurrent
                                  ? "font-semibold text-blue-700"
                                  : isCompleted
                                    ? "text-blue-500"
                                    : "text-gray-400"
                              }`}
                              style={{ maxWidth: "5rem" }}
                            >
                              {STAGE_LABELS[stage].it}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                {/* Stage history */}
                <div className="mb-4 space-y-2">
                  {journey.stageHistory.slice(-3).map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {i === journey.stageHistory.slice(-3).length - 1 ? (
                        <Clock className="h-4 w-4 text-blue-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-gray-700">{STAGE_LABELS[entry.stage].it}</span>
                      <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleDateString("it-IT")}</span>
                      {entry.note && <span className="text-xs text-gray-500">— {entry.note}</span>}
                    </div>
                  ))}
                </div>

                {/* Current-stage context card */}
                <div
                  className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                    isCancelled
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-blue-100 bg-blue-50 text-blue-800"
                  }`}
                >
                  <p className="font-semibold">
                    {isCancelled ? "Percorso annullato" : `Fase attuale: ${STAGE_LABELS[journey.stage].it}`}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">
                    {STAGE_DESCRIPTIONS[journey.stage]}
                  </p>
                </div>

                  {/* Next actions */}
                  {nextStages.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      {nextStages.map((nextStage) =>
                        nextStage === "cancelled" ? (
                          <ConfirmActionButton
                            key={nextStage}
                            fields={{ journeyId: journey.id, nextStage }}
                            action={advanceJourneyAction}
                            triggerLabel={
                              <>
                                <XCircle className="h-4 w-4" />
                                Annulla
                              </>
                            }
                            triggerClassName="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                            dialogTitle="Annullare il percorso?"
                            dialogBody={`Stai per annullare il percorso abitativo per "${journey.listingTitle}". Questa azione non può essere annullata.`}
                            confirmLabel="Sì, annulla il percorso"
                            confirmClassName="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                          />
                        ) : (
                          <form key={nextStage} action={advanceJourneyAction}>
                            <input type="hidden" name="journeyId" value={journey.id} />
                            <input type="hidden" name="nextStage" value={nextStage} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <ArrowRight className="h-4 w-4" /> {STAGE_LABELS[nextStage].it}
                            </button>
                          </form>
                        )
                      )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

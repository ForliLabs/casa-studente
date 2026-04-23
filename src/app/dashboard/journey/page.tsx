import { getMyJourneys } from "@/lib/actions/journey";
import { advanceJourneyAction } from "@/lib/actions/journey";
import { requireAuth } from "@/lib/auth";
import { STAGE_LABELS, STAGE_ORDER, getNextStages } from "@/lib/stores/journey";
import { ArrowRight, CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";
import Link from "next/link";

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

                {/* Progress bar */}
                {!isCancelled && (
                  <div className="mb-4 flex items-center gap-1">
                    {STAGE_ORDER.map((stage, i) => {
                      const isCompleted = i <= stageIndex;
                      const isCurrent = i === stageIndex;
                      return (
                        <div key={stage} className="flex flex-1 items-center">
                          <div className={`h-2 w-full rounded-full ${
                            isCompleted ? "bg-blue-500" : "bg-gray-200"
                          } ${isCurrent ? "ring-2 ring-blue-300" : ""}`} />
                        </div>
                      );
                    })}
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

                {/* Next actions */}
                {nextStages.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {nextStages.map((nextStage) => (
                      <form key={nextStage} action={advanceJourneyAction}>
                        <input type="hidden" name="journeyId" value={journey.id} />
                        <input type="hidden" name="nextStage" value={nextStage} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                            nextStage === "cancelled"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {nextStage === "cancelled" ? (
                            <><XCircle className="h-4 w-4" /> Annulla</>
                          ) : (
                            <><ArrowRight className="h-4 w-4" /> {STAGE_LABELS[nextStage].it}</>
                          )}
                        </button>
                      </form>
                    ))}
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

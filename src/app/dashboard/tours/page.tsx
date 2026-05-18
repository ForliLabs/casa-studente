import type { Metadata } from "next";
import Link from "next/link";
import { getMyTours, cancelTourAction } from "@/lib/actions/tours";
import { ConfirmActionButton } from "@/components/confirm-action-button";
import { Video, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Tour & Visite",
  description: "Gestisci tour virtuali e visite agli alloggi.",
};

const statusConfig = {
  requested: { label: "Richiesto", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  confirmed: { label: "Confermato", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  completed: { label: "Completato", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Annullato", color: "bg-gray-100 text-gray-600", icon: XCircle },
  no_show: { label: "Non presentato", color: "bg-red-100 text-red-800", icon: XCircle },
};

const typeLabels: Record<string, string> = {
  in_person: "Di persona",
  virtual: "Video tour",
  async_360: "Tour 360\u00b0",
};

export default async function ToursPage() {
  const tours = await getMyTours();
  const upcoming = tours.filter((t) => t.status === "confirmed" || t.status === "requested");
  const past = tours.filter((t) => t.status === "completed" || t.status === "cancelled" || t.status === "no_show");

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-teal-600" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Tour & Visite</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Gestisci i tuoi tour</h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Prenota tour virtuali o di persona, consulta i tour 360° e completa il percorso di affitto senza muoverti da casa.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-teal-600">{upcoming.length}</p>
          <p className="mt-1 text-sm text-gray-500">Tour in programma</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">{past.filter((t) => t.status === "completed").length}</p>
          <p className="mt-1 text-sm text-gray-500">Tour completati</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">{tours.filter((t) => t.type === "virtual").length}</p>
          <p className="mt-1 text-sm text-gray-500">Tour virtuali</p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Tour in programma</h2>
        {upcoming.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <Calendar className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-base font-semibold text-gray-700">Nessun tour pianificato</p>
            <p className="mt-1 text-sm text-gray-500">
              Sfoglia gli annunci e prenota un tour in presenza o virtuale direttamente dalla pagina dell&apos;alloggio.
            </p>
            <Link
              href="/listings"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Video className="h-4 w-4" aria-hidden="true" />
              Cerca alloggi e prenota un tour
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {upcoming.map((tour) => {
              const status = statusConfig[tour.status];
              const StatusIcon = status.icon;
              return (
                <div key={tour.id} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-gray-900">{tour.listingTitle}</h3>
                        <Link
                          href={`/listings/${tour.listingId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          Vedi annuncio
                        </Link>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          {tour.confirmedDate || tour.requestedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          {tour.confirmedTime || tour.requestedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" aria-hidden="true" />
                          {typeLabels[tour.type]}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />{status.label}
                      </span>
                      {/* Self-serve cancellation — guarded by a confirm dialog */}
                      <ConfirmActionButton
                        fields={{ bookingId: tour.id }}
                        action={cancelTourAction}
                        triggerLabel={
                          <>
                            <XCircle className="mr-1 h-3 w-3" aria-hidden="true" />
                            Annulla
                          </>
                        }
                        triggerClassName="inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        dialogTitle="Annulla il tour?"
                        dialogBody={`Stai per annullare il tour per "${tour.listingTitle}". Questa azione non può essere annullata.`}
                        confirmLabel="Sì, annulla il tour"
                        confirmClassName="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Tour passati</h2>
          <div className="mt-4 space-y-4">
            {past.map((tour) => {
              const status = statusConfig[tour.status];
              const StatusIcon = status.icon;
              return (
                <div key={tour.id} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-gray-900">{tour.listingTitle}</h3>
                        <Link
                          href={`/listings/${tour.listingId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          Vedi annuncio
                        </Link>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{tour.confirmedDate || tour.requestedDate} · {typeLabels[tour.type]}</p>
                      {tour.rating && (
                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({ length: tour.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                      <StatusIcon className="h-3 w-3" aria-hidden="true" />{status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
        <h3 className="font-semibold text-teal-900">🌍 Affitta da remoto</h3>
        <p className="mt-2 text-sm text-teal-800">
          Sei uno studente internazionale? Puoi completare l&apos;intero percorso di affitto senza visitare
          Forlì: tour virtuale → candidatura → firma digitale → pagamento deposito online.
        </p>
      </section>
    </div>
  );
}

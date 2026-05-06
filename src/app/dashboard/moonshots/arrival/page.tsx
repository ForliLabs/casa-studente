import type { Metadata } from "next";
import { Bot, CheckCircle2, Plane, Workflow } from "lucide-react";
import { getArrivalOSDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Arrival OS",
  description:
    "Orchestrazione visa-to-lease per studenti internazionali con service mesh tra università, casa e città.",
};

const statusStyles = {
  done: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-amber-50 text-amber-700",
  blocked: "bg-rose-50 text-rose-700",
  upcoming: "bg-slate-100 text-slate-600",
} as const;

export default async function ArrivalOSPage() {
  const dashboard = await getArrivalOSDashboard();
  if (!dashboard) {
    return null;
  }

  const { track, blockers, autonomousSteps } = dashboard;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Relocation OS
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Arrival OS
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Un layer operativo che sincronizza documenti, trasporto, check-in, attivazioni civiche e
          onboarding universitario prima che lo studente atterri. L&apos;obiettivo non è cercare casa:
          è garantire un atterraggio senza attrito.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Corridor</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{track.corridor}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Readiness</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{track.readinessScore}%</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Blocked items</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{blockers}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Autonomous steps</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{autonomousSteps}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Arrival workflow graph</h2>
          </div>
          <div className="mt-5 space-y-4">
            {track.checkpoints.map((checkpoint) => (
              <div key={checkpoint.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{checkpoint.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      owner: {checkpoint.owner} · T-{checkpoint.daysToGo} giorni
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[checkpoint.status]}`}>
                    {checkpoint.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gray-400">
                  {checkpoint.automationLevel} automation
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Concierge ops</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {track.conciergeOps.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Service mesh</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {track.serviceMesh.map((service) => (
                <span key={service} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-700" />
          <div>
            <h2 className="text-lg font-semibold text-indigo-950">What is implemented now</h2>
            <p className="mt-2 text-sm text-indigo-900">
              Corridor dashboard, readiness scoring, automation labels, and public API scaffolding
              are live prototypes that build on existing auth, documents, notifications, and payment rails.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

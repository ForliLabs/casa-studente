import type { Metadata } from "next";
import { Activity, MapPinned, Radar, ShieldAlert } from "lucide-react";
import { getDigitalTwinDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Campus Digital Twin",
  description:
    "Control tower urbano per segnali di domanda, mobilità e rischio climatico legati all'abitare studentesco.",
};

const priorityStyles = {
  observe: "bg-slate-100 text-slate-600",
  accelerate: "bg-emerald-50 text-emerald-700",
  stabilize: "bg-amber-50 text-amber-700",
} as const;

export default async function DigitalTwinPage() {
  const dashboard = await getDigitalTwinDashboard();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          Urban intelligence
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Campus Digital Twin
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          La domanda abitativa non viene più letta solo come funnel di annunci: diventa segnale per
          mobilità, rischio climatico, conversione di stock inutilizzato e resilienza del sistema città-campus.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Top opportunity zone</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{dashboard.hottestZone.zone}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Opportunity score</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.hottestZone.opportunityScore}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Climate safety avg</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.averageClimateSafety}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interventions loaded</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.interventions.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Zone signal board</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {dashboard.signals.map((signal) => (
              <div key={signal.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{signal.zone}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[signal.interventionPriority]}`}>
                    {signal.interventionPriority}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Affordability pressure</p>
                    <p className="mt-1 font-semibold text-gray-900">{signal.affordabilityPressure}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Mobility readiness</p>
                    <p className="mt-1 font-semibold text-gray-900">{signal.mobilityReadiness}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Climate safety</p>
                    <p className="mt-1 font-semibold text-gray-900">{signal.climateSafety}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Occupancy risk</p>
                    <p className="mt-1 font-semibold text-gray-900">{signal.occupancyRisk}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-violet-700">
                  Opportunity score {signal.opportunityScore} · magnetism {signal.studentMagnetism}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-900">Interventions queue</h2>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.interventions.map((intervention) => (
                <div key={intervention.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{intervention.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{intervention.focusZone} · {intervention.owner}</p>
                  <p className="mt-2 text-sm text-violet-700">{intervention.impact}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gray-400">{intervention.latency}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-900">Why this matters</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Gives universities and city actors a shared housing control tower.</li>
              <li>• Converts zoning, climate, and mobility decisions into occupancy outcomes.</li>
              <li>• Creates a defensible B2B layer competitors cannot access from listing data alone.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <div className="flex items-start gap-3">
          <Activity className="mt-0.5 h-5 w-5 text-violet-700" />
          <p className="text-sm text-violet-900">
            The repo now includes a twin board, intervention registry, and public API surface that can
            later ingest live telemetry, municipal feeds, and campus operations data.
          </p>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { Sparkles, Users, WandSparkles, Workflow } from "lucide-react";
import { getIntentionalPodsDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Intentional Coliving Pods",
  description:
    "Pod abitativi mission-driven che uniscono matching, trust e outcome studenteschi invece di semplici posti letto.",
};

export default async function PodsPage() {
  const dashboard = await getIntentionalPodsDashboard();
  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
          Outcome-based living
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Intentional Coliving Pods
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Gli appartamenti diventano micro-prodotti: community progettate attorno a lingua, carriera,
          wellbeing o creatività. Il valore non è solo il letto, ma il sistema di fiducia e outcome che il pod genera.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Recommended pods</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.recommended.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Viewer trust tier</p>
          <p className="mt-2 text-2xl font-bold capitalize text-gray-900">{dashboard.trustTier}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Existing group</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{dashboard.groupName ?? "None"}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pods forming</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.pods.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-fuchsia-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pod registry</h2>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.pods.map((pod) => (
              <div key={pod.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{pod.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{pod.neighborhood}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    readiness {pod.readiness}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{pod.mission}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Fit</p>
                    <p className="mt-1 font-semibold text-gray-900">{pod.fitScore}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Trust</p>
                    <p className="mt-1 font-semibold text-gray-900">{pod.averageTrustScore}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className="mt-1 font-semibold text-gray-900">{pod.occupancyConfidence}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="mt-1 font-semibold text-gray-900">€{pod.monthlyBudget}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pod.rituals.map((ritual) => (
                    <span key={ritual} className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-medium text-fuchsia-700">
                      {ritual}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-fuchsia-600" />
              <h2 className="text-lg font-semibold text-gray-900">What changes</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Matching evolves from compatibility to mission fit.</li>
              <li>• Groups become branded micro-communities with measurable outcomes.</li>
              <li>• Landlords can host pods with higher retention and stronger reputation loops.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-fuchsia-600" />
              <h2 className="text-lg font-semibold text-gray-900">Implementation slice</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Registry of mission-based pods.</li>
              <li>• Readiness score using fit, trust, diversity, and occupancy confidence.</li>
              <li>• Public API for pod discovery and experimentation.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-fuchsia-700" />
          <p className="text-sm text-fuchsia-900">
            This prototype turns housing groups into productized communities and gives CasaStudente a
            path toward premium, defensible living experiences instead of commodity listings.
          </p>
        </div>
      </section>
    </div>
  );
}

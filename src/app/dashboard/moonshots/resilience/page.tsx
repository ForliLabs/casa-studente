import type { Metadata } from "next";
import { BatteryCharging, Shield, ThermometerSun, Waves } from "lucide-react";
import { getResilienceGridDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Climate Resilience Grid",
  description:
    "Sistema di continuità abitativa per rischio caldo, allagamenti, qualità dell'aria ed energia flessibile.",
};

const bandStyles = {
  fragile: "bg-rose-50 text-rose-700",
  responsive: "bg-amber-50 text-amber-700",
  adaptive: "bg-cyan-50 text-cyan-700",
  antifragile: "bg-emerald-50 text-emerald-700",
} as const;

export default async function ResiliencePage() {
  const dashboard = await getResilienceGridDashboard();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Climate infrastructure
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Climate Resilience Grid
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          CasaStudente coordina backup beds, demand response energetico e protocolli di continuità
          per rendere l&apos;abitare studentesco resistente a caldo estremo, shock di rete e disruption stagionali.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average resilience</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.averageScore}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Backup beds</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.backupBeds}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Flex revenue</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">€{dashboard.flexRevenue}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Grid windows</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.energyWindows.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Resilience plans by asset</h2>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{plan.listingTitle}</h3>
                    <p className="mt-1 text-sm text-gray-600">listing {plan.listingId}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${bandStyles[plan.band]}`}>
                    {plan.band}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="mt-1 font-semibold text-gray-900">{plan.resilienceScore}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Heat risk</p>
                    <p className="mt-1 font-semibold text-gray-900">{plan.heatRisk}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Air quality</p>
                    <p className="mt-1 font-semibold text-gray-900">{plan.airQualityRisk}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Backup beds</p>
                    <p className="mt-1 font-semibold text-gray-900">{plan.backupBeds}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {plan.actions.map((action) => (
                    <p key={action}>• {action}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BatteryCharging className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Energy flex windows</h2>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.energyWindows.map((window) => (
                <div key={window.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{window.zone} · {window.window}</p>
                  <p className="mt-1 text-sm text-gray-600">€{window.demandResponseValue} value</p>
                  <p className="mt-2 text-sm text-orange-700">{window.occupancyImpact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Why it redefines the market</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Turns housing continuity into a monetizable, insured service layer.</li>
              <li>• Connects climate response to occupancy, pricing, and trust.</li>
              <li>• Makes student housing relevant to utilities, insurers, and municipalities.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-3">
          <Waves className="mt-0.5 h-5 w-5 text-orange-700" />
          <p className="text-sm text-orange-900">
            The repository now contains prototype resilience plans, energy-flex scheduling, and an API layer
            that can later integrate live weather, grid, insurance, and occupancy feeds.
          </p>
        </div>
      </section>
    </div>
  );
}

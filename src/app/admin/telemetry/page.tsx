import type { Metadata } from "next";
import { getTelemetryDashboard } from "@/lib/actions/telemetry";
import { Activity, TrendingUp, TrendingDown, Minus, BarChart3, Zap, Flag, Monitor, FlaskConical, Gauge } from "lucide-react";

export const metadata: Metadata = {
  title: "Telemetria — Adoption Analytics",
  description: "Telemetria piattaforma e analytics di adozione funzionalità per CasaStudente.",
};

export default async function TelemetryPage() {
  const dashboard = await getTelemetryDashboard();

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Solo gli amministratori possono accedere alla telemetria.</p>
      </div>
    );
  }

  const { adoption, funnels, abTests, performance, flags, stats } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          Telemetria
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Platform Telemetry & Adoption
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Osservabilità interna: adozione funzionalità, funnel di conversione, A/B testing,
          Core Web Vitals, feature flags. La meta-funzionalità che dice quali delle altre 54
          funzionalità contano davvero.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2"><Activity className="h-5 w-5 text-violet-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Eventi tracciati</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Adozione media</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgAdoptionRate}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Zap className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Top feature</p>
              <p className="text-lg font-bold text-gray-900">{stats.topFeature}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2"><FlaskConical className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-gray-500">A/B test attivi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAbTests}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Adoption Matrix */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BarChart3 className="h-5 w-5" /> Adozione funzionalità
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">#</th>
                <th className="pb-3 font-medium text-gray-500">Funzionalità</th>
                <th className="pb-3 font-medium text-gray-500">Utenti attivi</th>
                <th className="pb-3 font-medium text-gray-500">Tasso adozione</th>
                <th className="pb-3 font-medium text-gray-500">Sessioni/utente</th>
                <th className="pb-3 font-medium text-gray-500">Drop-off</th>
                <th className="pb-3 font-medium text-gray-500">Trend</th>
              </tr>
            </thead>
            <tbody>
              {adoption.sort((a, b) => b.adoptionRate - a.adoptionRate).map((fa) => (
                <tr key={fa.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-400">#{fa.featureId}</td>
                  <td className="py-3 font-medium text-gray-900">{fa.featureName}</td>
                  <td className="py-3 text-gray-600">{fa.activeUsers.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-violet-500"
                          style={{ width: `${Math.min(100, fa.adoptionRate)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{fa.adoptionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{fa.avgSessionsPerUser}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${fa.dropOffRate > 40 ? "text-red-600" : fa.dropOffRate > 20 ? "text-amber-600" : "text-green-600"}`}>
                      {fa.dropOffRate}%
                    </span>
                  </td>
                  <td className="py-3">
                    {fa.trend === "growing" ? <TrendingUp className="h-4 w-4 text-green-500" /> :
                     fa.trend === "declining" ? <TrendingDown className="h-4 w-4 text-red-500" /> :
                     <Minus className="h-4 w-4 text-gray-400" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conversion Funnel */}
      {funnels.map((funnel) => (
        <section key={funnel.id} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{funnel.name}</h2>
          <p className="mb-6 text-xs text-gray-500">Periodo: {funnel.period} — Conversione totale: {funnel.overallConversion}%</p>
          <div className="space-y-2">
            {funnel.stages.map((stage, i) => (
              <div key={stage.name} className="flex items-center gap-4">
                <span className="w-40 text-sm text-gray-700">{stage.name}</span>
                <div className="flex-1">
                  <div className="h-6 w-full rounded bg-gray-100">
                    <div
                      className="flex h-6 items-center rounded bg-violet-500 px-2 text-xs font-medium text-white"
                      style={{ width: `${stage.rate}%` }}
                    >
                      {stage.count.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="w-16 text-right text-xs text-gray-500">{stage.rate}%</span>
                {i > 0 && stage.dropOff > 0 && (
                  <span className="w-16 text-right text-xs text-red-500">-{stage.dropOff}%</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* A/B Tests */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FlaskConical className="h-5 w-5" /> A/B Test
        </h2>
        <div className="space-y-4">
          {abTests.map((test) => (
            <div key={test.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{test.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{test.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  test.status === "running" ? "bg-green-100 text-green-700" :
                  test.status === "completed" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {test.status === "running" ? "In corso" : test.status === "completed" ? "Completato" : test.status}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {test.variants.map((v) => (
                  <div key={v.name} className={`rounded-lg p-4 ${test.winner === v.name ? "border-2 border-green-300 bg-green-50" : "bg-white"}`}>
                    <p className="text-sm font-medium text-gray-900">{v.name}</p>
                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                      <span>Impressioni: {v.impressions.toLocaleString()}</span>
                      <span>Conversioni: {v.conversions}</span>
                      <span className="font-bold text-gray-900">{v.conversionRate}%</span>
                    </div>
                    {test.winner === v.name && (
                      <p className="mt-1 text-xs font-semibold text-green-600">🏆 Vincitore ({test.confidence}% confidenza)</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Page Performance */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Gauge className="h-5 w-5" /> Core Web Vitals
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">Pagina</th>
                <th className="pb-3 font-medium text-gray-500">LCP</th>
                <th className="pb-3 font-medium text-gray-500">FID</th>
                <th className="pb-3 font-medium text-gray-500">CLS</th>
                <th className="pb-3 font-medium text-gray-500">TTFB</th>
                <th className="pb-3 font-medium text-gray-500">Errori</th>
                <th className="pb-3 font-medium text-gray-500">Campione</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((pp) => (
                <tr key={pp.id} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{pp.pageName}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${pp.lcp <= 2500 ? "text-green-600" : pp.lcp <= 4000 ? "text-amber-600" : "text-red-600"}`}>
                      {pp.lcp}ms
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${pp.fid <= 100 ? "text-green-600" : pp.fid <= 300 ? "text-amber-600" : "text-red-600"}`}>
                      {pp.fid}ms
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-medium ${pp.cls <= 0.1 ? "text-green-600" : pp.cls <= 0.25 ? "text-amber-600" : "text-red-600"}`}>
                      {pp.cls}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-gray-600">{pp.ttfb}ms</td>
                  <td className="py-3 text-xs text-gray-600">{pp.errorRate}%</td>
                  <td className="py-3 text-xs text-gray-400">{pp.sampleSize.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Flags */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Flag className="h-5 w-5" /> Feature Flags
        </h2>
        <div className="space-y-2">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{flag.name}</p>
                <p className="text-xs text-gray-500">{flag.description} — Rollout: {flag.rolloutPercentage}% — Ruoli: {flag.targetRoles.join(", ")}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${flag.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {flag.enabled ? "Attivo" : "Disattivato"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

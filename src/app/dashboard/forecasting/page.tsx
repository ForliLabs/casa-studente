import type { Metadata } from "next";
import { getForecastDashboard } from "@/lib/actions/forecasting";
import { DEMAND_LEVEL_CONFIG } from "@/lib/stores/forecasting";
import { TrendingUp, Calendar, MapPin, DollarSign, Sun, Snowflake, Leaf, Cloud } from "lucide-react";

export const metadata: Metadata = {
  title: "Previsioni Domanda — Yield Management",
  description: "Previsioni stagionali della domanda e gestione rendimento per alloggi studenteschi a Forlì.",
};

export default async function ForecastingPage() {
  const dashboard = await getForecastDashboard();

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Accedi per visualizzare le previsioni.</p>
      </div>
    );
  }

  const { patterns, heatmaps, forecasts, yields, currentDemand } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Previsioni Domanda
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Seasonal Demand Forecasting
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Previsioni basate su calendario accademico, dati storici della piattaforma e segnali esterni.
          Heatmap domanda per zona e mese, raccomandazioni di timing per proprietari e studenti,
          suggerimenti di prezzo dinamico integrati con il pricing engine.
        </p>
      </section>

      {/* Current Demand */}
      {currentDemand && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-200 p-3">
              <Calendar className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                {currentDemand.monthName} — Indice domanda: {currentDemand.avgDemandIndex}/100
              </h2>
              <p className="text-sm text-amber-700">{currentDemand.description}</p>
              {currentDemand.peakEvent && (
                <p className="mt-1 text-xs font-medium text-amber-600">📅 {currentDemand.peakEvent}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Seasonal Pattern */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Pattern stagionale annuale</h2>
        <div className="flex items-end gap-1" role="img" aria-label="Grafico domanda stagionale">
          {patterns.map((p) => {
            const level = DEMAND_LEVEL_CONFIG[
              p.avgDemandIndex >= 85 ? "peak" :
              p.avgDemandIndex >= 65 ? "high" :
              p.avgDemandIndex >= 40 ? "moderate" :
              p.avgDemandIndex >= 20 ? "low" : "very_low"
            ];
            return (
              <div key={p.id} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-700">{p.avgDemandIndex}</span>
                <div
                  className={`w-full rounded-t transition-all ${level.bgColor}`}
                  style={{ height: `${Math.max(16, p.avgDemandIndex * 1.8)}px` }}
                  title={`${p.monthName}: ${p.avgDemandIndex}/100 — ${p.description}`}
                />
                <span className="text-[10px] text-gray-500">{p.monthName.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(DEMAND_LEVEL_CONFIG).map(([key, config]) => (
            <span key={key} className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${config.bgColor} ${config.color}`}>
              <span className={`h-2 w-2 rounded-full ${config.bgColor.replace("100", "400")}`} />
              {config.label}
            </span>
          ))}
        </div>
      </section>

      {/* Zone Heatmap */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MapPin className="h-5 w-5" /> Heatmap domanda per zona
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left font-medium text-gray-500">Zona</th>
                {heatmaps[0]?.monthlyDemand.map((m) => (
                  <th key={m.month} className="pb-3 text-center font-medium text-gray-500">{m.month}</th>
                ))}
                <th className="pb-3 text-center font-medium text-gray-500">Media</th>
              </tr>
            </thead>
            <tbody>
              {heatmaps.map((zone) => (
                <tr key={zone.id} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{zone.zone}</td>
                  {zone.monthlyDemand.map((m) => {
                    const config = DEMAND_LEVEL_CONFIG[m.level];
                    return (
                      <td key={m.month} className="py-3 text-center">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {m.demand}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 text-center font-bold text-gray-900">{zone.avgAnnualDemand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forecasts */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <TrendingUp className="h-5 w-5" /> Previsioni attive
        </h2>
        <div className="space-y-4">
          {forecasts.map((fc) => {
            const config = DEMAND_LEVEL_CONFIG[fc.demandLevel];
            return (
              <div key={fc.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">{fc.zone} — {fc.forecastPeriod}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{fc.propertyType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{fc.predictedDemand}</p>
                    <p className="text-xs text-gray-400">CI: {fc.confidenceMin}–{fc.confidenceMax}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-medium text-blue-700">🏠 Consiglio proprietari</p>
                    <p className="mt-1 text-sm text-blue-800">{fc.listingTimingAdvice}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-700">🎓 Consiglio studenti</p>
                    <p className="mt-1 text-sm text-green-800">{fc.studentAdvice}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  Prezzo suggerito: €{fc.priceRecommendation}/mese
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Yield Recommendations (Landlord) */}
      {yields.length > 0 && (
        <section className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-green-900">
            <DollarSign className="h-5 w-5" /> Raccomandazioni rendimento
          </h2>
          <div className="space-y-3">
            {yields.map((y) => (
              <div key={y.id} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{y.listingTitle}</h3>
                    <p className="mt-1 text-sm text-gray-600">{y.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">€{y.currentPrice} → <span className="text-lg font-bold text-green-700">€{y.recommendedPrice}</span></p>
                    <p className="text-xs text-green-600">+€{y.priceChange}/mese ({y.confidence}% confidenza)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Calendar Events */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Eventi chiave calendario accademico</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Sun className="h-5 w-5 text-amber-500" />, event: "Immatricolazioni", period: "Lug-Ago", impact: "Picco ricerche" },
            { icon: <Leaf className="h-5 w-5 text-green-500" />, event: "Inizio 1° semestre", period: "Set", impact: "Massima domanda" },
            { icon: <Snowflake className="h-5 w-5 text-blue-500" />, event: "Arrivo Erasmus", period: "Feb", impact: "Secondo picco" },
            { icon: <Cloud className="h-5 w-5 text-gray-500" />, event: "Fine lezioni", period: "Mag-Giu", impact: "Uscite e turnover" },
          ].map((e) => (
            <div key={e.event} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2">
                {e.icon}
                <span className="text-sm font-semibold text-gray-900">{e.event}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{e.period} — {e.impact}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { getInsightsDashboard } from "@/lib/actions/analytics";
import { getPlatformMetrics } from "@/lib/stores/analytics";
import { BarChart3, Eye, Heart, MessageSquare, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights & Analytics",
  description: "Analisi e metriche della tua attività su CasaStudente.",
};

export default async function InsightsPage() {
  const data = await getInsightsDashboard();
  const metrics = await getPlatformMetrics();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Analytics & Insights
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Metriche e intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Dati in tempo reale sulla tua attività e sulla piattaforma. Ogni azione — ricerca, visita, contatto — genera
          insights azionabili.
        </p>
      </section>

      {/* Platform Metrics */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Utenti attivi</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Percorsi attivi</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeJourneys}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Contratti completati</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.completedLeases}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ricavo piattaforma</p>
              <p className="text-2xl font-bold text-gray-900">€{metrics.monthlyRevenue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Funnel */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Funnel di conversione</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Dati reali derivati dai percorsi degli utenti sulla piattaforma.
        </p>
        <div className="mt-6 space-y-3">
          {metrics.conversionFunnel.map((step, i) => (
            <div key={step.stage} className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium text-gray-700">{step.stage}</span>
              <div className="flex-1">
                <div className="h-8 rounded-lg bg-gray-100">
                  <div
                    className="flex h-8 items-center rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white transition-all"
                    style={{ width: `${Math.max(step.rate, 5)}%` }}
                  >
                    {step.count}
                  </div>
                </div>
              </div>
              <span className="w-12 text-right text-sm text-gray-500">{step.rate}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Supply-Demand by Zone */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Domanda per zona</h2>
        <p className="mt-1 text-sm text-gray-500">
          Distribuzione delle ricerche e visualizzazioni per zona.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Object.entries(metrics.supplyDemandRatio)
            .sort(([, a], [, b]) => b - a)
            .map(([zone, demand]) => (
              <div key={zone} className="rounded-2xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900">{zone}</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-bold text-indigo-600">{demand}</span>
                  <span className="text-sm text-gray-500 pb-1">interazioni</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-400"
                    style={{ width: `${Math.min(100, demand * 15)}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Role-specific insights */}
      {data?.type === "landlord" && data.insights && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Performance dei tuoi annunci</h2>
          <div className="mt-6 space-y-4">
            {data.insights.map((insight) => (
              <div key={insight.listingId} className="rounded-2xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900">{insight.listingTitle}</h3>
                <div className="mt-3 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <Eye className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-1 text-lg font-bold">{insight.views}</p>
                    <p className="text-xs text-gray-500">Visite</p>
                  </div>
                  <div>
                    <Heart className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-1 text-lg font-bold">{insight.saves}</p>
                    <p className="text-xs text-gray-500">Salvati</p>
                  </div>
                  <div>
                    <MessageSquare className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-1 text-lg font-bold">{insight.inquiries}</p>
                    <p className="text-xs text-gray-500">Richieste</p>
                  </div>
                  <div>
                    <TrendingUp className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-1 text-lg font-bold">{insight.conversionRate}%</p>
                    <p className="text-xs text-gray-500">Conversione</p>
                  </div>
                </div>
                {insight.suggestions.length > 0 && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">Suggerimenti:</p>
                    <ul className="mt-1 space-y-1 text-sm text-amber-700">
                      {insight.suggestions.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.type === "student" && data.studentInsights && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Le tue ricerche</h2>
          <p className="mt-1 text-sm text-gray-500">Riepilogo della tua attività di ricerca.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{data.studentInsights.totalViewed}</p>
              <p className="text-sm text-gray-500">Annunci visualizzati</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{data.studentInsights.savedCount}</p>
              <p className="text-sm text-gray-500">Annunci salvati</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{data.studentInsights.contactedCount}</p>
              <p className="text-sm text-gray-500">Proprietari contattati</p>
            </div>
          </div>
          {data.studentInsights.topZones.length > 0 && (
            <div className="mt-4 rounded-lg bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-900">
                Zone più cercate: {data.studentInsights.topZones.map((z) => `${z.zone} (${z.count})`).join(", ")}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

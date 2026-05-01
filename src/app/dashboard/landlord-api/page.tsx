import type { Metadata } from "next";
import { getMyAPIKeys, getMyWebhooks, getMyWidgets, getAPIUsageStats, getLandlordListingPerformance } from "@/lib/actions/landlord-api";
import { getCurrentUser } from "@/lib/auth";
import { Key, Webhook, Code, BarChart3, Activity, Clock, CheckCircle, ExternalLink, Eye, Heart, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "API Proprietario — Self-Service Analytics",
  description: "API self-service per proprietari e agenzie immobiliari su CasaStudente.",
};

export default async function LandlordAPIPage() {
  const user = await getCurrentUser();
  const apiKeys = await getMyAPIKeys();
  const webhooks = await getMyWebhooks();
  const widgets = await getMyWidgets();
  const usageStats = await getAPIUsageStats();
  const performance = await getLandlordListingPerformance();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
          API Proprietario
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Analytics API Self-Service
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          API per accedere ai dati di performance dei tuoi annunci: visualizzazioni, conversioni,
          competitività prezzo, occupancy. Webhook per eventi in tempo reale e widget embeddabili
          per il tuo sito web.
        </p>
      </section>

      {/* Usage Stats */}
      {usageStats && (
        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2"><Activity className="h-5 w-5 text-cyan-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Richieste totali</p>
                <p className="text-2xl font-bold text-gray-900">{usageStats.totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><Clock className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Tempo risposta medio</p>
                <p className="text-2xl font-bold text-gray-900">{usageStats.avgResponseTime}ms</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Success rate</p>
                <p className="text-2xl font-bold text-gray-900">{usageStats.successRate}%</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* API Keys */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Key className="h-5 w-5" /> Chiavi API
        </h2>
        {apiKeys.length === 0 ? (
          <p className="text-sm text-gray-500">Nessuna chiave API creata. Crea una chiave per iniziare a usare l&apos;API.</p>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="font-mono text-sm text-gray-900">{key.keyPrefix}••••••••</p>
                  <p className="text-xs text-gray-500">
                    Scopes: {key.scopes.join(", ")} — Limite: {key.rateLimit}/min — Utilizzi: {key.usageCount}
                  </p>
                  <p className="text-xs text-gray-400">
                    Creata: {new Date(key.createdAt).toLocaleDateString("it-IT")} —
                    Scade: {new Date(key.expiresAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${key.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {key.active ? "Attiva" : "Revocata"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listing Performance */}
      {performance.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <BarChart3 className="h-5 w-5" /> Performance annunci
          </h2>
          <div className="space-y-4">
            {performance.map((p) => (
              <div key={p.listingId} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Visualizzazioni</p>
                      <p className="text-lg font-bold text-gray-900">{p.views}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Salvati</p>
                      <p className="text-lg font-bold text-gray-900">{p.saves}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Richieste</p>
                      <p className="text-lg font-bold text-gray-900">{p.inquiries}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Conversione</p>
                      <p className="text-lg font-bold text-gray-900">{p.conversionRate}%</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>Tempo sul mercato: {p.timeOnMarket} giorni</span>
                  <span>Competitività prezzo: {p.priceCompetitiveness}/100</span>
                  <span>Occupancy: {p.occupancyRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Webhooks */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Webhook className="h-5 w-5" /> Webhook
        </h2>
        {webhooks.length === 0 ? (
          <p className="text-sm text-gray-500">Nessun webhook configurato. I webhook inviano notifiche in tempo reale al tuo sistema.</p>
        ) : (
          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{wh.url}</p>
                    <p className="text-xs text-gray-500">
                      Eventi: {wh.events.join(", ")} — Consegne: {wh.deliveryCount} — Errori: {wh.failureCount}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${wh.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {wh.active ? "Attivo" : "Disattivato"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Embeddable Widgets */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Code className="h-5 w-5" /> Widget embeddabili
        </h2>
        {widgets.length === 0 ? (
          <p className="text-sm text-gray-500">Nessun widget creato. I widget ti permettono di mostrare recensioni e stato occupancy sul tuo sito.</p>
        ) : (
          <div className="space-y-4">
            {widgets.map((w) => (
              <div key={w.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {w.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Impressioni: {w.impressions.toLocaleString()} — Click: {w.clicks}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-2 rounded bg-gray-900 p-3">
                  <code className="text-xs text-green-400">{w.embedCode}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* API Documentation */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Endpoint API</h2>
        <div className="space-y-2 font-mono text-sm">
          {[
            { method: "GET", path: "/api/landlord/listings", desc: "I tuoi annunci con metriche" },
            { method: "GET", path: "/api/landlord/analytics", desc: "Dashboard analytics completa" },
            { method: "GET", path: "/api/landlord/inquiries", desc: "Pipeline richieste" },
            { method: "GET", path: "/api/landlord/payments", desc: "Riepilogo finanziario" },
            { method: "POST", path: "/api/landlord/webhooks", desc: "Gestione webhook" },
          ].map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2">
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${ep.method === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {ep.method}
              </span>
              <span className="text-gray-900">{ep.path}</span>
              <span className="ml-auto text-xs text-gray-500">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Non-landlord info */}
      {user?.role !== "landlord" && user?.role !== "admin" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Key className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">API per proprietari</h2>
          <p className="mt-2 text-sm text-gray-500">
            L&apos;API self-service è disponibile per proprietari e agenzie immobiliari registrati sulla piattaforma.
          </p>
        </section>
      )}
    </div>
  );
}

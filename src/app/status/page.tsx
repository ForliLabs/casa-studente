import type { Metadata } from "next";
import { Activity, AlertTriangle, CheckCircle2, Clock3, HardDrive, Radar, ServerCog } from "lucide-react";
import { buildHealthReport } from "@/lib/health";
import { StatusActions } from "@/components/status-actions";
import { StatusServiceBoard } from "@/components/status-service-board";

export const metadata: Metadata = {
  title: "Platform Status",
  description: "Stato operativo di CasaStudente e integrazioni di produzione.",
};

const readinessItems = [
  { key: "servesTraffic", label: "Traffico pubblico", description: "L'app può servire richieste senza blocchi critici." },
  { key: "paymentsReady", label: "Pagamenti", description: "Checkout e riscossioni Stripe pronti per l'uso." },
  { key: "notificationsReady", label: "Notifiche", description: "Email transazionali disponibili per onboarding e supporto." },
  { key: "uploadsReady", label: "Upload file", description: "Storage pronto per foto e documenti degli annunci." },
  { key: "observabilityReady", label: "Osservabilità", description: "Monitoraggio o analytics configurati per rilevare regressioni." },
] as const;

const overallStyles = {
  healthy: {
    badge: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-200 bg-emerald-50",
    icon: CheckCircle2,
    label: "Operativo",
  },
  degraded: {
    badge: "bg-amber-100 text-amber-700",
    card: "border-amber-200 bg-amber-50",
    icon: AlertTriangle,
    label: "Parzialmente operativo",
  },
  unhealthy: {
    badge: "bg-red-100 text-red-700",
    card: "border-red-200 bg-red-50",
    icon: AlertTriangle,
    label: "Intervento richiesto",
  },
} as const;

export default function StatusPage() {
  const report = buildHealthReport({ verbose: true });
  const overall = overallStyles[report.status];
  const OverallIcon = overall.icon;

  return (
    <div className="space-y-8">
      <section className={`rounded-3xl border p-8 shadow-sm ${overall.card}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Platform status</p>
            <div className="mt-4 flex items-center gap-3">
              <OverallIcon className="h-7 w-7" />
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{overall.label}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${overall.badge}`}>{report.status}</span>
            </div>
            <p className="mt-4 max-w-3xl text-base text-slate-700">{report.summary}</p>
            <p className="mt-2 text-sm text-slate-600">
              Ultimo aggiornamento: {new Date(report.timestamp).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "medium" })}
            </p>
          </div>
          <StatusActions endpointPath="/api/health?verbose=1" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusMetricCard
          icon={Activity}
          label="Integrazioni configurate"
          value={`${report.services.configured}/${report.services.total}`}
          helper="Servizi esterni pronti per il deploy"
        />
        <StatusMetricCard
          icon={Clock3}
          label="Uptime runtime"
          value={`${report.uptime}s`}
          helper="Tempo di attività del processo corrente"
        />
        <StatusMetricCard
          icon={Radar}
          label="Osservabilità"
          value={report.readiness.observabilityReady ? "Pronta" : "Parziale"}
          helper="Sentry o PostHog configurati"
        />
        <StatusMetricCard
          icon={HardDrive}
          label="Heap utilizzato"
          value={`${report.memory?.heapUsedMB ?? 0} MB`}
          helper={`Node ${report.runtime?.nodeVersion ?? "n/d"}`}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ServerCog className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Readiness checklist</h2>
          </div>
          <div className="mt-6 space-y-4">
            {readinessItems.map((item) => {
              const active = report.readiness[item.key];
              return (
                <div key={item.key} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-1 ${active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {active ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {active ? "ready" : "action needed"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Azioni consigliate</h2>
          </div>
          <div className="mt-6 space-y-3">
            {report.issues.length > 0 ? (
              report.issues.map((issue) => (
                <div key={issue} className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                  {issue}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                Nessuna azione bloccante: lo stack è pronto per essere monitorato e scalato.
              </div>
            )}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              Endpoint machine-readable: <code className="font-mono">/api/health?verbose=1</code>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Service breakdown</h2>
        <p className="mt-1 text-sm text-gray-500">
          Controllo rapido di dipendenze critiche, configurazioni mancanti e raccomandazioni operative.
        </p>
        <StatusServiceBoard services={report.services.details} />
      </section>
    </div>
  );
}

function StatusMetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">{helper}</p>
    </div>
  );
}

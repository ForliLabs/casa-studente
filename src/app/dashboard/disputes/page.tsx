import type { Metadata } from "next";
import { getMyDisputes, getDisputeTemplates, getDisputeStats } from "@/lib/actions/disputes";
import { getCurrentUser } from "@/lib/auth";
import { Scale, AlertCircle, CheckCircle, Clock, MessageSquare, Camera, FileText, Wrench, DollarSign, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Controversie — Centro Mediazione",
  description: "Risoluzione controversie e mediazione per affitti studenteschi su CasaStudente.",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  filed: { label: "Aperta", color: "bg-blue-100 text-blue-700" },
  acknowledged: { label: "Presa in carico", color: "bg-indigo-100 text-indigo-700" },
  evidence: { label: "Raccolta prove", color: "bg-purple-100 text-purple-700" },
  mediation: { label: "In mediazione", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Risolta", color: "bg-green-100 text-green-700" },
  escalated: { label: "Escalata", color: "bg-red-100 text-red-700" },
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  deposit: { label: "Deposito cauzionale", icon: <DollarSign className="h-4 w-4" />, color: "text-amber-600" },
  maintenance: { label: "Manutenzione", icon: <Wrench className="h-4 w-4" />, color: "text-blue-600" },
  early_termination: { label: "Risoluzione anticipata", icon: <FileText className="h-4 w-4" />, color: "text-red-600" },
};

export default async function DisputesPage() {
  const user = await getCurrentUser();
  const disputes = await getMyDisputes();
  const templates = await getDisputeTemplates();
  const stats = await getDisputeStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Centro Mediazione
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Risoluzione controversie
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Gestione strutturata dei tre tipi più comuni di controversia: depositi cauzionali,
          manutenzione e risoluzione anticipata. Ogni caso segue un percorso: apertura → presa in carico →
          raccolta prove → mediazione → risoluzione. Escalation automatica dopo 7 giorni senza risposta.
        </p>
      </section>

      {/* Admin Stats */}
      {stats && (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2"><Scale className="h-5 w-5 text-orange-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Totale</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Aperte</p>
                <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Risolte</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2"><AlertCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Escalate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.escalated}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2"><Users className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Tempo medio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionDays}gg</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dispute List */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Le tue controversie</h2>
        {disputes.length === 0 ? (
          <div className="py-8 text-center">
            <Scale className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">Nessuna controversia aperta. Speriamo che non ne avrai mai bisogno!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => {
              const typeConfig = TYPE_CONFIG[dispute.type];
              const statusConfig = STATUS_LABELS[dispute.status];
              return (
                <div key={dispute.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={typeConfig.color}>{typeConfig.icon}</span>
                        <span className="text-xs font-medium text-gray-400">{typeConfig.label}</span>
                      </div>
                      <h3 className="mt-1 text-base font-semibold text-gray-900">{dispute.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{dispute.listingTitle}</p>
                      <p className="mt-2 text-sm text-gray-600">{dispute.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      {dispute.amount && (
                        <span className="text-sm font-medium text-gray-700">€{dispute.amount}</span>
                      )}
                      {dispute.urgency && (
                        <span className={`text-xs ${
                          dispute.urgency === "emergency" ? "text-red-600" :
                          dispute.urgency === "high" ? "text-orange-600" :
                          "text-gray-500"
                        }`}>
                          Urgenza: {dispute.urgency}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Evidence */}
                  {dispute.evidence.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {dispute.evidence.map((ev) => (
                        <div key={ev.id} className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-gray-500">
                          <Camera className="h-3 w-3" />
                          {ev.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  {dispute.messages.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                      <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
                        <MessageSquare className="h-3 w-3" />
                        Messaggi ({dispute.messages.length})
                      </p>
                      {dispute.messages.slice(-2).map((msg) => (
                        <div key={msg.id} className="rounded-lg bg-white p-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-gray-900">{msg.senderName}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              msg.senderRole === "admin" ? "bg-red-100 text-red-600" :
                              msg.senderRole === "landlord" ? "bg-blue-100 text-blue-600" :
                              "bg-green-100 text-green-600"
                            }`}>
                              {msg.senderRole === "admin" ? "Admin" : msg.senderRole === "landlord" ? "Proprietario" : "Inquilino"}
                            </span>
                            <span className="text-gray-400">{new Date(msg.createdAt).toLocaleDateString("it-IT")}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resolution */}
                  {dispute.resolution && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                      <p className="text-xs font-medium text-green-700">Risoluzione</p>
                      <p className="mt-1 text-sm text-green-800">{dispute.resolution}</p>
                      {(dispute.satisfactionTenant || dispute.satisfactionLandlord) && (
                        <p className="mt-2 text-xs text-green-600">
                          Soddisfazione: Inquilino {dispute.satisfactionTenant}/5 — Proprietario {dispute.satisfactionLandlord}/5
                        </p>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>Aperta: {new Date(dispute.filedAt).toLocaleDateString("it-IT")}</span>
                    {dispute.acknowledgedAt && <span>Presa in carico: {new Date(dispute.acknowledgedAt).toLocaleDateString("it-IT")}</span>}
                    {dispute.resolvedAt && <span>Risolta: {new Date(dispute.resolvedAt).toLocaleDateString("it-IT")}</span>}
                    {!dispute.resolvedAt && <span className="text-amber-500">Auto-escalation: {new Date(dispute.autoEscalateAt).toLocaleDateString("it-IT")}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Dispute Templates */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Tipi di controversia supportati</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((tmpl) => {
            const config = TYPE_CONFIG[tmpl.type];
            return (
              <div key={tmpl.id} className="rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-2">
                  <span className={config.color}>{config.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-900">{tmpl.title}</h3>
                </div>
                <p className="mt-2 text-xs text-gray-600">{tmpl.description}</p>
                <p className="mt-3 text-xs text-gray-400"><strong>Risoluzione suggerita:</strong> {tmpl.suggestedResolution}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Explanation */}
      <section className="rounded-2xl border border-orange-200 bg-orange-50 p-8">
        <h2 className="text-lg font-semibold text-orange-900">Come funziona il processo</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { step: "1", label: "Apertura", desc: "Descrivi il problema e allega prove" },
            { step: "2", label: "Presa in carico", desc: "L'altra parte ha 48h per rispondere" },
            { step: "3", label: "Raccolta prove", desc: "Entrambe le parti caricano documentazione" },
            { step: "4", label: "Mediazione", desc: "Facilitazione della risoluzione" },
            { step: "5", label: "Risoluzione", desc: "Accordo documentato e soddisfazione" },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-sm font-bold text-orange-800">
                {s.step}
              </div>
              <p className="mt-2 text-sm font-medium text-orange-900">{s.label}</p>
              <p className="mt-1 text-xs text-orange-700">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-orange-600">
          ⚠️ CasaStudente offre facilitazione, non arbitrato. Per controversie complesse, si consiglia di consultare un legale.
          Escalation automatica dopo 7 giorni senza risposta.
        </p>
      </section>
    </div>
  );
}

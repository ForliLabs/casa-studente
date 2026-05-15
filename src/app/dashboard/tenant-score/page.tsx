import type { Metadata } from "next";
import { getMyTenantScore, getAllTenantScores } from "@/lib/actions/tenant-score";
import { TIER_CONFIG, SCORE_WEIGHTS } from "@/lib/stores/tenant-score";
import { getCurrentUser } from "@/lib/auth";
import { Shield, TrendingUp, Award, CheckCircle, AlertCircle, Star, FileText, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "TenantScore — Punteggio Affidabilità",
  description: "Il tuo punteggio di affidabilità basato sul comportamento sulla piattaforma CasaStudente.",
};

function ScoreGauge({ score, tierLabel, tierColor }: { score: number; tierLabel: string; tierColor: string }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100" aria-label={`Punteggio: ${score} su 100`} role="img">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={score >= 86 ? "#9333ea" : score >= 66 ? "#16a34a" : score >= 41 ? "#2563eb" : "#6b7280"}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tierColor}`}>
        {tierLabel}
      </span>
    </div>
  );
}

function ComponentBar({ label, value, weight, icon }: { label: string; value: number; weight: number; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700">
          {icon}
          {label}
        </span>
        <span className="font-medium text-gray-900">{value}/100 <span className="text-xs text-gray-400">({Math.round(weight * 100)}%)</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${value} su 100`}>
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${value}%`,
            backgroundColor: value >= 80 ? "#16a34a" : value >= 60 ? "#2563eb" : value >= 40 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

export default async function TenantScorePage() {
  const user = await getCurrentUser();
  const myScore = await getMyTenantScore();
  const allScores = user?.role === "admin" ? await getAllTenantScores() : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
          TenantScore
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Punteggio di affidabilità
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Il TenantScore è un punteggio composito (0–100) basato sul tuo comportamento sulla piattaforma:
          puntualità nei pagamenti, completamento contratti, recensioni, documentazione e verifica universitaria.
          Accessibile anche a studenti internazionali senza storia creditizia italiana.
        </p>
      </section>

      {/* Student Score View */}
      {myScore && (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Score Gauge */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-1">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Il tuo punteggio</h2>
              <ScoreGauge
                score={myScore.overallScore}
                tierLabel={myScore.tierLabel}
                tierColor={myScore.tierColor}
              />
              <p className="mt-4 text-center text-sm text-gray-500">{myScore.tierDescription}</p>
            </div>

            {/* Component Breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Dettaglio componenti</h2>
              <div className="space-y-4">
                <ComponentBar label="Puntualità pagamenti" value={myScore.paymentPunctuality} weight={SCORE_WEIGHTS.paymentPunctuality} icon={<Clock className="h-4 w-4 text-green-500" />} />
                <ComponentBar label="Completamento contratti" value={myScore.leaseCompletion} weight={SCORE_WEIGHTS.leaseCompletion} icon={<FileText className="h-4 w-4 text-blue-500" />} />
                <ComponentBar label="Recensioni proprietari" value={myScore.landlordReviews} weight={SCORE_WEIGHTS.landlordReviews} icon={<Star className="h-4 w-4 text-yellow-500" />} />
                <ComponentBar label="Conformità documenti" value={myScore.documentCompliance} weight={SCORE_WEIGHTS.documentCompliance} icon={<Shield className="h-4 w-4 text-indigo-500" />} />
                <ComponentBar label="Verifica universitaria" value={myScore.verificationStatus} weight={SCORE_WEIGHTS.verificationStatus} icon={<CheckCircle className="h-4 w-4 text-teal-500" />} />
                <ComponentBar label="Permanenza piattaforma" value={myScore.platformTenure} weight={SCORE_WEIGHTS.platformTenure} icon={<TrendingUp className="h-4 w-4 text-gray-500" />} />
              </div>
            </div>
          </section>

          {/* Score History */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Andamento storico</h2>
            <div className="flex items-end gap-2" role="img" aria-label="Grafico andamento punteggio">
              {myScore.scoreHistory.map((h) => (
                <div key={h.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-900">{h.score}</span>
                  <div
                    className="w-full rounded-t bg-purple-500 transition-all"
                    style={{ height: `${Math.max(20, h.score * 1.5)}px` }}
                  />
                  <span className="text-xs text-gray-500">{h.month.split("-")[1]}/{h.month.split("-")[0].slice(2)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Improvement Tips */}
          {myScore.improvementTips.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-900">
                <AlertCircle className="h-5 w-5" />
                Suggerimenti per migliorare
              </h2>
              <ul className="mt-4 space-y-2">
                {myScore.improvementTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* External References */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Referenze esterne</h2>
            <div className="space-y-3">
              {myScore.references.length === 0 && (
                <p className="text-sm text-gray-500">Nessuna referenza esterna aggiunta. Aggiungi un garante o un precedente proprietario.</p>
              )}
              {myScore.references.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ref.contactName}</p>
                    <p className="text-xs text-gray-500">{ref.type === "guarantor" ? "Garante" : "Precedente proprietario"} — {ref.contactEmail}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    ref.status === "verified" ? "bg-green-100 text-green-700" :
                    ref.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {ref.status === "verified" ? "Verificato" : ref.status === "pending" ? "In attesa" : "Scaduto"}
                  </span>
                </div>
              ))}
            </div>

            {/* Add reference form */}
            <form action="/api/tenant-score/reference" method="POST" className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900">Aggiungi referenza</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="ref-type" className="block text-xs text-gray-600">Tipo</label>
                  <select id="ref-type" name="type" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" required>
                    <option value="guarantor">Garante</option>
                    <option value="previous_landlord">Precedente proprietario</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ref-name" className="block text-xs text-gray-600">Nome</label>
                  <input id="ref-name" type="text" name="contactName" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" required placeholder="Mario Rossi" />
                </div>
                <div>
                  <label htmlFor="ref-email" className="block text-xs text-gray-600">Email</label>
                  <input id="ref-email" type="email" name="contactEmail" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" required placeholder="email@example.com" />
                </div>
              </div>
              <button type="submit" className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                Invia richiesta verifica
              </button>
            </form>
          </section>

          {/* Tier Legend */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Livelli TenantScore</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.entries(TIER_CONFIG) as [string, typeof TIER_CONFIG[keyof typeof TIER_CONFIG]][]).map(([key, config]) => (
                <div key={key} className="rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${config.color.split(" ")[0]}`} />
                    <span className="text-sm font-semibold text-gray-900">{config.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{config.min}–{config.max} punti</p>
                  <p className="mt-2 text-xs text-gray-600">{config.description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Admin View */}
      {user?.role === "admin" && allScores.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Panoramica TenantScore (Admin)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Studente</th>
                  <th className="pb-3 font-medium text-gray-500">Punteggio</th>
                  <th className="pb-3 font-medium text-gray-500">Livello</th>
                  <th className="pb-3 font-medium text-gray-500">Pagamenti</th>
                  <th className="pb-3 font-medium text-gray-500">Contratti</th>
                  <th className="pb-3 font-medium text-gray-500">Garante</th>
                </tr>
              </thead>
              <tbody>
                {allScores.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{s.tenantName}</td>
                    <td className="py-3 font-bold text-gray-900">{s.overallScore}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${TIER_CONFIG[s.tier].color}`}>
                        {TIER_CONFIG[s.tier].label}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{s.paymentPunctuality}%</td>
                    <td className="py-3 text-gray-600">{s.leaseCompletion}%</td>
                    <td className="py-3">{s.hasGuarantor ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Non-student info */}
      {!myScore && user?.role !== "admin" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Shield className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">TenantScore per studenti</h2>
          <p className="mt-2 text-sm text-gray-500">
            Il TenantScore è disponibile per gli studenti registrati sulla piattaforma. Registrati come studente per costruire il tuo profilo di affidabilità.
          </p>
        </section>
      )}
    </div>
  );
}

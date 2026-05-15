import type { Metadata } from "next";
import { getMyPolicies, getMyClaims, getMyEscrows, getReserveFundStatus } from "@/lib/actions/insurance";
import { PREMIUM_RATES } from "@/lib/stores/insurance";
import { getCurrentUser } from "@/lib/auth";
import { Shield, DollarSign, FileWarning, Wallet, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Assicurazione Affitto — Garanzia",
  description: "Garanzia affitto e deposito cauzionale su CasaStudente.",
};

export default async function InsurancePage() {
  const user = await getCurrentUser();
  const policies = await getMyPolicies();
  const claims = await getMyClaims();
  const escrows = await getMyEscrows();
  const reserveFund = await getReserveFundStatus();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Garanzia Affitto
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Assicurazione e deposito cauzionale
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Protezione integrata per proprietari e inquilini: garanzia fino a 3 mesi di affitto non pagato,
          deposito cauzionale in escrow con confronto fotografico check-in/check-out, e gestione reclami
          trasparente. Premi basati sul TenantScore per un prezzo equo.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2"><Shield className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Polizze attive</p>
              <p className="text-2xl font-bold text-gray-900">{policies.filter(p => p.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><DollarSign className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Copertura totale</p>
              <p className="text-2xl font-bold text-gray-900">€{policies.reduce((sum, p) => sum + p.maxCoverage, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2"><FileWarning className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Reclami aperti</p>
              <p className="text-2xl font-bold text-gray-900">{claims.filter(c => !["paid", "denied"].includes(c.status)).length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2"><Wallet className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Depositi in escrow</p>
              <p className="text-2xl font-bold text-gray-900">€{escrows.reduce((sum, e) => sum + e.depositAmount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Policies */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Le tue polizze</h2>
        {policies.length === 0 ? (
          <p className="text-sm text-gray-500">Nessuna polizza attiva. La garanzia viene attivata automaticamente alla firma del contratto.</p>
        ) : (
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{policy.listingTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {user?.role === "student" ? `Proprietario: ${policy.landlordName}` : `Inquilino: ${policy.tenantName}`}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Affitto: €{policy.monthlyRent}/mese</span>
                      <span>Copertura: fino a €{policy.maxCoverage}</span>
                      <span>Premio: €{policy.monthlyPremium}/mese</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      policy.status === "active" ? "bg-green-100 text-green-700" :
                      policy.status === "claimed" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {policy.status === "active" ? "Attiva" : policy.status === "claimed" ? "In reclamo" : policy.status === "expired" ? "Scaduta" : "Annullata"}
                    </span>
                    <span className="text-xs text-gray-400">Rischio: {policy.riskCategory}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <span>Inizio: {new Date(policy.startDate).toLocaleDateString("it-IT")}</span>
                  <span>Fine: {new Date(policy.endDate).toLocaleDateString("it-IT")}</span>
                  <span>Tasso: {(policy.premiumRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Premium Calculator */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Calcolatore premio</h2>
        <p className="mb-4 text-sm text-gray-600">
          Il premio assicurativo è calcolato in base al TenantScore dell&apos;inquilino. Più alto il punteggio, più basso il premio.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">Livello TenantScore</th>
                <th className="pb-3 font-medium text-gray-500">Tasso premio</th>
                <th className="pb-3 font-medium text-gray-500">Esempio (€450/mese)</th>
                <th className="pb-3 font-medium text-gray-500">Esempio (€600/mese)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(PREMIUM_RATES).map(([tier, rate]) => (
                <tr key={tier} className="border-b border-gray-100">
                  <td className="py-3 capitalize font-medium text-gray-900">{tier === "developing" ? "In sviluppo" : tier === "reliable" ? "Affidabile" : tier === "trusted" ? "Fidato" : "Eccellente"}</td>
                  <td className="py-3 text-gray-600">{(rate * 100).toFixed(1)}%</td>
                  <td className="py-3 text-gray-600">€{(450 * rate).toFixed(2)}/mese</td>
                  <td className="py-3 text-gray-600">€{(600 * rate).toFixed(2)}/mese</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Claims */}
      {claims.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Reclami</h2>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {claim.type === "unpaid_rent" ? "Affitto non pagato" : claim.type === "property_damage" ? "Danno alla proprietà" : "Risoluzione anticipata"}
                  </p>
                  <p className="text-xs text-gray-500">€{claim.amount} — {new Date(claim.filedAt).toLocaleDateString("it-IT")}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  claim.status === "paid" ? "bg-green-100 text-green-700" :
                  claim.status === "denied" ? "bg-red-100 text-red-700" :
                  claim.status === "filed" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {claim.status === "filed" ? "Presentato" : claim.status === "evidence" ? "In evidenza" : claim.status === "assessment" ? "In valutazione" : claim.status === "approved" ? "Approvato" : claim.status === "paid" ? "Pagato" : "Rifiutato"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Escrow */}
      {escrows.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Depositi cauzionali in escrow</h2>
          <div className="space-y-3">
            {escrows.map((escrow) => (
              <div key={escrow.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Deposito: €{escrow.depositAmount}</p>
                    <p className="text-xs text-gray-500">
                      Check-in: {escrow.checkInPhotos.length} foto — Check-out: {escrow.checkOutPhotos.length} foto
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    escrow.status === "held" ? "bg-blue-100 text-blue-700" :
                    escrow.status === "fully_released" ? "bg-green-100 text-green-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {escrow.status === "held" ? "Trattenuto" : escrow.status === "fully_released" ? "Rilasciato" : escrow.status === "partially_released" ? "Parziale" : "Contestato"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Admin: Reserve Fund */}
      {reserveFund && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-900">
            <TrendingUp className="h-5 w-5" />
            Fondo di riserva (Admin)
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-indigo-600">Premi raccolti</p>
              <p className="text-xl font-bold text-indigo-900">€{reserveFund.totalPremiumsCollected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Reclami pagati</p>
              <p className="text-xl font-bold text-indigo-900">€{reserveFund.totalClaimsPaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Saldo corrente</p>
              <p className="text-xl font-bold text-indigo-900">€{reserveFund.currentBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Rapporto riserva</p>
              <p className="text-xl font-bold text-indigo-900">{reserveFund.reserveRatio.toFixed(1)}:1</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

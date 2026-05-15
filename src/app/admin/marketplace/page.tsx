import type { Metadata } from "next";
import { getMarketplaceHealth } from "@/lib/actions/marketplace";
import { Activity, AlertTriangle, BarChart3, Users, Star, Link2, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace Health",
  description: "Strumenti di salute del marketplace e acquisizione proprietari.",
};

const gapConfig = {
  deficit: { label: "Deficit", color: "bg-red-100 text-red-800", icon: TrendingUp },
  balanced: { label: "Bilanciato", color: "bg-green-100 text-green-800", icon: Minus },
  surplus: { label: "Surplus", color: "bg-blue-100 text-blue-800", icon: TrendingDown },
};

export default async function MarketplaceHealthPage() {
  const health = await getMarketplaceHealth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace Health & Supply</h1>
        <p className="mt-1 text-gray-500">
          Monitoraggio domanda-offerta, qualità annunci e strumenti di acquisizione proprietari.
        </p>
      </div>

      {/* Overview stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-gray-500">Annunci attivi</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{health.overview.totalListings}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-gray-500">Qualità media</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{health.overview.avgQuality}/10</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-gray-500">Zone in deficit</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">{health.overview.deficitZones}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-500">Referral attivi</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{health.overview.totalReferrals}</p>
        </div>
      </section>

      {/* Supply-Demand by Zone */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Domanda vs Offerta per zona</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">Zona</th>
                <th className="pb-3 font-medium text-gray-500">Annunci</th>
                <th className="pb-3 font-medium text-gray-500">Cercatori</th>
                <th className="pb-3 font-medium text-gray-500">Rapporto</th>
                <th className="pb-3 font-medium text-gray-500">Stato</th>
                <th className="pb-3 font-medium text-gray-500">Prezzo medio</th>
                <th className="pb-3 font-medium text-gray-500">Giorni mercato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {health.supplyDemand.map((sd) => {
                const gap = gapConfig[sd.gap];
                const GapIcon = gap.icon;
                return (
                  <tr key={sd.zone}>
                    <td className="py-3 font-medium text-gray-900">{sd.zone}</td>
                    <td className="py-3 text-gray-600">{sd.activeListings}</td>
                    <td className="py-3 text-gray-600">{sd.activeSearchers}</td>
                    <td className="py-3 font-mono text-gray-600">{sd.ratio.toFixed(1)}x</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${gap.color}`}>
                        <GapIcon className="h-3 w-3" />
                        {gap.label}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">&euro;{sd.avgPrice}</td>
                    <td className="py-3 text-gray-600">{sd.avgDaysOnMarket}g</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Listing Quality Scores */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">Qualità annunci</h2>
        </div>
        <div className="mt-4 space-y-3">
          {health.qualityScores.map((qs) => (
            <div key={qs.id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{qs.listingId}</span>
                <span className={`text-lg font-bold ${qs.overallScore >= 8 ? "text-green-600" : qs.overallScore >= 6 ? "text-amber-600" : "text-red-600"}`}>
                  {qs.overallScore}/10
                </span>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                <div className="text-center"><div className="font-medium">{qs.photoScore}</div><div className="text-gray-400">Foto</div></div>
                <div className="text-center"><div className="font-medium">{qs.descriptionScore}</div><div className="text-gray-400">Desc</div></div>
                <div className="text-center"><div className="font-medium">{qs.featureScore}</div><div className="text-gray-400">Features</div></div>
                <div className="text-center"><div className="font-medium">{qs.priceScore}</div><div className="text-gray-400">Prezzo</div></div>
                <div className="text-center"><div className="font-medium">{qs.reputationScore}</div><div className="text-gray-400">Rep.</div></div>
              </div>
              {qs.suggestions.length > 0 && (
                <div className="mt-2 text-xs text-amber-700">
                  {qs.suggestions.map((s, i) => <p key={i}>💡 {s}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Referral Program */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Programma referral</h2>
        </div>
        <div className="mt-4 space-y-3">
          {health.referrals.map((ref) => (
            <div key={ref.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {ref.referrerName} → {ref.referredName || ref.referredEmail || "In attesa"}
                </p>
                <p className="text-xs text-gray-500">Codice: {ref.referralCode}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                ref.status === "rewarded" ? "bg-green-100 text-green-800" :
                ref.status === "listing_published" ? "bg-blue-100 text-blue-800" :
                ref.status === "registered" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-600"
              }`}>
                {ref.status === "rewarded" ? "Premiato" : ref.status === "listing_published" ? "Annuncio pubblicato" : ref.status === "registered" ? "Registrato" : "In attesa"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

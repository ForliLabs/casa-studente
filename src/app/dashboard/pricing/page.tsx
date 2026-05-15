import type { Metadata } from "next";
import { getAllListingsWithPricing } from "@/lib/actions/pricing";
import { priceTrendStore } from "@/lib/stores/pricing";
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing Intelligence",
  description: "Analisi dei prezzi e intelligence di mercato per i tuoi annunci.",
};

const badgeConfig = {
  good_deal: { label: "Buon affare", color: "bg-green-100 text-green-800", icon: TrendingDown },
  fair_price: { label: "Prezzo giusto", color: "bg-blue-100 text-blue-800", icon: Minus },
  above_market: { label: "Sopra mercato", color: "bg-amber-100 text-amber-800", icon: TrendingUp },
};

export default async function PricingDashboardPage() {
  const listings = await getAllListingsWithPricing();
  const trends = await priceTrendStore.findAll();

  const goodDeals = listings.filter((l) => l.priceBadge === "good_deal").length;
  const fairPrice = listings.filter((l) => l.priceBadge === "fair_price").length;
  const aboveMarket = listings.filter((l) => l.priceBadge === "above_market").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Pricing Intelligence
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Analisi dei prezzi di mercato
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Monitora i prezzi degli annunci rispetto al mercato, scopri i trend per zona e ottimizza il tuo canone.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Annunci analizzati</p>
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Buoni affari</p>
              <p className="text-2xl font-bold text-green-700">{goodDeals}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Prezzi giusti</p>
              <p className="text-2xl font-bold text-blue-700">{fairPrice}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sopra mercato</p>
              <p className="text-2xl font-bold text-amber-700">{aboveMarket}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings with pricing badges */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Annunci e prezzi di mercato</h2>
        <p className="mt-1 text-sm text-gray-500">
          Confronto tra prezzo attuale e stima di mercato per ogni annuncio.
        </p>
        <div className="mt-6 space-y-4">
          {listings.map((listing) => {
            const config = badgeConfig[listing.priceBadge as keyof typeof badgeConfig] || badgeConfig.fair_price;
            const BadgeIcon = config.icon;
            const diff = Math.round(((listing.price - listing.estimatedPrice) / listing.estimatedPrice) * 100);
            return (
              <div key={listing.id} className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-500">{listing.zone} · {listing.type} · {listing.size}m²</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">€{listing.price}/mese</p>
                    <p className="text-sm text-gray-500">Stima: €{listing.estimatedPrice}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                    <BadgeIcon className="h-3 w-3" />
                    {config.label}
                    {diff !== 0 && ` (${diff > 0 ? "+" : ""}${diff}%)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Price trends */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Trend dei prezzi per zona</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Andamento dei prezzi mediani negli ultimi 6 mesi.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {["Centro", "Campus", "Stazione", "Cava"].map((zone) => {
            const zoneTrends = trends
              .filter((t) => t.zone === zone)
              .sort((a, b) => a.month.localeCompare(b.month));
            if (zoneTrends.length === 0) return null;
            const first = zoneTrends[0];
            const last = zoneTrends[zoneTrends.length - 1];
            const change = last && first ? Math.round(((last.medianPrice - first.medianPrice) / first.medianPrice) * 100) : 0;

            return (
              <div key={zone} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{zone}</h3>
                  <span className={`text-sm font-medium ${change > 0 ? "text-red-600" : change < 0 ? "text-green-600" : "text-gray-500"}`}>
                    {change > 0 ? "+" : ""}{change}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">{first?.type || "misto"}</p>
                <div className="mt-3 flex items-end gap-1">
                  {zoneTrends.map((t) => (
                    <div key={t.id} className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 rounded-t bg-emerald-400"
                        style={{ height: `${Math.max(20, (t.medianPrice / 10))}px` }}
                        title={`${t.month}: €${t.medianPrice}`}
                      />
                      <span className="text-[10px] text-gray-400">{t.month.split("-")[1]}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Mediana attuale: <span className="font-semibold">€{last?.medianPrice || "N/A"}</span>/mese
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

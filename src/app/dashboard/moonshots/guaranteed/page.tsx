import type { Metadata } from "next";
import { Building2, CircleDollarSign, Shield, TrendingUp } from "lucide-react";
import { getGuaranteedRentDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Guaranteed Rent Engine",
  description:
    "Motore di underwriting per trasformare CasaStudente in operatore che garantisce ricavi ai proprietari.",
};

export default async function GuaranteedRentPage() {
  const dashboard = await getGuaranteedRentDashboard();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Platform as operator
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Guaranteed Rent Engine
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Il marketplace diventa un layer operativo che assorbe il rischio di vacancy, paga un
          canone garantito al proprietario e monetizza lo spread tra domanda prevista e resa reale.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Offers in pilot</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.offers.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Monthly spread</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">€{dashboard.portfolioSpread}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average break-even</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard.averageBreakEven}%</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Payout rail</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">Stripe</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Underwriting board</h2>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.offers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{offer.listingTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">{offer.zone} · {offer.status}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    demand index {offer.demandIndex}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Market rent</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">€{offer.marketRent}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Guaranteed</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">€{offer.guaranteedRent}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Expected spread</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-700">
                      €{offer.simulation.expectedMonthlySpread}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-gray-500">Break-even</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {offer.simulation.breakEvenOccupancy}%
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {offer.simulation.guaranteeCoverage} · annualized spread €{offer.simulation.annualizedSpread}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Risk stack</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Passport-backed tenant confidence reduces default selection risk.</li>
              <li>• Forecasting and pricing stores already provide timing and demand signals.</li>
              <li>• Stripe Connect can settle landlord payouts and student collections on separate rails.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Activation path</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-gray-600">
              <li>1. Underwrite a landlord cohort with 2-5 units per zone.</li>
              <li>2. Build a reserve policy using resilience and insurance data.</li>
              <li>3. Launch automated repricing and vacancy intervention loops.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-5 w-5 text-emerald-700" />
          <div>
            <h2 className="text-lg font-semibold text-emerald-950">Prototype in this repo</h2>
            <p className="mt-2 text-sm text-emerald-900">
              Underwriting models, spread simulation, and API exposure are implemented as a pilot
              surface on top of the existing forecasting and Stripe foundations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

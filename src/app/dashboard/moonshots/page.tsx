import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Orbit, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { getMoonshotPortfolio } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Moonshot Lab",
  description:
    "Moonshot portfolio per trasformare CasaStudente da marketplace locale a infrastruttura abitativa globale.",
};

const innovationVectors = [
  {
    title: "Portable trust",
    description:
      "Identity, payment reliability, and university verification become a reusable asset instead of a per-city reset.",
    icon: ShieldCheck,
  },
  {
    title: "Platform as operator",
    description:
      "The business graduates from referral marketplace to guaranteed-income operating layer.",
    icon: Orbit,
  },
  {
    title: "Urban operating system",
    description:
      "Housing data starts steering mobility, resilience, and public-private supply interventions.",
    icon: Radar,
  },
  {
    title: "Outcome-based living",
    description:
      "Homes are assembled around student outcomes: arrival, wellbeing, careers, and climate continuity.",
    icon: Sparkles,
  },
];

export default async function MoonshotsPage() {
  const portfolio = await getMoonshotPortfolio();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Moonshot Lab
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Da piattaforma locale a infrastruttura abitativa studentesca
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-300">
          Sei prototipi ad alto orizzonte che spostano CasaStudente da marketplace per Forlì a
          trust layer, operating system urbano e motore di resilienza per la mobilità studentesca.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">Feature moonshot</p>
            <p className="mt-2 text-3xl font-bold">6</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">API sperimentali</p>
            <p className="mt-2 text-3xl font-bold">6</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">Tesi strategica</p>
            <p className="mt-2 text-xl font-semibold">CasaStudente as system-of-systems</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Labs read-only
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-950">
          Questo hub rende visibili i moonshot dalla dashboard principale per chi vuole valutare la
          direzione strategica del prodotto. I prototipi restano sperimentali: usali per capire tesi,
          dipendenze e metriche guida, non come flussi operativi quotidiani.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {innovationVectors.map((vector) => {
          const Icon = vector.icon;
          return (
            <div key={vector.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-gray-900">{vector.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{vector.description}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {portfolio.map((feature) => (
          <Link
            key={feature.slug}
            href={feature.route}
            className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                  {feature.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-gray-900">{feature.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {feature.horizon}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{feature.thesis}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {feature.dependencies.length === 0 ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Foundation capability
                </span>
              ) : (
                feature.dependencies.map((dependency) => (
                  <span key={dependency} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    depends on {dependency}
                  </span>
                ))
              )}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
              <span className="font-medium text-gray-700">{feature.indicator}</span>
              <span className="inline-flex items-center gap-2 font-semibold text-cyan-700">
                Apri prototipo
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
        <h2 className="text-lg font-semibold text-cyan-950">Sequenza di costruzione consigliata</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-cyan-900">
          {[
            "Passport",
            "Arrival OS",
            "Guaranteed Rent",
            "Digital Twin",
            "Intentional Pods",
            "Resilience Grid",
          ].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 font-medium shadow-sm">{step}</span>
              {index < 5 && <ArrowRight className="h-4 w-4 text-cyan-500" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

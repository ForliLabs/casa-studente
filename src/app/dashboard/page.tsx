import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard";
import { dashboardStats, recentActivity } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panoramica annunci, richieste e attività recenti dei proprietari su CasaStudente.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Dashboard proprietario
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Tieni sotto controllo annunci, richieste e performance
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Una vista unica per monitorare gli annunci attivi, leggere i messaggi degli studenti e capire quali alloggi stanno performando meglio.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]" id="analytics">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Attività recenti</h2>
              <p className="mt-1 text-sm text-gray-500">
                Aggiornamenti in tempo reale sugli annunci e sui contatti ricevuti.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{activity.description}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Checklist rapida</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Aggiorna le disponibilità prima dell’inizio semestre.</li>
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Rispondi ai nuovi messaggi entro 2 ore per migliorare il ranking.</li>
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />Aggiungi un tour virtuale agli annunci con più visite.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Insight del mese
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Le stanze verificate ricevono il 34% di contatti in più</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Mantieni foto aggiornate, disponibilità coerenti e tempi di risposta rapidi per restare tra gli annunci più visti a Forlì.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

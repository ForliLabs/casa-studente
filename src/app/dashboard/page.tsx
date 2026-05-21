import type { Metadata } from "next";
import Link from "next/link";
import { Orbit } from "lucide-react";
import { StatCard } from "@/components/dashboard";
import { requireAuth } from "@/lib/auth";
import { getDashboardStats, getRecentActivity, getStudentQuickActionCounts } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panoramica annunci, richieste e attività recenti dei proprietari su CasaStudente.",
};

export default async function DashboardPage() {
  const user = await requireAuth();

  const isLandlord = user?.role === "landlord" || user?.role === "admin";

  const [stats, activity, quickCounts] = await Promise.all([
    getDashboardStats(user),
    getRecentActivity(user),
    isLandlord ? Promise.resolve(null) : getStudentQuickActionCounts(user),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          {isLandlord ? "Dashboard proprietario" : "Dashboard studente"}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {isLandlord
            ? "Tieni sotto controllo annunci, richieste e performance"
            : "La tua panoramica su CasaStudente"}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          {isLandlord
            ? "Una vista unica per monitorare gli annunci attivi, leggere i messaggi degli studenti e capire quali alloggi stanno performando meglio."
            : "Gestisci la tua ricerca casa: messaggi con i proprietari, preferiti, pagamenti e prossimi passi."}
        </p>
      </section>

      {/* Student quick-action row — visible only to students */}
      {!isLandlord && (
        <section aria-labelledby="student-actions-heading">
          <h2 id="student-actions-heading" className="sr-only">Azioni rapide per studenti</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Link
              href="/listings"
              className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <span className="text-2xl" aria-hidden="true">🔍</span>
              <span>Cerca un alloggio</span>
            </Link>
            {/* Per Te — personalised recommendations entry point */}
            <Link
              href="/dashboard/for-you"
              className="flex items-center gap-4 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <span className="text-2xl" aria-hidden="true">✨</span>
              <span>Annunci per te</span>
            </Link>
            <Link
              href="/dashboard/messages"
              className={[
                "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-sm font-semibold transition",
                quickCounts && quickCounts.unreadMessages > 0
                  ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <span className="flex items-center gap-4">
                <span className="text-2xl" aria-hidden="true">💬</span>
                <span>I miei messaggi</span>
              </span>
              {quickCounts && quickCounts.unreadMessages > 0 && (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                  {quickCounts.unreadMessages}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/tours"
              className={[
                "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-sm font-semibold transition",
                quickCounts && quickCounts.pendingTours > 0
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <span className="flex items-center gap-4">
                <span className="text-2xl" aria-hidden="true">📅</span>
                <span>Tour prenotati</span>
              </span>
              {quickCounts && quickCounts.pendingTours > 0 && (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                  {quickCounts.pendingTours}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/payments"
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <span className="text-2xl" aria-hidden="true">💶</span>
              <span>I miei pagamenti</span>
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="stats-heading" className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <h2 id="stats-heading" className="sr-only">Statistiche principali</h2>
        {stats.map((stat) => (
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
            {activity.length > 0 ? activity.map((item) => (
              <div key={item.id} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                    {item.time}
                  </span>
                </div>
              </div>
            )) : (
              <p className="py-8 text-center text-sm text-gray-500">
                Nessuna attività recente. Le nuove interazioni appariranno qui.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLandlord ? "Checklist rapida" : "Prossimi passi"}
            </h2>
            {isLandlord ? (
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />Aggiorna le disponibilità prima dell&apos;inizio semestre.</li>
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />Rispondi ai nuovi messaggi entro 2 ore per migliorare il ranking.</li>
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />Aggiungi un tour virtuale agli annunci con più visite.</li>
              </ul>
            ) : (
              <ol className="mt-4 space-y-3 text-sm text-gray-600" aria-label="Checklist ricerca casa">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                  <span><Link href="/listings" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">Sfoglia gli annunci</Link> e salva i preferiti con il cuore.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                  <span>Contatta il proprietario o <Link href="/dashboard/tours" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">prenota un tour</Link> per gli annunci di interesse.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
                  <span>Monitora i <Link href="/dashboard/messages" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">messaggi</Link> — i proprietari rispondono spesso entro 24 h.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
                  <span>Completa il pagamento del deposito con i <Link href="/dashboard/payments" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">pagamenti sicuri</Link>.</span>
                </li>
              </ol>
            )}
          </div>
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                <Orbit className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Labs & strategia
                </p>
                <h2 className="mt-2 text-xl font-semibold text-cyan-950">Moonshots hub</h2>
                <p className="mt-3 text-sm leading-6 text-cyan-900">
                  Esplora i prototipi di lungo periodo in modalità read-only: housing passport,
                  guaranteed rent, arrival OS e gli altri esperimenti che raccontano dove può
                  evolvere CasaStudente.
                </p>
                <Link
                  href="/dashboard/moonshots"
                  className="mt-4 inline-flex rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Apri il Moonshots hub
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              {isLandlord ? "Insight del mese" : "Consiglio della settimana"}
            </p>
            {isLandlord ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold">Le stanze verificate ricevono il 34% di contatti in più</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Mantieni foto aggiornate, disponibilità coerenti e tempi di risposta rapidi per restare tra gli annunci più visti a Forlì.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-2xl font-semibold">Rispondi velocemente per aumentare le chance</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  I proprietari tendono a preferire studenti reattivi. Attiva le notifiche per non perdere nessun aggiornamento.
                </p>
                <Link
                  href="/dashboard/messages"
                  className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Vai ai messaggi →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

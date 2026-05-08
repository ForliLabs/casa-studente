import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Supporto</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Contatti</h1>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Team CasaStudente</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">Per supporto su annunci, onboarding, pagamenti o verifiche universitarie scrivici e ti risponderemo il prima possibile.</p>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p><strong>Email:</strong> support@casastudente.it</p>
                <p><strong>Telefono:</strong> +39 0543 000000</p>
                <p><strong>Orari:</strong> Lun–Ven · 9:00–18:00</p>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Hai già un account?</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">Per gestire richieste, notifiche o conversazioni usa direttamente la tua dashboard.</p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Apri la dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

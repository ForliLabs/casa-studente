export default function TermsPage() {
  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Condizioni</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Termini di utilizzo</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
            <p>Gli utenti devono fornire informazioni corrette sugli annunci, usare la piattaforma in buona fede e rispettare le regole della community.</p>
            <p>CasaStudente può limitare o sospendere account che pubblicano contenuti falsi, offensivi o contrari alle norme della piattaforma.</p>
            <p>I pagamenti, le verifiche e i documenti restano soggetti ai controlli previsti dai singoli flussi applicativi.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

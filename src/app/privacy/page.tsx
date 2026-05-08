export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Informativa</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Privacy</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-gray-600">
            <p>CasaStudente tratta i dati necessari per autenticazione, ricerca alloggi, messaggistica, pagamenti e verifiche universitarie.</p>
            <p>I dati vengono usati solo per erogare il servizio, prevenire abusi, inviare notifiche pertinenti e rispettare gli obblighi legali applicabili.</p>
            <p>Per richieste su accesso, correzione o cancellazione dei dati puoi scrivere tramite la pagina Contatti.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

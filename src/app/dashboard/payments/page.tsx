import type { Metadata } from "next";
import { paymentStore, leaseStore } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Pagamenti",
  description: "Storico pagamenti e contratti digitali su CasaStudente.",
};

const statusLabels: Record<string, string> = {
  completed: "Completato",
  pending: "In attesa",
  failed: "Fallito",
  refunded: "Rimborsato",
};

const statusColors: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-blue-50 text-blue-700",
};

const typeLabels: Record<string, string> = {
  rent: "Canone mensile",
  deposit: "Deposito cauzionale",
  deposit_return: "Restituzione deposito",
};

const leaseStatusLabels: Record<string, string> = {
  draft: "Bozza",
  pending_signature: "In attesa di firma",
  active: "Attivo",
  expired: "Scaduto",
};

const leaseStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_signature: "bg-amber-50 text-amber-700",
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-red-50 text-red-700",
};

export default async function DashboardPaymentsPage() {
  const payments = await paymentStore.findAll();
  const leases = await leaseStore.findAll();

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.platformFee, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Pagamenti e contratti
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Gestione finanziaria
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600">
          Visualizza lo storico dei pagamenti, le ricevute e i contratti digitali.
        </p>
      </section>

      {/* Summary cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Totale pagato</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">€{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Commissioni piattaforma</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">€{totalFees.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">5% sul totale</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Contratti attivi</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {leases.filter((l) => l.status === "active").length}
          </p>
        </div>
      </div>

      {/* Payments table */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Storico pagamenti</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Ricevuta</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Annuncio</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Importo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Stato</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.receiptNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{typeLabels[payment.type]}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.listingTitle}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[payment.status]}`}>
                      {statusLabels[payment.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString("it-IT")}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Nessun pagamento registrato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Leases section */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Contratti digitali</h2>
          <p className="mt-1 text-sm text-gray-500">
            Contratti tipo <em>contratto transitorio</em> con regime fiscale <em>cedolare secca</em>.
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {leases.map((lease) => (
            <div key={lease.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{lease.listingTitle}</h3>
                  <p className="mt-1 text-sm text-gray-500">{lease.address}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>Inquilino: {lease.tenantName}</span>
                    <span>·</span>
                    <span>Proprietario: {lease.landlordName}</span>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${leaseStatusColors[lease.status]}`}>
                  {leaseStatusLabels[lease.status]}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Canone</p>
                  <p className="font-semibold text-gray-900">€{lease.monthlyRent}/mese</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Deposito</p>
                  <p className="font-semibold text-gray-900">€{lease.deposit}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Periodo</p>
                  <p className="font-semibold text-gray-900">{lease.startDate} → {lease.endDate}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Tipo contratto</p>
                  <p className="font-semibold text-gray-900 capitalize">{lease.contractType}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Scarica PDF
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Report cedolare secca
                </button>
              </div>
            </div>
          ))}
          {leases.length === 0 && (
            <div className="p-12 text-center text-sm text-gray-500">
              Nessun contratto attivo.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { getAdminStats, getConversionFunnel } from "@/lib/actions/admin";
import { AlertTriangle, FileText, Home, TrendingUp, Users } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const funnel = await getConversionFunnel();

  const cards = [
    { label: "Utenti totali", value: stats.totalUsers, icon: <Users className="h-6 w-6 text-blue-600" />, color: "bg-blue-50" },
    { label: "Annunci attivi", value: stats.activeListings, icon: <Home className="h-6 w-6 text-green-600" />, color: "bg-green-50" },
    { label: "Verifiche in attesa", value: stats.pendingVerifications, icon: <AlertTriangle className="h-6 w-6 text-amber-600" />, color: "bg-amber-50" },
    { label: "Recensioni segnalate", value: stats.flaggedReviews, icon: <AlertTriangle className="h-6 w-6 text-red-600" />, color: "bg-red-50" },
    { label: "Percorsi attivi", value: stats.activeJourneys, icon: <TrendingUp className="h-6 w-6 text-purple-600" />, color: "bg-purple-50" },
    { label: "Recensioni totali", value: stats.totalReviews, icon: <FileText className="h-6 w-6 text-gray-600" />, color: "bg-gray-50" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Pannello Amministrazione</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl ${card.color} p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Funnel Conversione</h2>
          <div className="space-y-3">
            {funnel.map((step) => {
              const maxCount = funnel[0]?.count || 1;
              const pct = Math.round((step.count / maxCount) * 100);
              return (
                <div key={step.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{step.stage}</span>
                    <span className="font-medium text-gray-900">{step.count} ({pct}%)</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Riepilogo Piattaforma</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Studenti registrati</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.students}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Proprietari registrati</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.landlords}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Annunci totali</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.totalListings}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Percorsi totali</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.totalJourneys}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Tasso verifica</dt>
              <dd className="text-sm font-medium text-gray-900">
                {stats.totalUsers > 0 ? Math.round(((stats.totalUsers - stats.pendingVerifications) / stats.totalUsers) * 100) : 0}%
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

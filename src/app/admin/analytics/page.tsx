import { getAdminStats, getConversionFunnel } from "@/lib/actions/admin";
import { userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { paymentStore } from "@/lib/stores";

export default async function AnalyticsPage() {
  const stats = await getAdminStats();
  const funnel = await getConversionFunnel();
  const users = await userStore.findAll();
  const listings = await listingStore.findAll();
  const payments = await paymentStore.findAll();

  // Revenue calculations
  const completedPayments = payments.filter((p) => p.status === "completed");
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const platformFees = completedPayments.reduce((sum, p) => sum + p.platformFee, 0);

  // Listing distribution by zone
  const zoneDistribution = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.zone] = (acc[l.zone] || 0) + 1;
    return acc;
  }, {});

  // Listing distribution by type
  const typeDistribution = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.type] = (acc[l.type] || 0) + 1;
    return acc;
  }, {});

  // Price stats
  const prices = listings.map((l) => l.price);
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Analytics</h1>

      {/* Revenue */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Transazioni totali</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">€{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Fee piattaforma</p>
          <p className="mt-1 text-3xl font-bold text-green-600">€{platformFees.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Pagamenti completati</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{completedPayments.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Zone Distribution */}
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Annunci per Zona</h2>
          <div className="space-y-3">
            {Object.entries(zoneDistribution).sort(([, a], [, b]) => b - a).map(([zone, count]) => (
              <div key={zone} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{zone}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(count / listings.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Annunci per Tipo</h2>
          <div className="space-y-3">
            {Object.entries(typeDistribution).sort(([, a], [, b]) => b - a).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-700">{type}</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Analysis */}
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Analisi Prezzi</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Prezzo medio</dt>
              <dd className="text-sm font-medium text-gray-900">€{avgPrice}/mese</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Prezzo minimo</dt>
              <dd className="text-sm font-medium text-gray-900">€{minPrice}/mese</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Prezzo massimo</dt>
              <dd className="text-sm font-medium text-gray-900">€{maxPrice}/mese</dd>
            </div>
          </dl>
        </div>

        {/* User Growth */}
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Crescita Utenti</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Studenti</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.students}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Proprietari</dt>
              <dd className="text-sm font-medium text-gray-900">{stats.landlords}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-sm text-gray-600">Utenti verificati</dt>
              <dd className="text-sm font-medium text-gray-900">
                {users.filter((u) => u.verified).length} ({Math.round((users.filter((u) => u.verified).length / users.length) * 100)}%)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Profili completi</dt>
              <dd className="text-sm font-medium text-gray-900">
                {users.filter((u) => u.profileComplete).length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

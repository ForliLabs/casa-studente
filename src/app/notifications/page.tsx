import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notificationStore, savedSearchStore } from "@/lib/stores";
import { getCurrentUser } from "@/lib/auth";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteSavedSearchAction,
} from "@/lib/actions/notifications";

export const metadata: Metadata = {
  title: "Notifiche",
  description: "Le tue notifiche e ricerche salvate su CasaStudente.",
};

const typeIcons: Record<string, string> = {
  new_listing: "🏠",
  message: "💬",
  payment: "💳",
  review: "⭐",
  availability: "📋",
  system: "🔔",
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const notifications = await notificationStore.filter((n) => n.userId === user.id);
  const savedSearches = await savedSearchStore.filter((s) => s.userId === user.id);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Centro notifiche
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Notifiche e avvisi
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {unreadCount > 0
                ? `Hai ${unreadCount} notifiche non lette`
                : "Tutte le notifiche sono state lette"}
            </p>
          </div>
          {unreadCount > 0 && (
            <form action={markAllNotificationsReadAction}>
              <button
                type="submit"
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Segna tutte come lette
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {notifications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-4 shadow-sm transition ${
                  notification.read
                    ? "border-gray-200 bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{typeIcons[notification.type] || "🔔"}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className={`text-sm font-semibold ${notification.read ? "text-gray-900" : "text-blue-900"}`}>
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-400">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-3">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Vedi dettaglio →
                        </Link>
                      )}
                      {!notification.read && (
                        <form action={markNotificationReadAction}>
                          <input type="hidden" name="notificationId" value={notification.id} />
                          <button type="submit" className="text-xs font-medium text-gray-500 hover:text-gray-700">
                            Segna come letta
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {notifications.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-900">Nessuna notifica</p>
              <p className="mt-2 text-sm text-gray-500">
                Le notifiche appariranno qui quando ci saranno aggiornamenti.
              </p>
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Ricerche salvate</h2>
          <p className="mt-2 text-sm text-gray-500">
            Ricevi avvisi quando nuovi annunci corrispondono ai tuoi criteri.
          </p>

          <div className="mt-6 space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{search.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    {search.criteria.zone && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">Zona: {search.criteria.zone}</span>
                    )}
                    {search.criteria.minPrice && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">Min: €{search.criteria.minPrice}</span>
                    )}
                    {search.criteria.maxPrice && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">Max: €{search.criteria.maxPrice}</span>
                    )}
                    {search.criteria.type && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">{search.criteria.type}</span>
                    )}
                    {search.criteria.verifiedOnly && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Solo verificati</span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-3 text-xs text-gray-400">
                    {search.notifyEmail && <span>📧 Notifiche email</span>}
                    {search.notifyInApp && <span>🔔 Notifiche in-app</span>}
                  </div>
                </div>
                <form action={deleteSavedSearchAction}>
                  <input type="hidden" name="searchId" value={search.id} />
                  <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-700">
                    Elimina
                  </button>
                </form>
              </div>
            ))}

            {savedSearches.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">
                  Nessuna ricerca salvata. Vai alla pagina{" "}
                  <Link href="/listings" className="font-medium text-blue-600 hover:text-blue-700">
                    annunci
                  </Link>{" "}
                  per salvare i tuoi criteri di ricerca.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Ora";
  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays < 7) return `${diffDays} giorni fa`;
  return new Date(dateStr).toLocaleDateString("it-IT");
}

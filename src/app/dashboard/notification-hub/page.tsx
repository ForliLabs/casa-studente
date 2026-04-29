import type { Metadata } from "next";
import { getNotificationHub } from "@/lib/actions/notification-hub";
import { Bell, MessageSquare, Home, CreditCard, Calendar, Star, AlertTriangle, Settings, Moon, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Centro Notifiche",
  description: "Gestisci tutte le notifiche e preferenze di comunicazione.",
};

const typeConfig: Record<string, { label: string; icon: typeof Bell; color: string }> = {
  new_message: { label: "Messaggi", icon: MessageSquare, color: "text-blue-600 bg-blue-100" },
  journey_update: { label: "Percorso", icon: Home, color: "text-green-600 bg-green-100" },
  new_listing_match: { label: "Annunci", icon: Home, color: "text-purple-600 bg-purple-100" },
  price_drop: { label: "Prezzo", icon: CreditCard, color: "text-emerald-600 bg-emerald-100" },
  tour_reminder: { label: "Tour", icon: Calendar, color: "text-teal-600 bg-teal-100" },
  payment_due: { label: "Pagamenti", icon: CreditCard, color: "text-red-600 bg-red-100" },
  review_request: { label: "Recensioni", icon: Star, color: "text-amber-600 bg-amber-100" },
  calendar_reminder: { label: "Calendario", icon: Calendar, color: "text-indigo-600 bg-indigo-100" },
  document_expiry: { label: "Documenti", icon: AlertTriangle, color: "text-orange-600 bg-orange-100" },
  system_announcement: { label: "Sistema", icon: Bell, color: "text-gray-600 bg-gray-100" },
};

const priorityConfig = {
  urgent: { label: "Urgente", color: "bg-red-100 text-red-800" },
  normal: { label: "Normale", color: "bg-gray-100 text-gray-600" },
  low: { label: "Bassa", color: "bg-gray-50 text-gray-400" },
};

export default async function NotificationHubPage() {
  const hub = await getNotificationHub();

  if (!hub) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
        <Bell className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Accedi per vedere le notifiche</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-orange-600" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Centro Notifiche</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tutte le tue notifiche
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Centro unificato per messaggi, aggiornamenti del percorso, nuovi annunci e pagamenti.
          Configura i canali di notifica e le ore di silenzio.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-orange-600">{hub.unreadCount}</p>
          <p className="mt-1 text-sm text-gray-500">Non lette</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-red-600">{hub.urgentCount}</p>
          <p className="mt-1 text-sm text-gray-500">Urgenti</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-600">{hub.notifications.length}</p>
          <p className="mt-1 text-sm text-gray-500">Totali</p>
        </div>
      </section>

      {/* Notification list */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Notifiche recenti</h2>
          <form action={async () => { "use server"; const { markAllHubNotificationsReadAction } = await import("@/lib/actions/notification-hub"); await markAllHubNotificationsReadAction(); }}>
            <button type="submit" className="text-sm text-blue-600 hover:text-blue-700">
              Segna tutte come lette
            </button>
          </form>
        </div>
        <div className="mt-4 space-y-3">
          {hub.notifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.system_announcement;
            const Icon = config.icon;
            const priority = priorityConfig[notif.priority];
            return (
              <div
                key={notif.id}
                className={`rounded-2xl border p-4 transition-colors ${notif.read ? "border-gray-100 bg-gray-50" : "border-orange-200 bg-orange-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                        {notif.title}
                      </h3>
                      {notif.priority === "urgent" && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priority.color}`}>
                          {priority.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{notif.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>{new Date(notif.createdAt).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}</span>
                      <span>•</span>
                      <span>{notif.channels.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Preferenze canali</h2>
          </div>
          <div className="mt-4 space-y-3">
            {hub.preferences.map((pref) => {
              const config = typeConfig[pref.type] || typeConfig.system_announcement;
              return (
                <div key={pref.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  <div className="flex gap-1">
                    {pref.channels.map((ch) => (
                      <span key={ch} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                        {ch === "in_app" ? "App" : ch === "email" ? "Email" : ch === "push" ? "Push" : "WhatsApp"}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Ore di silenzio</h2>
            </div>
            {hub.quietHours ? (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  {hub.quietHours.enabled ? "✅ Attive" : "❌ Disattivate"}: {hub.quietHours.startTime} — {hub.quietHours.endTime}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Durante le ore di silenzio riceverai solo notifiche urgenti in-app.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Non configurate</p>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Digest email</h2>
            </div>
            {hub.digestConfig ? (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Frequenza: <span className="font-medium">{hub.digestConfig.frequency === "weekly" ? "Settimanale" : hub.digestConfig.frequency === "daily" ? "Giornaliero" : "Disattivato"}</span>
                </p>
                {hub.digestConfig.lastSentAt && (
                  <p className="mt-1 text-xs text-gray-500">
                    Ultimo invio: {new Date(hub.digestConfig.lastSentAt).toLocaleDateString("it-IT")}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Non configurato</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

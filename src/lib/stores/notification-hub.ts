import { InMemoryStore } from "@/lib/db";

// ============ SMART NOTIFICATION HUB ============

export type NotificationChannel = "in_app" | "email" | "push" | "whatsapp";
export type NotificationPriority = "urgent" | "normal" | "low";

export type NotificationEventType =
  | "new_message"
  | "journey_update"
  | "new_listing_match"
  | "price_drop"
  | "tour_reminder"
  | "payment_due"
  | "review_request"
  | "calendar_reminder"
  | "document_expiry"
  | "system_announcement";

export interface NotificationEvent {
  id: string;
  userId: string;
  type: NotificationEventType;
  title: string;
  body: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  deliveryStatus: Record<NotificationChannel, "pending" | "sent" | "delivered" | "failed">;
  read: boolean;
  link?: string;
  groupKey?: string; // For batching related notifications
  metadata: Record<string, string>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationEventType;
  channels: NotificationChannel[];
  enabled: boolean;
}

export interface QuietHours {
  id: string;
  userId: string;
  startTime: string; // "22:00"
  endTime: string;   // "08:00"
  enabled: boolean;
}

export interface DigestConfig {
  id: string;
  userId: string;
  frequency: "daily" | "weekly" | "none";
  lastSentAt?: string;
  nextSendAt?: string;
}

export const notificationEventStore = new InMemoryStore<NotificationEvent>();
export const notificationPrefStore = new InMemoryStore<NotificationPreference>();
export const quietHoursStore = new InMemoryStore<QuietHours>();
export const digestConfigStore = new InMemoryStore<DigestConfig>();

// Seed notification events
notificationEventStore.seed([
  {
    id: "ne-1",
    userId: "user-student-1",
    type: "new_message",
    title: "Nuovo messaggio da Elena Rossi",
    body: "Certamente! Posso inviarti il link per il tour alle 17:30.",
    priority: "normal",
    channels: ["in_app", "push"],
    deliveryStatus: { in_app: "delivered", push: "delivered", email: "pending", whatsapp: "pending" },
    read: false,
    link: "/dashboard/messages",
    groupKey: "messages_user-student-1",
    metadata: { senderId: "user-landlord-1", conversationId: "conv-1" },
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "ne-2",
    userId: "user-student-1",
    type: "new_listing_match",
    title: "Nuovo annuncio compatibile",
    body: "Un monolocale in Centro a €580/mese corrisponde alla tua ricerca. Match: 87%.",
    priority: "normal",
    channels: ["in_app", "email"],
    deliveryStatus: { in_app: "delivered", email: "sent", push: "pending", whatsapp: "pending" },
    read: false,
    link: "/listings/via-giorgio-regnoli-33-monolocale",
    metadata: { listingId: "via-giorgio-regnoli-33-monolocale", matchScore: "87" },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "ne-3",
    userId: "user-student-1",
    type: "payment_due",
    title: "Pagamento affitto in scadenza",
    body: "Il canone di Agosto 2026 (€360) per Via Cristoforo Colombo 21 è in scadenza tra 5 giorni.",
    priority: "urgent",
    channels: ["in_app", "push", "email"],
    deliveryStatus: { in_app: "delivered", push: "sent", email: "sent", whatsapp: "pending" },
    read: true,
    link: "/dashboard/payments",
    metadata: { amount: "360", dueDate: "2026-08-01" },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    readAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ne-4",
    userId: "user-landlord-1",
    type: "journey_update",
    title: "Nuovo contatto ricevuto",
    body: "Anna Petrova è interessata al tuo annuncio Via Cristoforo Colombo 21.",
    priority: "normal",
    channels: ["in_app", "push", "whatsapp"],
    deliveryStatus: { in_app: "delivered", push: "delivered", whatsapp: "sent", email: "pending" },
    read: false,
    link: "/dashboard/journey",
    metadata: { studentId: "user-student-3", listingId: "via-colombo-21-singola" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "ne-5",
    userId: "user-student-2",
    type: "tour_reminder",
    title: "Tour domani alle 10:00",
    body: "Ricordati del tour di persona per Viale Roma 48 domani alle 10:00. Citofonare Guidi.",
    priority: "urgent",
    channels: ["in_app", "push", "whatsapp"],
    deliveryStatus: { in_app: "delivered", push: "sent", whatsapp: "delivered", email: "pending" },
    read: false,
    link: "/dashboard/tours",
    metadata: { tourId: "tour-2" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]);

// Seed preferences
notificationPrefStore.seed([
  { id: "pref-1", userId: "user-student-1", type: "new_message", channels: ["in_app", "push"], enabled: true },
  { id: "pref-2", userId: "user-student-1", type: "new_listing_match", channels: ["in_app", "email"], enabled: true },
  { id: "pref-3", userId: "user-student-1", type: "payment_due", channels: ["in_app", "push", "email"], enabled: true },
  { id: "pref-4", userId: "user-student-1", type: "price_drop", channels: ["in_app"], enabled: true },
  { id: "pref-5", userId: "user-student-1", type: "tour_reminder", channels: ["in_app", "push"], enabled: true },
]);

// Seed quiet hours
quietHoursStore.seed([
  { id: "qh-1", userId: "user-student-1", startTime: "22:00", endTime: "08:00", enabled: true },
]);

// Seed digest config
digestConfigStore.seed([
  { id: "dc-1", userId: "user-student-1", frequency: "weekly", lastSentAt: new Date(Date.now() - 7 * 86400000).toISOString() },
]);

// Unified notify function
export async function notify(params: {
  userId: string;
  type: NotificationEventType;
  title: string;
  body: string;
  priority?: NotificationPriority;
  link?: string;
  groupKey?: string;
  metadata?: Record<string, string>;
}): Promise<NotificationEvent> {
  const { userId, type, title, body, priority = "normal", link, groupKey, metadata = {} } = params;

  // Check quiet hours
  const quietHours = await quietHoursStore.filter((qh) => qh.userId === userId && qh.enabled);
  const isQuietTime = quietHours.length > 0 && isInQuietHours(quietHours[0]);

  // Get user channel preferences
  const prefs = await notificationPrefStore.filter((p) => p.userId === userId && p.type === type);
  let channels: NotificationChannel[] = prefs.length > 0 ? prefs[0].channels : ["in_app"];

  // Respect quiet hours: only in_app during quiet time
  if (isQuietTime && priority !== "urgent") {
    channels = ["in_app"];
  }

  // Deduplicate: merge if same groupKey within 5 minutes
  if (groupKey) {
    const recent = await notificationEventStore.filter(
      (n) => n.userId === userId && n.groupKey === groupKey &&
        new Date(n.createdAt).getTime() > Date.now() - 5 * 60 * 1000
    );
    if (recent.length > 0) {
      // Update existing instead of creating new
      const updated = await notificationEventStore.update(recent[0].id, {
        title,
        body: `${body} (+${recent.length} aggiornamenti)`,
      });
      return updated!;
    }
  }

  const event: NotificationEvent = {
    id: `ne-${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    title,
    body,
    priority,
    channels,
    deliveryStatus: {
      in_app: channels.includes("in_app") ? "delivered" : "pending",
      email: channels.includes("email") ? "sent" : "pending",
      push: channels.includes("push") ? "sent" : "pending",
      whatsapp: channels.includes("whatsapp") ? "sent" : "pending",
    },
    read: false,
    link,
    groupKey,
    metadata,
    createdAt: new Date().toISOString(),
  };

  await notificationEventStore.create(event);
  return event;
}

function isInQuietHours(qh: QuietHours): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startH, startM] = qh.startTime.split(":").map(Number);
  const [endH, endM] = qh.endTime.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  if (start > end) {
    // Spans midnight
    return currentTime >= start || currentTime < end;
  }
  return currentTime >= start && currentTime < end;
}

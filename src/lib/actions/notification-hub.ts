"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  notificationEventStore,
  notificationPrefStore,
  quietHoursStore,
  digestConfigStore,
  notify,
  type NotificationEvent,
  type NotificationEventType,
  type NotificationChannel,
} from "@/lib/stores/notification-hub";

export async function getNotificationHub() {
  const user = await getCurrentUser();
  if (!user) return null;

  const allEvents = await notificationEventStore.filter((n) => n.userId === user.id);
  const sorted = allEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = sorted.filter((n) => !n.read).length;
  const urgentCount = sorted.filter((n) => !n.read && n.priority === "urgent").length;

  // Group by type
  const byType: Record<string, NotificationEvent[]> = {};
  sorted.forEach((n) => {
    if (!byType[n.type]) byType[n.type] = [];
    byType[n.type].push(n);
  });

  // Get preferences
  const prefs = await notificationPrefStore.filter((p) => p.userId === user.id);
  const quietHours = await quietHoursStore.filter((qh) => qh.userId === user.id);
  const digestConfig = await digestConfigStore.filter((dc) => dc.userId === user.id);

  return {
    notifications: sorted.slice(0, 50),
    unreadCount,
    urgentCount,
    byType,
    preferences: prefs,
    quietHours: quietHours[0] || null,
    digestConfig: digestConfig[0] || null,
  };
}

export async function markNotificationHubReadAction(formData: FormData) {
  const notificationId = formData.get("notificationId") as string;
  if (!notificationId) return;

  await notificationEventStore.update(notificationId, {
    read: true,
    readAt: new Date().toISOString(),
  });
  revalidatePath("/dashboard/notification-hub");
}

export async function markAllHubNotificationsReadAction() {
  const user = await getCurrentUser();
  if (!user) return;

  const unread = await notificationEventStore.filter(
    (n) => n.userId === user.id && !n.read
  );
  for (const n of unread) {
    await notificationEventStore.update(n.id, {
      read: true,
      readAt: new Date().toISOString(),
    });
  }
  revalidatePath("/dashboard/notification-hub");
}

export async function updateNotificationPreferenceAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const type = formData.get("type") as NotificationEventType;
  const channelsRaw = formData.get("channels") as string;
  const enabled = formData.get("enabled") === "true";
  const channels: NotificationChannel[] = channelsRaw ? (channelsRaw.split(",") as NotificationChannel[]) : ["in_app"];

  const existing = await notificationPrefStore.filter(
    (p) => p.userId === user.id && p.type === type
  );

  if (existing.length > 0) {
    await notificationPrefStore.update(existing[0].id, { channels, enabled });
  } else {
    await notificationPrefStore.create({
      id: `pref-${Date.now().toString(36)}`,
      userId: user.id,
      type,
      channels,
      enabled,
    });
  }

  revalidatePath("/dashboard/notification-hub");
}

export async function updateQuietHoursAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const startTime = formData.get("startTime") as string || "22:00";
  const endTime = formData.get("endTime") as string || "08:00";
  const enabled = formData.get("enabled") === "true";

  const existing = await quietHoursStore.filter((qh) => qh.userId === user.id);

  if (existing.length > 0) {
    await quietHoursStore.update(existing[0].id, { startTime, endTime, enabled });
  } else {
    await quietHoursStore.create({
      id: `qh-${Date.now().toString(36)}`,
      userId: user.id,
      startTime,
      endTime,
      enabled,
    });
  }

  revalidatePath("/dashboard/notification-hub");
}

export async function sendTestNotification() {
  const user = await getCurrentUser();
  if (!user) return;

  await notify({
    userId: user.id,
    type: "system_announcement",
    title: "Notifica di test",
    body: "Questa è una notifica di prova dal sistema CasaStudente.",
    priority: "normal",
    link: "/dashboard/notification-hub",
  });

  revalidatePath("/dashboard/notification-hub");
}

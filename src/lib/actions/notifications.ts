"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  notificationStore,
  savedSearchStore,
  type Notification,
  type SavedSearch,
} from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const notificationId = formData.get("notificationId") as string;
  if (!notificationId) return;

  const notification = await notificationStore.findById(notificationId);
  if (!notification || notification.userId !== user.id) return;

  await notificationStore.update(notificationId, { read: true });
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const notifications = await notificationStore.filter(
    (n) => n.userId === user.id && !n.read
  );
  for (const notif of notifications) {
    await notificationStore.update(notif.id, { read: true });
  }
  revalidatePath("/notifications");
}

export async function saveSearchAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per salvare una ricerca" };
  }

  const name = formData.get("name") as string;
  const zone = formData.get("zone") as string;
  const minPrice = formData.get("minPrice") ? Number(formData.get("minPrice")) : undefined;
  const maxPrice = formData.get("maxPrice") ? Number(formData.get("maxPrice")) : undefined;
  const type = formData.get("type") as string;
  const verifiedOnly = formData.get("verifiedOnly") === "on";
  const notifyEmail = formData.get("notifyEmail") === "on";

  const search: SavedSearch = {
    id: `search-${generateId()}`,
    userId: user.id,
    name: name || "Ricerca salvata",
    criteria: {
      zone: zone || undefined,
      minPrice,
      maxPrice,
      type: type || undefined,
      verifiedOnly: verifiedOnly || undefined,
    },
    notifyEmail: notifyEmail,
    notifyInApp: true,
    createdAt: new Date().toISOString(),
  };

  await savedSearchStore.create(search);
  revalidatePath("/notifications");
  return { success: true };
}

export async function deleteSavedSearchAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const searchId = formData.get("searchId") as string;
  if (!searchId) return;

  const search = await savedSearchStore.findById(searchId);
  if (!search || search.userId !== user.id) return;

  await savedSearchStore.delete(searchId);
  revalidatePath("/notifications");
}

export async function createNotification(
  userId: string,
  type: Notification["type"],
  title: string,
  message: string,
  link?: string
) {
  const notification: Notification = {
    id: `notif-${generateId()}`,
    userId,
    type,
    title,
    message,
    read: false,
    link,
    createdAt: new Date().toISOString(),
  };

  await notificationStore.create(notification);
}

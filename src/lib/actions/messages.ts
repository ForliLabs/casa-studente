"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createNotification } from "@/lib/actions/notifications";
import { getCurrentUser, userStore } from "@/lib/auth";
import { emitEvent } from "@/lib/stores/analytics";
import { sendInquiryNotification } from "@/lib/services/email";
import { contactFormSchema, sendMessageSchema } from "@/lib/validation";
import {
  conversationStore,
  messageStore,
  type Conversation,
  type Message,
} from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const startConversationSchema = z.object({
  listingId: z.string().min(1),
  listingTitle: z.string().min(1).max(200),
  recipientId: z.string().optional(),
  recipientName: z.string().min(1).max(100),
  recipientEmail: z.string().email().optional(),
  content: z.string().min(1, "Il messaggio non può essere vuoto").max(5000),
  senderName: z.string().max(100).optional(),
  senderEmail: z.string().email().optional(),
});

const contactLandlordSchema = contactFormSchema.extend({
  listingTitle: z.string().min(1).max(200),
  recipientId: z.string().optional(),
  recipientName: z.string().min(1).max(100),
  recipientEmail: z.string().email(),
});

async function resolveRecipient(recipientId: string | undefined, recipientEmail?: string) {
  if (recipientId) {
    const byId = await userStore.findById(recipientId);
    if (byId) return byId;
  }

  if (!recipientEmail) {
    return null;
  }

  const byEmail = await userStore.filter((user) => user.email === recipientEmail);
  return byEmail[0] ?? null;
}

async function upsertConversation({
  listingId,
  listingTitle,
  senderId,
  senderName,
  recipientId,
  recipientName,
  content,
}: {
  listingId: string;
  listingTitle: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
}) {
  const existing = await conversationStore.filter(
    (conversation) =>
      conversation.listingId === listingId &&
      conversation.participantIds.includes(senderId) &&
      conversation.participantIds.includes(recipientId)
  );

  const now = new Date().toISOString();
  const trimmedContent = content.trim();
  const conversationId = existing[0]?.id ?? `conv-${generateId()}`;

  if (!existing[0]) {
    const conversation: Conversation = {
      id: conversationId,
      listingId,
      listingTitle,
      participantIds: [senderId, recipientId],
      participantNames: [senderName, recipientName],
      lastMessage: trimmedContent,
      lastMessageAt: now,
      unreadCount: 1,
    };
    await conversationStore.create(conversation);
  } else {
    await conversationStore.update(conversationId, {
      lastMessage: trimmedContent,
      lastMessageAt: now,
      unreadCount: existing[0].unreadCount + 1,
    });
  }

  const message: Message = {
    id: `msg-${generateId()}`,
    conversationId,
    senderId,
    senderName,
    content: trimmedContent,
    read: false,
    createdAt: now,
  };

  await messageStore.create(message);

  return { conversationId, message };
}

export async function sendMessageAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const raw = {
    conversationId: formData.get("conversationId"),
    content: formData.get("content"),
  };

  const parsed = sendMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return;
  }

  const conversation = await conversationStore.findById(parsed.data.conversationId);
  if (!conversation || !conversation.participantIds.includes(user.id)) {
    return;
  }

  await upsertConversation({
    listingId: conversation.listingId,
    listingTitle: conversation.listingTitle,
    senderId: user.id,
    senderName: user.name,
    recipientId:
      conversation.participantIds.find((participantId) => participantId !== user.id) ?? conversation.participantIds[0],
    recipientName:
      conversation.participantNames.find((participantName) => participantName !== user.name) ??
      conversation.participantNames[0],
    content: parsed.data.content,
  });

  revalidatePath("/dashboard/messages");
}

export async function startConversationAction(_prevState: unknown, formData: FormData) {
  const currentUser = await getCurrentUser();
  const raw = {
    listingId: formData.get("listingId"),
    listingTitle: formData.get("listingTitle"),
    recipientId: formData.get("recipientId") || undefined,
    recipientName: formData.get("recipientName"),
    recipientEmail: formData.get("recipientEmail"),
    content: formData.get("content"),
    senderName: formData.get("senderName") || undefined,
    senderEmail: formData.get("senderEmail") || undefined,
  };

  const parsed = startConversationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const recipient = await resolveRecipient(parsed.data.recipientId, parsed.data.recipientEmail);
  if (!recipient) {
    return { error: "Non siamo riusciti a trovare il destinatario di questo annuncio" };
  }

  const senderId = currentUser?.id ?? `guest:${parsed.data.senderEmail?.toLowerCase()}`;
  const senderName = currentUser?.name ?? parsed.data.senderName ?? "Studente interessato";

  const { conversationId } = await upsertConversation({
    listingId: parsed.data.listingId,
    listingTitle: parsed.data.listingTitle,
    senderId,
    senderName,
    recipientId: recipient.id,
    recipientName: parsed.data.recipientName,
    content: parsed.data.content,
  });

  await createNotification(
    recipient.id,
    "message",
    `Nuova richiesta per ${parsed.data.listingTitle}`,
    `${senderName} ti ha scritto a proposito del tuo annuncio.`,
    "/dashboard/messages"
  );

  await sendInquiryNotification(
    parsed.data.recipientEmail ?? recipient.email,
    parsed.data.recipientName,
    senderName,
    parsed.data.listingTitle,
    parsed.data.content
  );

  if (currentUser) {
    await emitEvent(currentUser.id, "listing_contacted", "listing", parsed.data.listingId, {
      listingTitle: parsed.data.listingTitle,
    });
  }

  revalidatePath("/dashboard/messages");
  revalidatePath("/notifications");
  return { success: true, conversationId };
}

export async function contactLandlordAction(_prevState: unknown, formData: FormData) {
  const currentUser = await getCurrentUser();
  const raw = {
    listingId: formData.get("listingId"),
    listingTitle: formData.get("listingTitle"),
    recipientId: formData.get("recipientId") || undefined,
    recipientName: formData.get("recipientName"),
    recipientEmail: formData.get("recipientEmail"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  };

  const parsed = contactLandlordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const recipient = await resolveRecipient(parsed.data.recipientId, parsed.data.recipientEmail);
  if (!recipient) {
    return { error: "Non siamo riusciti a trovare il proprietario di questo annuncio" };
  }

  const senderId = currentUser?.id ?? `guest:${(currentUser?.email ?? parsed.data.email).toLowerCase()}`;
  const senderName = currentUser?.name ?? parsed.data.name;

  await upsertConversation({
    listingId: parsed.data.listingId,
    listingTitle: parsed.data.listingTitle,
    senderId,
    senderName,
    recipientId: recipient.id,
    recipientName: parsed.data.recipientName,
    content: parsed.data.message,
  });

  await createNotification(
    recipient.id,
    "message",
    `Nuova richiesta per ${parsed.data.listingTitle}`,
    `${senderName} ti ha scritto a proposito del tuo annuncio.`,
    "/dashboard/messages"
  );

  await sendInquiryNotification(
    parsed.data.recipientEmail,
    parsed.data.recipientName,
    senderName,
    parsed.data.listingTitle,
    parsed.data.message
  );

  if (currentUser) {
    await emitEvent(currentUser.id, "listing_contacted", "listing", parsed.data.listingId, {
      listingTitle: parsed.data.listingTitle,
    });
  }

  revalidatePath("/dashboard/messages");
  revalidatePath("/notifications");

  return {
    success: true,
    message: "Messaggio inviato. Troverai la conversazione anche nella dashboard.",
  };
}

export async function markConversationReadAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere" };
  }

  const conversationId = formData.get("conversationId") as string;
  if (!conversationId) return { error: "Conversazione non valida" };

  const conversation = await conversationStore.findById(conversationId);
  if (!conversation || !conversation.participantIds.includes(user.id)) {
    return { error: "Conversazione non disponibile" };
  }

  const messages = await messageStore.filter((m) => m.conversationId === conversationId);
  for (const msg of messages) {
    await messageStore.update(msg.id, { read: true });
  }
  await conversationStore.update(conversationId, { unreadCount: 0 });
  revalidatePath("/dashboard/messages");
  return { success: true };
}

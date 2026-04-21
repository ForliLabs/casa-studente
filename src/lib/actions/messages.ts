"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  conversationStore,
  messageStore,
  type Conversation,
  type Message,
} from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function sendMessageAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const conversationId = formData.get("conversationId") as string;
  const content = formData.get("content") as string;

  if (!content?.trim()) return;

  const conversation = await conversationStore.findById(conversationId);
  if (!conversation) return;

  const message: Message = {
    id: `msg-${generateId()}`,
    conversationId,
    senderId: user.id,
    senderName: user.name,
    content: content.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  await messageStore.create(message);
  await conversationStore.update(conversationId, {
    lastMessage: content.trim(),
    lastMessageAt: new Date().toISOString(),
    unreadCount: conversation.unreadCount + 1,
  });

  revalidatePath("/dashboard/messages");
}

export async function startConversationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per inviare messaggi" };
  }

  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const recipientName = formData.get("recipientName") as string;
  const content = formData.get("content") as string;

  if (!content?.trim()) {
    return { error: "Il messaggio non può essere vuoto" };
  }

  const convId = `conv-${generateId()}`;
  const conversation: Conversation = {
    id: convId,
    listingId,
    listingTitle,
    participantIds: [user.id, "user-landlord-1"],
    participantNames: [user.name, recipientName],
    lastMessage: content.trim(),
    lastMessageAt: new Date().toISOString(),
    unreadCount: 1,
  };

  await conversationStore.create(conversation);

  const message: Message = {
    id: `msg-${generateId()}`,
    conversationId: convId,
    senderId: user.id,
    senderName: user.name,
    content: content.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  await messageStore.create(message);
  revalidatePath("/dashboard/messages");
  return { success: true, conversationId: convId };
}

export async function markConversationReadAction(formData: FormData) {
  const conversationId = formData.get("conversationId") as string;
  if (!conversationId) return;

  const messages = await messageStore.filter((m) => m.conversationId === conversationId);
  for (const msg of messages) {
    await messageStore.update(msg.id, { read: true });
  }
  await conversationStore.update(conversationId, { unreadCount: 0 });
  revalidatePath("/dashboard/messages");
}

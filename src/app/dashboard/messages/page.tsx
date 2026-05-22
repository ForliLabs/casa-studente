import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MessagesView } from "@/components/messages-view";
import { getCurrentUser } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import { conversationStore, messageStore } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Messaggi",
  description: "Consulta la inbox con le conversazioni tra studenti e proprietari su CasaStudente.",
};

export default async function DashboardMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ conversation?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const [{ conversation: requestedConversation } = {}, conversations, messages, cookieStore] = await Promise.all([
    searchParams,
    conversationStore.findAll(),
    messageStore.findAll(),
    cookies(),
  ]);
  const currentLocale = getLocaleFromCookie(cookieStore.get("locale")?.value);

  const visibleConversations = conversations.filter((conversation) => conversation.participantIds.includes(user.id));
  const sortedConversations = visibleConversations.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const visibleConversationIds = new Set(sortedConversations.map((conversation) => conversation.id));
  const messagesByConversation: Record<string, typeof messages> = {};
  for (const conversation of sortedConversations) {
    messagesByConversation[conversation.id] = messages
      .filter((message) => visibleConversationIds.has(message.conversationId) && message.conversationId === conversation.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Inbox messaggi
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Conversazioni
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600">
          Vedi solo le conversazioni collegate al tuo account, incluse richieste per annunci, intro coinquilini e follow-up sui tour.
        </p>
      </section>

      <MessagesView
        currentUserId={user.id}
        currentUserName={user.name}
        preferredLocale={currentLocale}
        initialSelectedId={requestedConversation}
        conversations={sortedConversations}
        messagesByConversation={messagesByConversation}
      />
    </div>
  );
}

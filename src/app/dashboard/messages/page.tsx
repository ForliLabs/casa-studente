import type { Metadata } from "next";
import { conversationStore, messageStore } from "@/lib/stores";
import { MessagesView } from "@/components/messages-view";

export const metadata: Metadata = {
  title: "Messaggi",
  description: "Consulta la inbox con le conversazioni tra studenti e proprietari su CasaStudente.",
};

export default async function DashboardMessagesPage() {
  const conversations = await conversationStore.findAll();
  const messages = await messageStore.findAll();

  const sortedConversations = conversations.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const messagesByConversation: Record<string, typeof messages> = {};
  for (const conv of conversations) {
    messagesByConversation[conv.id] = messages
      .filter((m) => m.conversationId === conv.id)
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
          Gestisci domande, richieste di visita e conferme sui tuoi annunci.
        </p>
      </section>

      <MessagesView
        conversations={sortedConversations}
        messagesByConversation={messagesByConversation}
      />
    </div>
  );
}

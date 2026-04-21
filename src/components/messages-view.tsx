"use client";

import { useState } from "react";
import { sendMessageAction } from "@/lib/actions/messages";

interface Conversation {
  id: string;
  listingTitle: string;
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface MessagesViewProps {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

export function MessagesView({ conversations, messagesByConversation }: MessagesViewProps) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || "");
  const selectedConv = conversations.find((c) => c.id === selectedId);
  const selectedMessages = messagesByConversation[selectedId] || [];

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* Thread list */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="border-b border-gray-200 px-3 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Thread recenti</h2>
        </div>
        <div className="mt-3 space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                conv.id === selectedId
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {conv.participantNames.filter((n) => n !== conv.participantNames[0]).join(", ") || conv.participantNames[0]}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{conv.listingTitle}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <p className="mt-3 truncate text-sm leading-6 text-gray-600">{conv.lastMessage}</p>
              {conv.unreadCount > 0 && (
                <span className="mt-3 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {conv.unreadCount} non letto/i
                </span>
              )}
            </button>
          ))}

          {conversations.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-gray-500">
              Nessuna conversazione ancora.
            </p>
          )}
        </div>
      </div>

      {/* Chat view */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {selectedConv ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <p className="text-sm text-gray-500">Conversazione attiva</p>
                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  {selectedConv.participantNames.join(" & ")}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Annuncio: {selectedConv.listingTitle}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                Attiva
              </span>
            </div>

            <div className="space-y-4 py-6" style={{ maxHeight: 400, overflowY: "auto" }}>
              {selectedMessages.map((msg, index) => {
                const isFirstParticipant = msg.senderName === selectedConv.participantNames[0];
                return (
                  <div key={msg.id}>
                    {(index === 0 || selectedMessages[index - 1].senderName !== msg.senderName) && (
                      <p className={`mb-1 text-xs text-gray-400 ${isFirstParticipant ? "" : "text-right"}`}>
                        {msg.senderName}
                      </p>
                    )}
                    <div
                      className={`max-w-xl rounded-3xl px-5 py-4 text-sm leading-6 ${
                        isFirstParticipant
                          ? "bg-gray-100 text-gray-700"
                          : "ml-auto bg-blue-600 text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className={`mt-1 text-xs text-gray-300 ${isFirstParticipant ? "" : "text-right"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      {msg.read && !isFirstParticipant && " ✓✓"}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Message composer */}
            <form action={sendMessageAction} className="flex gap-3">
              <input type="hidden" name="conversationId" value={selectedId} />
              <input
                name="content"
                required
                className="flex-1 rounded-2xl border border-gray-300 px-5 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                placeholder="Scrivi un messaggio..."
              />
              <button
                type="submit"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Invia
              </button>
            </form>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-500">
            Seleziona una conversazione per iniziare.
          </div>
        )}
      </div>
    </section>
  );
}

function formatTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 1) return "Ora";
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffHours < 48) return "Ieri";
  return new Date(dateStr).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

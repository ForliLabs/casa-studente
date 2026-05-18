"use client";

import { useState, useEffect, useRef, useOptimistic, startTransition } from "react";
import { EmptyState } from "@/components/feedback";
import { sendMessageAction, markConversationReadAction } from "@/lib/actions/messages";

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
  currentUserId: string;
  currentUserName: string;
  initialSelectedId?: string;
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

export function MessagesView({
  currentUserId,
  currentUserName,
  initialSelectedId,
  conversations,
  messagesByConversation,
}: MessagesViewProps) {
  const initialConversationId =
    initialSelectedId && conversations.some((conversation) => conversation.id === initialSelectedId)
      ? initialSelectedId
      : conversations[0]?.id || "";

  const [selectedId, setSelectedId] = useState(initialConversationId);
  // On mobile: show the thread list (true) or the message pane (false).
  // Start on the message pane only when a specific conversation was pre-selected.
  const [showMobileList, setShowMobileList] = useState(!initialSelectedId);
  // Track conversations whose unread count has been cleared locally after opening.
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(() => {
    // Mark the initially-selected conversation as read immediately.
    return initialConversationId ? new Set([initialConversationId]) : new Set();
  });

  // Guard so the one-time initial mark-read fires at most once even if
  // `conversations` or `initialConversationId` changes reference.
  const didMarkInitialRead = useRef(false);

  // Controlled input so we can clear it immediately after optimistic send.
  const [inputValue, setInputValue] = useState("");
  // Inline send-error state — holds the last failed draft so the user can retry.
  const [sendError, setSendError] = useState<string | null>(null);

  // Scroll anchor — keeps the message list pinned to the bottom.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);
  const selectedMessages = messagesByConversation[selectedId] || [];

  // Optimistic messages for the currently selected conversation.
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    selectedMessages,
    (state: Message[], newMsg: Message) => [...state, newMsg]
  );

  // Scroll to bottom whenever the visible messages change (new message or conversation switch).
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [optimisticMessages]);

  function selectConversation(id: string) {
    setSelectedId(id);
    setShowMobileList(false); // switch to message pane on mobile
    setInputValue(""); // clear any draft when switching threads
    setSendError(null); // clear any prior send error

    // Optimistically clear the unread badge and persist to the server.
    const conversation = conversations.find((c) => c.id === id);
    if (conversation && conversation.unreadCount > 0 && !localReadIds.has(id)) {
      setLocalReadIds((prev) => new Set([...prev, id]));
      const fd = new FormData();
      fd.set("conversationId", id);
      // Fire-and-forget — revalidation will sync on next navigation.
      markConversationReadAction(fd);
    }
  }

  // On initial render, mark the pre-selected conversation as read on the server.
  // The ref guard ensures this fires exactly once regardless of re-renders.
  useEffect(() => {
    if (didMarkInitialRead.current || !initialConversationId) return;
    didMarkInitialRead.current = true;
    const conv = conversations.find((c) => c.id === initialConversationId);
    if (conv && conv.unreadCount > 0) {
      const fd = new FormData();
      fd.set("conversationId", initialConversationId);
      markConversationReadAction(fd);
    }
  }, [conversations, initialConversationId]);

  /** Send handler: clears the input immediately, adds an optimistic bubble, then
   *  fires the server action.  On failure the draft is restored and an inline
   *  error is shown so the user can retry without losing their text. */
  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = inputValue.trim();
    if (!content) return;

    // Build the FormData before clearing the input so the action receives it.
    const fd = new FormData();
    fd.set("conversationId", selectedId);
    fd.set("content", content);

    // Clear any previous error and the input for a snappy feel.
    setSendError(null);
    setInputValue("");

    startTransition(async () => {
      addOptimisticMessage({
        id: `opt-${Date.now()}`,
        conversationId: selectedId,
        senderId: currentUserId,
        senderName: currentUserName,
        content,
        read: false,
        createdAt: new Date().toISOString(),
      });
      const result = await sendMessageAction(fd);
      if (result?.error) {
        // Restore the draft so the user can retry.
        setInputValue(content);
        setSendError(result.error);
      }
    });
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="Nessuna conversazione ancora"
        description="Quando contatterai un proprietario, riceverai un'intro coinquilino o prenoterai un tour, la conversazione apparirà qui."
        actionLabel="Esplora gli annunci"
        actionHref="/listings"
      />
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* ── Thread list ──────────────────────────────────────────────────── *
       * On mobile it fills the whole width and is hidden when a convo is   *
       * open. On xl+ it is always visible as a sidebar.                    */}
      <div
        className={[
          "rounded-3xl border border-gray-200 bg-white shadow-sm",
          showMobileList ? "block" : "hidden xl:block",
        ].join(" ")}
      >
        <div className="border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Messaggi</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {conversations.length} {conversations.length === 1 ? "conversazione" : "conversazioni"}
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {conversations.map((conversation) => {
            const isActive = conversation.id === selectedId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => selectConversation(conversation.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "w-full px-4 py-4 text-left transition",
                  isActive ? "bg-blue-50" : "hover:bg-gray-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">
                      {conversation.participantNames.join(" & ")}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {conversation.listingTitle}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-xs text-gray-400">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                    {conversation.unreadCount > 0 && !localReadIds.has(conversation.id) && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 truncate text-sm text-gray-500 leading-5">
                  {conversation.lastMessage}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Message pane ─────────────────────────────────────────────────── *
       * On mobile it fills the whole width and is hidden when the thread    *
       * list is shown. On xl+ it is always visible alongside the sidebar.   */}
      <div
        className={[
          "rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8",
          showMobileList ? "hidden xl:block" : "block",
        ].join(" ")}
      >
        {selectedConversation ? (
          <>
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {/* Back button — only visible on mobile */}
                <button
                  type="button"
                  onClick={() => setShowMobileList(true)}
                  aria-label="Torna ai messaggi"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 xl:hidden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {selectedConversation.participantNames.join(" & ")}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">{selectedConversation.listingTitle}</p>
                </div>
              </div>
              <span className="self-start rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:self-auto">
                Attiva
              </span>
            </div>

            <div className="max-h-[55vh] space-y-4 overflow-y-auto py-6">
              {optimisticMessages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUserId;
                // Optimistic messages have a temporary ID prefix.
                const isOptimistic = message.id.startsWith("opt-");
                return (
                  <div key={message.id}>
                    {(index === 0 || optimisticMessages[index - 1].senderName !== message.senderName) && (
                      <p className={`mb-1 text-xs text-gray-400 ${isOwnMessage ? "text-right" : ""}`}>
                        {message.senderName}
                      </p>
                    )}
                    <div
                      className={`max-w-xl rounded-3xl px-5 py-4 text-sm leading-6 transition-opacity ${
                        isOwnMessage
                          ? "ml-auto bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      } ${isOptimistic ? "opacity-70" : "opacity-100"}`}
                    >
                      {message.content}
                    </div>
                    <p className={`mt-1 text-xs text-gray-300 ${isOwnMessage ? "text-right" : ""}`}>
                      {new Date(message.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      {message.read && isOwnMessage && " ✓✓"}
                      {isOptimistic && isOwnMessage && " ·"}
                    </p>
                  </div>
                );
              })}
              {/* Invisible anchor that we scroll into view on new messages. */}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>

            {sendError && (
              <div
                role="alert"
                className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span>{sendError}</span>
                <button
                  type="button"
                  onClick={() => setSendError(null)}
                  aria-label="Chiudi errore"
                  className="shrink-0 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="conversationId" value={selectedId} />
              <label htmlFor="message-compose-input" className="sr-only">
                Scrivi un messaggio
              </label>
              <input
                id="message-compose-input"
                name="content"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                className="flex-1 rounded-2xl border border-gray-300 px-5 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                placeholder="Scrivi un messaggio..."
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
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

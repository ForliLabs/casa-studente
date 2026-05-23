"use client";

import { useRef, useState, useTransition } from "react";
import { Bot, LoaderCircle, SendHorizontal, Sparkles } from "lucide-react";
import { chatAction } from "@/lib/actions/ai";

interface ChatTurn {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface HousingAssistantChatProps {
  userName: string;
  configured: boolean;
}

const starterPrompts = [
  "Quali zone di Forlì consigli per stare vicino al campus?",
  "Che differenza c'è tra contratto transitorio e 4+4?",
  "Quali documenti devo preparare prima di firmare un affitto?",
  "Come funziona la caparra per una stanza studentesca in Italia?",
];

export function HousingAssistantChat({ userName, configured }: HousingAssistantChatProps) {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content: configured
        ? `Ciao ${userName}! Sono l'assistente CasaStudente. Posso aiutarti con quartieri, contratti, documenti e prossimi passi per trovare casa a Forlì.`
        : `Ciao ${userName}! Sono l'assistente CasaStudente in modalità demo. Posso comunque guidarti su quartieri, contratti e processo di affitto a Forlì.`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messageSequence = useRef(0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(inputValue);
  }

  function createMessageId(prefix: "user" | "assistant") {
    messageSequence.current += 1;
    return `${prefix}-${messageSequence.current}`;
  }

  function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || isPending) return;

    const previousMessages = messages;
    const nextMessages = [
      ...previousMessages,
      { id: createMessageId("user"), role: "user" as const, content: message },
    ];

    setMessages(nextMessages);
    setInputValue("");
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("message", message);
      formData.set(
        "history",
        JSON.stringify(previousMessages.map(({ role, content }) => ({ role, content })))
      );

      const result = await chatAction(formData);
      if (result?.error) {
        setMessages(previousMessages);
        setInputValue(message);
        setError(result.error);
        return;
      }

      setMessages([
        ...nextMessages,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content:
            result.response ||
            "Posso aiutarti con quartieri, contratti e processo di affitto. Prova a riformulare la domanda.",
        },
      ]);
    });
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Chat assistita
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Parla con l&apos;assistente abitativo</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Ricevi risposte rapide su quartieri, contratti, documenti e vita universitaria. Ogni
            risposta resta focalizzata sul percorso casa a Forlì.
          </p>
        </div>
        <span className={`inline-flex self-start rounded-full px-4 py-2 text-sm font-medium ${
          configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        }`}>
          {configured ? "AI live" : "Fallback demo"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isPending}
            className="rounded-full border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4 rounded-3xl bg-gray-50 p-4 sm:p-5">
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <div key={message.id} className={isAssistant ? "pr-10" : "pl-10"}>
              <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-2xl rounded-3xl px-5 py-4 text-sm leading-6 ${
                    isAssistant
                      ? "bg-white text-gray-700 shadow-sm"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-current/70">
                    {isAssistant ? <Bot className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {isAssistant ? "Assistente" : userName}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        {isPending && (
          <div className="pr-10">
            <div className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              L&apos;assistente sta scrivendo...
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="housing-assistant-input" className="sr-only">
          Scrivi la tua domanda
        </label>
        <textarea
          id="housing-assistant-input"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          rows={3}
          placeholder="Ad esempio: quali documenti servono per bloccare una stanza?"
          className="min-h-28 flex-1 rounded-3xl border border-gray-300 px-5 py-4 text-sm text-gray-900 outline-none transition focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isPending || !inputValue.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="h-4 w-4" />
          Invia domanda
        </button>
      </form>
    </div>
  );
}

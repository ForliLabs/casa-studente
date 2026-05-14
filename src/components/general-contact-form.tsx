"use client";

import { useActionState, useEffect } from "react";
import { generalContactAction } from "@/lib/actions/messages";
import { useToast } from "@/components/toast";

export function GeneralContactForm() {
  const [state, formAction, isPending] = useActionState(generalContactAction, null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success && state.message) showToast(state.message, "success");
  }, [showToast, state]);

  if (state?.success) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-emerald-800">Messaggio inviato</p>
        </div>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Nome e cognome</span>
        <input
          name="name"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          placeholder="Es. Giulia Bianchi"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input
          name="email"
          required
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          placeholder="nome@universita.it"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Oggetto</span>
        <input
          name="subject"
          required
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          placeholder="Es. Problema con il pagamento"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Messaggio</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          placeholder="Descrivi la tua richiesta nel dettaglio..."
        />
      </label>
      {state?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "Invio in corso..." : "Invia messaggio"}
      </button>
      <p className="text-xs text-gray-400">
        Questo modulo è attualmente in modalità demo. In produzione, il messaggio verrà inviato al team di supporto via email.
      </p>
    </form>
  );
}

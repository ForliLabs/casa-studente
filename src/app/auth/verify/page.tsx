"use client";

import { useActionState, useEffect } from "react";
import { verifyUniversityAction } from "@/lib/actions/auth";
import { useToast } from "@/components/toast";

export default function VerifyPage() {
  const [state, formAction, isPending] = useActionState(verifyUniversityAction, null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!state) return;
    if ("success" in state && state.message) showToast(state.message, "success");
    if ("error" in state && state.error) showToast(state.error, "error");
  }, [showToast, state]);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verifica universitaria</h1>
          <p className="mt-2 text-sm text-gray-500">
            Conferma la tua iscrizione all&apos;Università di Bologna per ottenere il badge verificato.
          </p>
        </div>

        {state && "success" in state && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {state.message}
          </div>
        )}

        {state && "error" in state && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Numero di matricola</span>
            <input
              name="universityId"
              required
              autoComplete="off"
              pattern="[0-9]{7,10}"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. 0001234567"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Certificato di iscrizione</span>
            <input
              name="document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700"
            />
            <input type="hidden" name="documentName" value="" />
            <p className="mt-1 text-xs text-gray-400">
              Carica PDF o immagine del certificato. Se preferisci, puoi inviare il solo numero di matricola.
            </p>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Verifica in corso..." : "Completa verifica"}
          </button>
        </form>
      </div>
    </main>
  );
}

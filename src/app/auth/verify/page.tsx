"use client";

import { useActionState } from "react";
import { verifyUniversityAction } from "@/lib/actions/auth";

export default function VerifyPage() {
  const [state, formAction, isPending] = useActionState(verifyUniversityAction, null);

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
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. 0001234567"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Certificato di iscrizione (nome file)
            </span>
            <input
              name="documentName"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="certificato_iscrizione.pdf"
            />
            <p className="mt-1 text-xs text-gray-400">
              In futuro sarà possibile caricare il file direttamente.
            </p>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Verifica in corso..." : "Avvia verifica"}
          </button>
        </form>
      </div>
    </main>
  );
}

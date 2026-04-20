"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accedi a CasaStudente</h1>
          <p className="mt-2 text-sm text-gray-500">
            Inserisci le credenziali per accedere al tuo account.
          </p>
        </div>

        {state?.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="nome@studio.unibo.it"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Non hai un account?{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-700">
            Registrati
          </Link>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700">Account demo:</p>
          <p className="mt-1">Studente: martina.lopez@studio.unibo.it / password123</p>
          <p>Proprietario: elena.rossi@casastudente.it / password123</p>
        </div>
      </div>
    </main>
  );
}

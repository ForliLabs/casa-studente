"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Crea il tuo account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Registrati come studente o proprietario su CasaStudente.
          </p>
        </div>

        {state?.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Nome completo</span>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. Giulia Bianchi"
            />
          </label>

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
              minLength={6}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Minimo 6 caratteri"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">Ruolo</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
                <input type="radio" name="role" value="student" defaultChecked className="accent-blue-600" />
                Studente
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
                <input type="radio" name="role" value="landlord" className="accent-blue-600" />
                Proprietario
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Registrazione in corso..." : "Crea account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Hai già un account?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700">
            Accedi
          </Link>
        </div>
      </div>
    </main>
  );
}

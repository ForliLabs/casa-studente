"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordChecks = useMemo(
    () => [
      { label: "Almeno 8 caratteri", valid: password.length >= 8 },
      { label: "Una lettera maiuscola", valid: /[A-Z]/.test(password) },
      { label: "Una lettera minuscola", valid: /[a-z]/.test(password) },
      { label: "Un numero", valid: /\d/.test(password) },
    ],
    [password]
  );
  const passwordScore = passwordChecks.filter((item) => item.valid).length;

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
              autoComplete="name"
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
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="nome@studio.unibo.it"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-24 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                placeholder="Minimo 8 caratteri"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-1.5 right-2 rounded-lg px-3 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                {showPassword ? "Nascondi" : "Mostra"}
              </button>
            </div>
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Robustezza password</p>
                <p className="text-xs font-medium text-gray-600">{passwordScore}/4</p>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full ${index < passwordScore ? "bg-emerald-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                {passwordChecks.map((check) => (
                  <li key={check.label} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${check.valid ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {check.label}
                  </li>
                ))}
              </ul>
            </div>
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

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
            <p className="font-semibold">Consiglio sicurezza</p>
            <p className="mt-1">
              Evita password già usate altrove e usa un indirizzo email che controlli spesso per verifiche e notifiche.
            </p>
          </div>
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

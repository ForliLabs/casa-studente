"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { contactLandlordAction } from "@/lib/actions/messages";
import { useToast } from "@/components/toast";

interface ContactFormProps {
  listingId: string;
  listingTitle: string;
  landlordName: string;
  landlordEmail: string;
  landlordId?: string;
  /** When false an auth gate is shown instead of the form. */
  isLoggedIn?: boolean;
  /** Logged-in user's display name — hides the name/email/phone identity fields. */
  userName?: string;
  /** Logged-in user's email — hides the name/email/phone identity fields. */
  userEmail?: string;
}

export function ContactForm({
  listingId,
  listingTitle,
  landlordName,
  landlordEmail,
  landlordId,
  isLoggedIn = true,
  userName,
  userEmail,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(contactLandlordAction, null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success && state.message) showToast(state.message, "success");
  }, [showToast, state]);

  // When logged in and we have the user's identity, skip the identity fields.
  const isAccountAware = isLoggedIn && !!userName && !!userEmail;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Contatta il proprietario</h2>
      <p className="mt-2 text-sm text-gray-500">
        Invia un messaggio a {landlordName} per ricevere dettagli su {listingTitle.toLowerCase()}.
      </p>

      {/* Auth gate — shown when the user is not logged in */}
      {!isLoggedIn ? (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-medium">Accedi per inviare un messaggio al proprietario.</p>
          <p className="mt-1 text-blue-600">I messaggi sono collegati al tuo profilo studente per garantire risposte più rapide.</p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(`/listings/${listingId}`)}`}
            className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Accedi per contattare
          </Link>
        </div>
      ) : state?.success ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700" role="alert">
          <p>{state.message}</p>
          <Link href="/dashboard/messages" className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700">
            Apri la conversazione
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="listingTitle" value={listingTitle} />
          <input type="hidden" name="recipientName" value={landlordName} />
          <input type="hidden" name="recipientEmail" value={landlordEmail} />
          {landlordId && <input type="hidden" name="recipientId" value={landlordId} />}

          {isAccountAware ? (
            <>
              {/* Pass identity as hidden fields — the server action reads them from session,
                  but the schema still validates them, so we supply them as a fallback. */}
              <input type="hidden" name="name" value={userName} />
              <input type="hidden" name="email" value={userEmail} />

              {/* Account-aware identity badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white" aria-hidden="true">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-blue-900 truncate">{userName}</p>
                  <p className="text-blue-700 truncate">{userEmail}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="ml-auto shrink-0 text-xs font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  Profilo
                </Link>
              </div>
            </>
          ) : (
            <>
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
                <span className="text-sm font-medium text-gray-700">Telefono (opzionale)</span>
                <input
                  name="phone"
                  autoComplete="tel"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                  placeholder="+39 333 1234567"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Messaggio</span>
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              defaultValue={`Ciao ${landlordName}, sono interessato/a a ${listingTitle.toLowerCase()}. Vorrei sapere se è ancora disponibile e quando sarebbe possibile visitarlo.`}
            />
          </label>
          {state?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Invio in corso..." : "Invia richiesta"}
          </button>
        </form>
      )}
    </div>
  );
}

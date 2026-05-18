"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { requestTourAction } from "@/lib/actions/tours";
import { useToast } from "@/components/toast";
import { describeAvailability } from "@/lib/tour-workflow";
import type { TourAvailability } from "@/lib/stores/tours";

interface TourRequestPanelProps {
  listingId: string;
  listingTitle: string;
  landlordId: string;
  landlordName: string;
  availability: TourAvailability[];
  isLoggedIn: boolean;
}

/**
 * Returns the ISO date string (YYYY-MM-DD) of the next occurrence of the given
 * day of week (0=Sunday … 6=Saturday), always at least 1 day in the future.
 */
function nextDateForDayOfWeek(dayOfWeek: number): string {
  const today = new Date();
  const diff = ((dayOfWeek - today.getDay() + 7) % 7) || 7; // never today
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().slice(0, 10);
}

export function TourRequestPanel({
  listingId,
  listingTitle,
  landlordId,
  landlordName,
  availability,
  isLoggedIn,
}: TourRequestPanelProps) {
  const [state, formAction, isPending] = useActionState(requestTourAction, null);
  const { showToast } = useToast();

  // Controlled date/time so availability chips can prefill them.
  const [prefillDate, setPrefillDate] = useState("");
  const [prefillTime, setPrefillTime] = useState("");

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success) showToast("Tour richiesto con successo.", "success");
  }, [showToast, state]);

  const today = new Date().toISOString().slice(0, 10);

  function applySlot(slot: TourAvailability) {
    setPrefillDate(nextDateForDayOfWeek(slot.dayOfWeek));
    setPrefillTime(slot.startTime);
  }

  return (
    <div id="tour-request" className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Prenota un tour</h2>
      <p className="mt-2 text-sm text-gray-500">
        Richiedi una visita con {landlordName} per verificare spazi, luminosità e dettagli del contratto.
      </p>

      {availability.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500">
            {isLoggedIn ? "Clicca su uno slot per precompilare data e orario:" : "Disponibilità dichiarata:"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availability.map((slot) => (
              isLoggedIn ? (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => applySlot(slot)}
                  title="Clicca per precompilare data e orario"
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    prefillDate === nextDateForDayOfWeek(slot.dayOfWeek) && prefillTime === slot.startTime
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
                  ].join(" ")}
                >
                  {describeAvailability(slot)}
                </button>
              ) : (
                <span key={slot.id} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  {describeAvailability(slot)}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {!isLoggedIn ? (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <p>Accedi per prenotare un tour virtuale o in presenza.</p>
          <Link
            href="/auth/login"
            className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Accedi per prenotare
          </Link>
        </div>
      ) : state?.success ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <p>Richiesta inviata. Troverai gli aggiornamenti nella dashboard tour.</p>
          <Link
            href="/dashboard/tours"
            className="mt-3 inline-flex rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
          >
            Vai ai tuoi tour
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="listingTitle" value={listingTitle} />
          <input type="hidden" name="landlordId" value={landlordId} />
          <input type="hidden" name="landlordName" value={landlordName} />

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Tipo di tour</span>
            <select
              name="type"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              defaultValue="virtual"
            >
              <option value="virtual">Video tour guidato</option>
              <option value="in_person">Visita in presenza</option>
              <option value="async_360">Tour 360° asincrono</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Data preferita</span>
              <input
                type="date"
                name="date"
                min={today}
                required
                value={prefillDate}
                onChange={(e) => setPrefillDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Orario preferito</span>
              <input
                type="time"
                name="time"
                required
                value={prefillTime}
                onChange={(e) => setPrefillTime(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Cosa vuoi verificare? (opzionale)</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
              placeholder="Es. contratto, luminosità, fibra, spese, rumorosità"
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
            {isPending ? "Invio richiesta..." : "Richiedi tour"}
          </button>
        </form>
      )}
    </div>
  );
}

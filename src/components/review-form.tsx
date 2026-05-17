"use client";

import { useActionState, useEffect, useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  listingId: string;
  listingTitle: string;
  revieweeId: string;
  revieweeName: string;
}

type ActionState = { success?: boolean; error?: string; message?: string } | null;

function wrappedSubmitReview(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  return submitReviewAction(formData);
}

function StarInput({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} ${star === 1 ? "stella" : "stelle"}`}
            onClick={() => onChange(star)}
            className={cn(
              "rounded-md p-1 text-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500",
              star <= value ? "text-amber-500" : "text-gray-300 hover:text-amber-300"
            )}
          >
            ★
          </button>
        ))}
        <input type="hidden" name={name} value={value} />
      </div>
    </fieldset>
  );
}

export function ReviewForm({
  listingId,
  listingTitle,
  revieweeId,
  revieweeName,
}: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(wrappedSubmitReview, null);
  const { showToast } = useToast();

  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingCleanliness, setRatingCleanliness] = useState(0);
  const [ratingCommunication, setRatingCommunication] = useState(0);
  const [ratingAccuracy, setRatingAccuracy] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success) showToast("Recensione inviata con successo!", "success");
  }, [showToast, state]);

  if (state?.success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm" role="alert">
        <p className="text-lg font-semibold text-emerald-800">Grazie per la tua recensione!</p>
        <p className="mt-2 text-sm text-emerald-600">
          La tua recensione per {revieweeName} è stata pubblicata.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Lascia una recensione</h3>
            <p className="mt-1 text-sm text-gray-500">
              Condividi la tua esperienza con {revieweeName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Scrivi recensione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Recensione per {revieweeName}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Valuta la tua esperienza su {listingTitle}
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="revieweeId" value={revieweeId} />
        <input type="hidden" name="revieweeName" value={revieweeName} />
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="listingTitle" value={listingTitle} />

        <StarInput
          name="ratingOverall"
          label="Valutazione complessiva"
          value={ratingOverall}
          onChange={setRatingOverall}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StarInput
            name="ratingCleanliness"
            label="Pulizia"
            value={ratingCleanliness}
            onChange={setRatingCleanliness}
          />
          <StarInput
            name="ratingCommunication"
            label="Comunicazione"
            value={ratingCommunication}
            onChange={setRatingCommunication}
          />
          <StarInput
            name="ratingAccuracy"
            label="Precisione annuncio"
            value={ratingAccuracy}
            onChange={setRatingAccuracy}
          />
          <StarInput
            name="ratingValue"
            label="Rapporto qualità/prezzo"
            value={ratingValue}
            onChange={setRatingValue}
          />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Commento</span>
          <textarea
            name="comment"
            required
            minLength={10}
            rows={4}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            placeholder="Descrivi la tua esperienza in almeno 10 caratteri..."
          />
        </label>

        {state?.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {state.error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || ratingOverall === 0}
            aria-describedby="submit-hint"
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Invio in corso..." : "Pubblica recensione"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Annulla
          </button>
        </div>
        {ratingOverall === 0 && (
          <p id="submit-hint" className="text-xs text-gray-500">
            Seleziona almeno la valutazione complessiva per pubblicare.
          </p>
        )}
      </form>
    </div>
  );
}

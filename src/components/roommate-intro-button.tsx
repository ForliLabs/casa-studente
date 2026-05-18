"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { startConversationAction } from "@/lib/actions/messages";
import { useToast } from "@/components/toast";

interface RoommateIntroButtonProps {
  profileId: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  studyProgram: string;
  matchReasons: string[];
}

export function RoommateIntroButton({
  profileId,
  recipientId,
  recipientName,
  recipientEmail,
  studyProgram,
  matchReasons,
}: RoommateIntroButtonProps) {
  const [state, formAction, isPending] = useActionState(startConversationAction, null);
  const { showToast } = useToast();

  // "idle" → user sees the primary CTA
  // "preview" → user sees the editable intro before sending
  const [step, setStep] = useState<"idle" | "preview">("idle");

  const defaultIntro = `Ciao ${recipientName.split(" ")[0]}, ho visto il tuo profilo coinquilino su CasaStudente. Mi sembra che possiamo essere compatibili${matchReasons.length > 0 ? ` (${matchReasons.join(", ")})` : ""}. Ti andrebbe di sentirci per capire se possiamo condividere casa?`;

  // Editable copy of the intro; reset whenever the preview panel is opened.
  const [introText, setIntroText] = useState(defaultIntro);

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success) showToast(`Intro inviata a ${recipientName}.`, "success");
  }, [recipientName, showToast, state]);

  // After a successful send, show the open-chat link.
  if (state?.success) {
    return (
      <Link
        href={`/dashboard/messages?conversation=${state.conversationId}`}
        className="mt-5 block w-full rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Apri la chat con {recipientName.split(" ")[0]}
      </Link>
    );
  }

  // ── Preview / edit step ────────────────────────────────────────────────────
  if (step === "preview") {
    return (
      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          Anteprima del messaggio di presentazione
        </p>
        <p className="mt-1 text-xs text-blue-600">
          Puoi modificare il testo prima di inviarlo a {recipientName.split(" ")[0]}.
        </p>

        <textarea
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          rows={5}
          maxLength={1000}
          className="mt-3 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
          aria-label="Testo del messaggio di presentazione"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {introText.length}/1000
        </p>

        {state?.error && (
          <p role="alert" className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-3 flex gap-2">
          <input type="hidden" name="listingId" value={`roommate-${profileId}`} />
          <input type="hidden" name="listingTitle" value={`Matching coinquilini · ${studyProgram}`} />
          <input type="hidden" name="recipientId" value={recipientId} />
          <input type="hidden" name="recipientName" value={recipientName} />
          <input type="hidden" name="recipientEmail" value={recipientEmail} />
          <input type="hidden" name="content" value={introText} />

          <button
            type="button"
            onClick={() => setStep("idle")}
            disabled={isPending}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Indietro
          </button>
          <button
            type="submit"
            disabled={isPending || !introText.trim()}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Invio…" : "Invia presentazione"}
          </button>
        </form>
      </div>
    );
  }

  // ── Idle step — primary CTA ────────────────────────────────────────────────
  return (
    <button
      type="button"
      onClick={() => {
        setIntroText(defaultIntro); // reset to default each time preview opens
        setStep("preview");
      }}
      className="mt-5 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Scrivi a {recipientName.split(" ")[0]}
    </button>
  );
}

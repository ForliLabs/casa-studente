"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
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

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    if (state.success) showToast(`Intro inviata a ${recipientName}.`, "success");
  }, [recipientName, showToast, state]);

  const introMessage = `Ciao ${recipientName.split(" ")[0]}, ho visto il tuo profilo coinquilino su CasaStudente. Mi sembra che possiamo essere compatibili${matchReasons.length > 0 ? ` (${matchReasons.join(", ")})` : ""}. Ti andrebbe di sentirci per capire se possiamo condividere casa?`;

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

  return (
    <form action={formAction} className="mt-5">
      <input type="hidden" name="listingId" value={`roommate-${profileId}`} />
      <input type="hidden" name="listingTitle" value={`Matching coinquilini · ${studyProgram}`} />
      <input type="hidden" name="recipientId" value={recipientId} />
      <input type="hidden" name="recipientName" value={recipientName} />
      <input type="hidden" name="recipientEmail" value={recipientEmail} />
      <input type="hidden" name="content" value={introMessage} />
      <button
        type="submit"
        disabled={isPending}
        className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "Invio intro..." : `Scrivi a ${recipientName.split(" ")[0]}`}
      </button>
    </form>
  );
}

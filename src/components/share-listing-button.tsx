"use client";

import { useCallback, useState } from "react";

interface ShareListingButtonProps {
  listingId: string;
  listingTitle: string;
}

export function ShareListingButton({ listingId, listingTitle }: ShareListingButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/listings/${listingId}`
      : "";

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${listingTitle} — CasaStudente`,
          text: `Dai un'occhiata a questo annuncio su CasaStudente Forlì`,
          url,
        });
        return;
      } catch {
        // User cancelled or not supported, fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — show prompt fallback
      window.prompt("Copia il link manualmente:", url);
    }
  }, [listingId, listingTitle]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
      <span aria-live="polite">{copied ? "Link copiato!" : "Condividi annuncio"}</span>
    </button>
  );
}

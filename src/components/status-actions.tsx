"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, RefreshCcw } from "lucide-react";

interface StatusActionsProps {
  endpointPath: string;
}

export function StatusActions({ endpointPath }: StatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  async function copyEndpoint() {
    if (typeof window === "undefined") return;

    const target = `${window.location.origin}${endpointPath}`;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
      >
        <RefreshCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Aggiornamento..." : "Aggiorna stato"}
      </button>
      <button
        type="button"
        onClick={copyEndpoint}
        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
      >
        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Endpoint copiato" : "Copia endpoint health"}
      </button>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/components/error-boundary";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteErrorFallback
      onRetry={unstable_retry}
      title="Gli annunci non sono disponibili"
      description="C'è stato un problema nel caricamento degli annunci. Riprova o torna alla home."
    />
  );
}

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
      title="Termini di servizio non disponibili"
      description="Non è stato possibile caricare i termini di servizio. Riprova tra qualche istante."
    />
  );
}

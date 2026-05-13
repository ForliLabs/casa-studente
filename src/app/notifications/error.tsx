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
      title="Notifiche non disponibili"
      description="Non è stato possibile caricare le notifiche. Riprova tra qualche istante."
    />
  );
}

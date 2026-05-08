"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/components/error-boundary";
import "./globals.css";

export default function GlobalError({
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
    <html lang="it">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 text-gray-950">
        <RouteErrorFallback onRetry={unstable_retry} />
      </body>
    </html>
  );
}

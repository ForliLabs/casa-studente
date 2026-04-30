"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // SW registration failed silently
        });
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3rd visit
      const visits = Number(localStorage.getItem("cs_visits") || "0") + 1;
      localStorage.setItem("cs_visits", String(visits));
      if (visits >= 3 && !localStorage.getItem("cs_pwa_dismissed")) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any).prompt();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("cs_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-blue-200 bg-white p-4 shadow-xl md:left-auto md:right-6">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-100 p-2.5">
          <Download className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Installa CasaStudente</h3>
          <p className="mt-1 text-sm text-gray-600">
            Accesso rapido dalla home del telefono, notifiche push e navigazione offline.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Installa
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-full px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              Non ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

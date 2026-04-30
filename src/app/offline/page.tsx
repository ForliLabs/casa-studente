import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <WifiOff className="h-16 w-16 text-gray-300" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Sei offline</h1>
      <p className="mt-4 max-w-md text-gray-600">
        Non sei connesso a internet. Puoi comunque consultare gli annunci che hai già visualizzato.
        Le tue azioni (messaggi, salvataggi) verranno sincronizzate quando tornerai online.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/listings"
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Annunci salvati
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Torna alla home
        </Link>
      </div>
    </main>
  );
}

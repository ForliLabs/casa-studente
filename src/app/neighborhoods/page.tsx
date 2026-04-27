import Link from "next/link";
import { neighborhoodStore } from "@/lib/stores/neighborhoods";
import { MapPin, Shield, Users, Volume2 } from "lucide-react";

export default async function NeighborhoodsPage() {
  const neighborhoods = await neighborhoodStore.findAll();

  const noiseLabelIt: Record<string, string> = {
    quiet: "Tranquillo",
    moderate: "Moderato",
    lively: "Vivace",
  };

  const densityLabelIt: Record<string, string> = {
    low: "Bassa",
    medium: "Media",
    high: "Alta",
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quartieri di Forlì</h1>
        <p className="mt-3 text-lg text-gray-600">
          Scopri ogni zona della città con dati su sicurezza, servizi, trasporti e vita studentesca.
        </p>
        <Link
          href="/neighborhoods/quiz"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          🎯 Trova il quartiere ideale per te
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {neighborhoods.map((n) => (
          <Link
            key={n.id}
            href={`/neighborhoods/${n.zone.toLowerCase().replace(/\s+/g, "-")}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{n.name}</h2>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mb-4 text-sm text-gray-600 line-clamp-2">{n.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Sicurezza: {n.safetyRating}/5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-amber-600" />
                <span className="text-gray-700">{noiseLabelIt[n.noiseLevel]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Studenti: {densityLabelIt[n.studentDensity]}</span>
              </div>
              <div>
                <span className="text-gray-700">Affitto medio: <strong>€{n.avgRent}</strong></span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {n.amenities.slice(0, 3).map((a) => (
                <span key={a} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{a}</span>
              ))}
              {n.amenities.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">+{n.amenities.length - 3}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

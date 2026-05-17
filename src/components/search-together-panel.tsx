"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { getSearchTogetherUrl } from "@/lib/actions/search-together";
import { cn } from "@/lib/utils";

interface RoommateForSearch {
  id: string;
  name: string;
  compatibility: number | null;
  budgetMin: number;
  budgetMax: number;
  preferredZones: string[];
}

interface SearchTogetherPanelProps {
  roommates: RoommateForSearch[];
}

export function SearchTogetherPanel({ roommates }: SearchTogetherPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleRoommate(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id); // Max 3 roommates + self = 4
      return next;
    });
    setSearchUrl(null);
    setError(null);
  }

  function handleSearch() {
    if (selected.size === 0) return;
    startTransition(async () => {
      const result = await getSearchTogetherUrl([...selected]);
      if (typeof result === "string") {
        setSearchUrl(result);
        setError(null);
      } else {
        setError(result.error);
        setSearchUrl(null);
      }
    });
  }

  if (roommates.length === 0) return null;

  return (
    <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
        Cerca insieme
      </p>
      <h2 className="mt-2 text-xl font-semibold text-gray-900">
        Trova casa con i tuoi coinquilini
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Seleziona i coinquilini con cui vuoi cercare casa. I budget e le zone preferite verranno
        combinati per trovare annunci adatti a tutti.
      </p>

      <div className="mt-4 space-y-2">
        {roommates.map((rm) => (
          <button
            key={rm.id}
            type="button"
            onClick={() => toggleRoommate(rm.id)}
            aria-pressed={selected.has(rm.id)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
              selected.has(rm.id)
                ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold transition",
                  selected.has(rm.id)
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                )}
              >
                {selected.has(rm.id) ? "✓" : ""}
              </div>
              <div>
                <p className="font-medium">{rm.name}</p>
                <p className="text-xs text-gray-500">
                  €{rm.budgetMin}–{rm.budgetMax} · {rm.preferredZones.slice(0, 2).join(", ")}
                </p>
              </div>
            </div>
            {rm.compatibility !== null && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  rm.compatibility >= 80
                    ? "bg-emerald-100 text-emerald-700"
                    : rm.compatibility >= 60
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                )}
              >
                {rm.compatibility}%
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSearch}
          disabled={selected.size === 0 || isPending}
          className={cn(
            "rounded-xl px-5 py-2.5 text-sm font-semibold transition",
            selected.size > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          )}
        >
          {isPending ? "Elaborazione…" : `Cerca per ${selected.size + 1} persone`}
        </button>

        {searchUrl && (
          <Link
            href={searchUrl}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Vedi {selected.size + 1} risultati combinati →
          </Link>
        )}
      </div>
    </section>
  );
}

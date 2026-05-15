"use client";

import { useMemo, useState } from "react";
import { naturalLanguageSearch } from "@/lib/actions/ai";
import { Search, Sparkles, X } from "lucide-react";

type ExtractedSearchFilters = Record<string, string | number | boolean | string[]>;

interface NaturalLanguageSearchProps {
  onFiltersExtracted?: (filters: ExtractedSearchFilters) => void;
}

export function NaturalLanguageSearch({ onFiltersExtracted }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const presets = useMemo(
    () => [
      "stanza singola vicino al campus sotto 450€ con wifi",
      "bilocale arredato con pagamenti sicuri in centro",
      "monolocale con utenze incluse e tour virtuale",
    ],
    []
  );

  const handleSearch = async (nextQuery = query) => {
    const normalized = nextQuery.trim();
    if (!normalized) return;

    setLoading(true);
    setError(null);
    setQuery(normalized);
    const formData = new FormData();
    formData.set("query", normalized);
    const result = await naturalLanguageSearch(formData);
    setLoading(false);

    if (result && "success" in result && result.success) {
      setInterpretation(result.interpretation || null);
      if (onFiltersExtracted && result.filters) {
        onFiltersExtracted(result.filters as ExtractedSearchFilters);
      }
      return;
    }

    if (result && "error" in result) {
      setError(result.error || "Non siamo riusciti a interpretare la richiesta.");
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Sparkles className="h-4 w-4 text-blue-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Cerca con parole naturali: &quot;monolocale vicino al campus sotto 500€&quot;"
          className="w-full rounded-xl border border-blue-200 bg-blue-50/50 py-3 pl-10 pr-28 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-describedby="nl-search-help"
        />
        {query && !loading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setInterpretation(null);
              setError(null);
            }}
            className="absolute inset-y-2 right-22 flex items-center rounded-md px-2 text-gray-400 transition hover:text-gray-600"
            aria-label="Svuota ricerca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="absolute inset-y-1 right-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {loading ? "..." : "Cerca"}
        </button>
      </div>

      <p id="nl-search-help" className="mt-2 text-xs text-gray-500">
        Usa linguaggio naturale per descrivere zona, budget, sicurezza, arredo e servizi desiderati.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSearch(preset)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {preset}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {interpretation && (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          🤖 {interpretation}
        </p>
      )}
    </div>
  );
}

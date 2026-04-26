"use client";

import { useState } from "react";
import { naturalLanguageSearch } from "@/lib/actions/ai";
import { Search, Sparkles } from "lucide-react";

interface NaturalLanguageSearchProps {
  onFiltersExtracted?: (filters: Record<string, string | number | boolean>) => void;
}

export function NaturalLanguageSearch({ onFiltersExtracted }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.set("query", query);
    const result = await naturalLanguageSearch(formData);
    setLoading(false);

    if (result && "success" in result && result.success) {
      setInterpretation(result.interpretation || null);
      if (onFiltersExtracted && result.filters) {
        onFiltersExtracted(result.filters as Record<string, string | number | boolean>);
      }
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
          className="w-full rounded-xl border border-blue-200 bg-blue-50/50 py-3 pl-10 pr-24 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="absolute inset-y-1 right-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {loading ? "..." : "Cerca"}
        </button>
      </div>
      {interpretation && (
        <p className="mt-2 text-xs text-gray-500">
          🤖 {interpretation}
        </p>
      )}
    </div>
  );
}

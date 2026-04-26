"use client";

import { useState } from "react";
import { generateListingDescription } from "@/lib/actions/ai";
import { Sparkles, Copy, Check } from "lucide-react";

interface AIAssistantProps {
  type?: string;
  zone?: string;
  size?: string;
  price?: string;
  features?: string;
}

export function AIListingAssistant({ type, zone, size, price, features }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [descIt, setDescIt] = useState<string | null>(null);
  const [descEn, setDescEn] = useState<string | null>(null);
  const [copied, setCopied] = useState<"it" | "en" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (type) formData.set("type", type);
    if (zone) formData.set("zone", zone);
    if (size) formData.set("size", size);
    if (price) formData.set("price", price);
    if (features) formData.set("features", features);

    const result = await generateListingDescription(formData);
    setLoading(false);

    if ("error" in result) {
      setError(result.error ?? "Errore sconosciuto");
    } else {
      setDescIt(result.descriptionIt ?? null);
      setDescEn(result.descriptionEn ?? null);
    }
  };

  const copyToClipboard = async (text: string, lang: "it" | "en") => {
    await navigator.clipboard.writeText(text);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">Assistente AI per descrizioni</h3>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mb-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generazione in corso..." : "✨ Genera descrizione IT/EN"}
      </button>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {descIt && (
        <div className="space-y-3">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">🇮🇹 Italiano</span>
              <button
                onClick={() => copyToClipboard(descIt, "it")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
              >
                {copied === "it" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === "it" ? "Copiato!" : "Copia"}
              </button>
            </div>
            <p className="text-sm text-gray-700">{descIt}</p>
          </div>
          {descEn && (
            <div className="rounded-lg bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">🇬🇧 English</span>
                <button
                  onClick={() => copyToClipboard(descEn, "en")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                >
                  {copied === "en" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === "en" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-gray-700">{descEn}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

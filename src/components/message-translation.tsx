"use client";

import { useState, useTransition } from "react";
import { Languages, LoaderCircle } from "lucide-react";
import { translateMessage } from "@/lib/actions/ai";
import { localeLabels, type Locale } from "@/lib/i18n";

interface MessageTranslationProps {
  text: string;
  targetLocale: Locale;
}

export function MessageTranslation({ text, targetLocale }: MessageTranslationProps) {
  const [translation, setTranslation] = useState<{ translatedText: string; sourceLang: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggleTranslation() {
    if (translation) {
      setTranslation(null);
      setError(null);
      return;
    }

    startTransition(async () => {
      setError(null);
      const formData = new FormData();
      formData.set("text", text);
      formData.set("targetLang", targetLocale);

      const result = await translateMessage(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      if (!result?.translatedText) {
        setError("Traduzione non disponibile al momento.");
        return;
      }

      setTranslation({
        translatedText: result.translatedText,
        sourceLang: result.sourceLang ?? "auto",
      });
    });
  }

  return (
    <div className="mt-2 max-w-xl">
      <button
        type="button"
        onClick={handleToggleTranslation}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
        {translation ? "Nascondi traduzione" : `Traduci in ${localeLabels[targetLocale]}`}
      </button>

      {error && (
        <p className="mt-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          {error}
        </p>
      )}

      {translation && (
        <div className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-gray-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Traduzione · {localeLabels[targetLocale]}
          </p>
          <p className="mt-2 whitespace-pre-wrap leading-6">{translation.translatedText}</p>
          <p className="mt-2 text-[11px] text-blue-700/80">
            Lingua origine: {formatSourceLabel(translation.sourceLang)}
          </p>
        </div>
      )}
    </div>
  );
}

function formatSourceLabel(sourceLang: string) {
  if (sourceLang === "auto" || sourceLang === "auto-detected") {
    return "rilevata automaticamente";
  }

  const label = localeLabels[sourceLang as Locale];
  return label ? label : sourceLang.toUpperCase();
}

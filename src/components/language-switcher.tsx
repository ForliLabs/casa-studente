"use client";

import { useState } from "react";
import { type Locale, supportedLocales } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  it: "🇮🇹 Italiano",
  en: "🇬🇧 English",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
};

const localeFlags: Record<Locale, string> = {
  it: "🇮🇹",
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
};

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);

  function switchLocale(locale: Locale) {
    document.cookie = `locale=${locale};path=/;max-age=${365 * 24 * 60 * 60}`;
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
        aria-label="Change language"
      >
        {localeFlags[currentLocale]}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {supportedLocales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                locale === currentLocale ? "font-medium text-blue-700" : "text-gray-700"
              }`}
            >
              {localeLabels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

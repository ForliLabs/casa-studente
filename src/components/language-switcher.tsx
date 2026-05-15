"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type Locale, supportedLocales } from "@/lib/i18n";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";
import { useToast } from "@/components/toast";

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
  const [isPending, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useDismissibleLayer<HTMLDivElement>({
    isOpen: open,
    onDismiss: () => setOpen(false),
    triggerRef: buttonRef,
  });
  const router = useRouter();
  const { showToast } = useToast();

  async function switchLocale(locale: Locale) {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }

    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        throw new Error("Locale non aggiornata");
      }

      setOpen(false);
      showToast(`Lingua aggiornata: ${localeLabels[locale]}`, "success");
      startTransition(() => router.refresh());
    } catch {
      showToast("Non siamo riusciti a cambiare lingua. Riprova.", "error");
    }
  }

  useEffect(() => {
    const button = buttonRef.current;
    if (!open || !button) return;
    button.setAttribute("aria-expanded", "true");
    return () => button.setAttribute("aria-expanded", "false");
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
        aria-label="Cambia lingua"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{localeFlags[currentLocale]}</span>
        <span className="text-xs font-medium uppercase text-gray-500">{currentLocale}</span>
      </button>
      {open && (
        <div ref={menuRef} className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {supportedLocales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchLocale(locale)}
              disabled={isPending}
              className={`w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 disabled:opacity-60 ${
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

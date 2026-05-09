"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/user-menu";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  brand: string;
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  currentLocale: Locale;
  user?: { name: string; email: string; role: string } | null;
}

export function Navbar({ brand, items, ctaLabel, ctaHref, currentLocale, user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useDismissibleLayer<HTMLDivElement>({
    isOpen: open,
    onDismiss: () => setOpen(false),
    triggerRef,
  });

  useEffect(() => {
    if (!open) return;

    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-900">
          {brand}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher currentLocale={currentLocale} />
          {user ? (
            <UserMenu user={user} />
          ) : (
            ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {ctaLabel}
              </Link>
            )
          )}
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Apri menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-navigation"
        ref={menuRef}
        className={cn("border-t border-gray-200 bg-white md:hidden", open ? "block" : "hidden")}
      >
        <div className="space-y-1 px-4 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2.5 text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <LanguageSwitcher currentLocale={currentLocale} />
          </div>
          {user ? (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="px-3 text-sm font-medium text-gray-900">{user.name}</p>
              <p className="px-3 pt-1 text-xs text-gray-500">{user.email}</p>
              <Link
                href="/dashboard"
                className="mt-3 block rounded-xl px-3 py-2.5 text-base font-medium text-gray-700 transition hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="mt-1 block w-full rounded-xl px-3 py-2.5 text-left text-base font-medium text-red-600 transition hover:bg-red-50"
                >
                  Esci
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <Link
                href="/auth/login"
                className="block rounded-xl px-3 py-2.5 text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Accedi
              </Link>
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref}
                  className="mt-2 block rounded-xl bg-blue-600 px-3 py-2.5 text-center text-base font-medium text-white transition hover:bg-blue-700"
                  onClick={() => setOpen(false)}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

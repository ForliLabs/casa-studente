"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface DashboardLayoutProps {
  brand: string;
  sections: SidebarSection[];
  children: ReactNode;
}

export function DashboardShell({ brand, sections, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useDismissibleLayer<HTMLDivElement>({
    isOpen: mobileOpen,
    onDismiss: () => setMobileOpen(false),
    triggerRef,
  });

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close on resize to desktop
  useEffect(() => {
    if (!mobileOpen) return;
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-6 py-4">
            <Link href="/dashboard" className="text-lg font-bold text-gray-900">
              {brand}
            </Link>
            <p className="mt-1 text-sm text-gray-500">Navigazione dashboard organizzata per flusso.</p>
          </div>
          <SidebarNav sections={sections} pathname={pathname} />
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu dashboard"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <Link href="/dashboard" className="text-lg font-bold text-gray-900" onClick={() => setMobileOpen(false)}>
              {brand}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              aria-label="Chiudi menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SidebarNav sections={sections} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile hamburger header */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:bg-gray-50"
              aria-label="Apri menu dashboard"
              aria-expanded={mobileOpen}
              aria-controls="dashboard-mobile-drawer"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">{brand}</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarNav({
  sections,
  pathname,
  onNavigate,
}: {
  sections: SidebarSection[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            {section.label}
          </p>
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className="h-5 w-5">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-gray-500"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}

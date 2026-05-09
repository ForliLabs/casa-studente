"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const allItems = sections.flatMap((section) => section.items);
  const activeSection =
    sections.find((section) =>
      section.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    ) ?? sections[0];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <aside className="hidden w-72 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-6 py-4">
            <Link href="/dashboard" className="text-lg font-bold text-gray-900">
              {brand}
            </Link>
            <p className="mt-1 text-sm text-gray-500">Navigazione dashboard organizzata per flusso.</p>
          </div>
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
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Navigazione dashboard</p>
            <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor="dashboard-route-select">
              Vai a una sezione
            </label>
            <select
              id="dashboard-route-select"
              value={allItems.some((item) => item.href === pathname) ? pathname : activeSection?.items[0]?.href}
              onChange={(event) => router.push(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              {sections.map((section) => (
                <optgroup key={section.label} label={section.label}>
                  {section.items.map((item) => (
                    <option key={item.href} value={item.href}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {activeSection && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeSection.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
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

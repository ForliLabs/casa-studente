import Link from "next/link";
import { Inbox, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageSkeleton({ variant = "default" }: { variant?: "default" | "auth" | "dashboard" | "listings" }) {
  if (variant === "auth") {
    return (
      <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md animate-pulse rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mx-auto h-6 w-40 rounded-full bg-gray-200" />
          <div className="mx-auto mt-3 h-4 w-56 rounded-full bg-gray-100" />
          <div className="mt-8 space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 w-24 rounded-full bg-gray-200" />
                <div className="h-12 rounded-2xl bg-gray-100" />
              </div>
            ))}
            <div className="h-12 rounded-2xl bg-blue-100" />
          </div>
        </div>
      </main>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <aside className="hidden w-72 border-r border-gray-200 bg-white p-4 lg:block">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="h-36 animate-pulse rounded-3xl bg-white shadow-sm" />
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-3xl bg-white shadow-sm" />
              ))}
            </div>
            <div className="h-80 animate-pulse rounded-3xl bg-white shadow-sm" />
          </div>
        </main>
      </div>
    );
  }

  if (variant === "listings") {
    return (
      <main className="flex-1 bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-pulse space-y-4">
            <div className="h-4 w-36 rounded-full bg-blue-100" />
            <div className="h-12 w-full rounded-full bg-gray-200" />
            <div className="h-5 w-3/4 rounded-full bg-gray-100" />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="hidden animate-pulse rounded-3xl bg-white p-6 shadow-sm lg:block">
              <div className="h-6 w-24 rounded-full bg-gray-200" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-12 rounded-2xl bg-gray-100" />
                ))}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="h-44 animate-pulse bg-blue-100" />
                  <div className="space-y-4 p-5">
                    <div className="h-6 rounded-full bg-gray-200" />
                    <div className="h-4 w-2/3 rounded-full bg-gray-100" />
                    <div className="h-12 rounded-2xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-3xl bg-white shadow-sm" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-3xl bg-white shadow-sm lg:col-span-2" />
            <div className="h-64 rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: "search" | "inbox";
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon = "inbox",
  className,
}: EmptyStateProps) {
  const Icon = icon === "search" ? SearchX : Inbox;

  return (
    <div className={cn("rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm", className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>
      {actionLabel && (
        actionHref ? (
          <Link
            href={actionHref}
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

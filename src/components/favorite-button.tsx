"use client";

import { useTransition, useOptimistic } from "react";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  isFavorited: boolean;
  /** Visual size variant */
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({
  listingId,
  isFavorited,
  size = "sm",
  className,
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(isFavorited);
  const { showToast } = useToast();

  function handleToggle() {
    if (isPending) return;
    const formData = new FormData();
    formData.set("listingId", listingId);

    startTransition(async () => {
      // Apply the optimistic update; useOptimistic reverts automatically when
      // the transition completes if the server state has not changed.
      setOptimisticFavorited(!optimisticFavorited);
      const result = await toggleFavoriteAction(formData);
      // On error the optimistic value rolls back to the real isFavorited prop.
      if (result && "error" in result) {
        showToast(result.error, "error");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      aria-label={optimisticFavorited ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      aria-pressed={optimisticFavorited}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        size === "sm" ? "min-h-[44px] min-w-[44px]" : "h-11 w-11",
        optimisticFavorited
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-400",
        isPending && "opacity-60",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={optimisticFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={size === "sm" ? "h-5 w-5" : "h-6 w-6"}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

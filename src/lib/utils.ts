/**
 * Utility functions for Tailwind CSS class merging and date formatting.
 *
 * @module utils
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with conflict resolution.
 *
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (intelligent deduplication of conflicting Tailwind utilities).
 *
 * @param inputs - Class values: strings, arrays, objects, or conditional expressions.
 * @returns A single merged class string with Tailwind conflicts resolved.
 *
 * @example
 * ```tsx
 * <div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
 * // cn("px-4", "px-8") → "px-8" (later value wins)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an `availableFrom` value for human-readable display.
 *
 * - If the value matches an ISO date (YYYY-MM-DD, as returned by `<input
 *   type="date">`), it is formatted using Italian locale conventions.
 * - Legacy free-text strings (e.g. "1 settembre 2026", "Subito") are
 *   returned unchanged so older listings continue to display correctly.
 *
 * @param raw - The raw `availableFrom` string stored on a listing.
 * @returns A human-friendly date string.
 *
 * @example
 * formatAvailableFrom("2026-09-01") // "1 settembre 2026"
 * formatAvailableFrom("Subito")     // "Subito"
 */
export function formatAvailableFrom(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00`);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }
  return raw;
}

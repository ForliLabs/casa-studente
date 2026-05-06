/**
 * Utility functions for Tailwind CSS class merging.
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

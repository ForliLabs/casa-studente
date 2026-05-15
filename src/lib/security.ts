const THREAT_PATTERNS = [
  { label: "script-tag", pattern: /<\s*script\b/i },
  { label: "event-handler", pattern: /on\w+\s*=/i },
  { label: "javascript-protocol", pattern: /javascript\s*:/i },
  { label: "sql-injection", pattern: /(?:union\s+select|drop\s+table|or\s+1=1|--\s*$)/i },
];

export const ALLOWED_UPLOAD_CATEGORIES = ["listing_photo", "document", "evidence", "profile"] as const;

export type UploadCategory = (typeof ALLOWED_UPLOAD_CATEGORIES)[number];

export function sanitizeTextInput(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/javascript\s*:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function detectThreatSignals(value: string): string[] {
  return THREAT_PATTERNS.filter(({ pattern }) => pattern.test(value)).map(({ label }) => label);
}

export function hasThreatSignals(value: string): boolean {
  return detectThreatSignals(value).length > 0;
}

export function isAllowedUploadCategory(category: string): category is UploadCategory {
  return (ALLOWED_UPLOAD_CATEGORIES as readonly string[]).includes(category);
}

export function isSafeIdentifier(value: string): boolean {
  return /^[a-zA-Z0-9:_-]{1,120}$/.test(value);
}

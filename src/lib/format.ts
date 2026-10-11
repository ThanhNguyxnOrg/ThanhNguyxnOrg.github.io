export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Presentation sanitizer for API-verbatim text (descriptions ship inside
 * island props, so they must satisfy the same ASCII gate as visible copy).
 * Dashes become hyphens, emoji/pictographs are removed, spacing collapsed.
 * Raw baked.json stays verbatim as the audit trail.
 */
export function sanitizeText(s: string): string {
  return s
    .replace(/[—–]/g, "-")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

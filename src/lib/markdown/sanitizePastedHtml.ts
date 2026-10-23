const UNSAFE_HTML_PATTERN =
  /<script\b|javascript:|on\w+\s*=|<iframe\b|<object\b|<embed\b/i;

/**
 * Returns true when clipboard HTML should not be pasted as-is into Markdown source.
 * Any rich HTML paste is reduced to plain text; unsafe patterns are stripped.
 */
export function pastedHtmlNeedsSanitization(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) return false;
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) return false;
  return true;
}

export function pastedHtmlIsUnsafe(html: string): boolean {
  return UNSAFE_HTML_PATTERN.test(html);
}

export function plainTextFromClipboard(
  html: string | undefined,
  plain: string | undefined,
): string {
  if (plain?.trim()) return plain;
  if (!html?.trim()) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .trim();
}

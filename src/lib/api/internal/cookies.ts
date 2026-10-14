/** Readable XSRF cookie for admin mutating requests (Phase 5). */
export function getXsrfTokenFromDocument(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)xsrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

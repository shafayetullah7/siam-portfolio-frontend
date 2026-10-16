const DEFAULT_RETURN = "/admin";

/** Post-login redirect: same-origin admin paths only (open-redirect safe). */
export function safeAdminReturnUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.length === 0) return DEFAULT_RETURN;
  if (raw.includes("://") || raw.startsWith("//")) return DEFAULT_RETURN;
  if (!raw.startsWith("/admin")) return DEFAULT_RETURN;
  return raw;
}

/**
 * API client configuration — docs/api-convention.md
 */

export function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE ?? "/api/v1";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/** Paths relative to admin prefix; 401 does not trigger refresh/logout redirect. */
export const adminAuthExcludedPaths = [
  "/auth/check",
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/register",
  "/auth/verify-registration",
  "/auth/resend-registration-otp",
  "/auth/registration-status",
  "/auth/forgot-password",
  "/auth/reset-password",
] as const;

export function isAdminAuthExcludedPath(adminRelativePath: string): boolean {
  const path = adminRelativePath.startsWith("/")
    ? adminRelativePath
    : `/${adminRelativePath}`;
  return adminAuthExcludedPaths.some(
    (excluded) => path === excluded || path.startsWith(`${excluded}/`),
  );
}

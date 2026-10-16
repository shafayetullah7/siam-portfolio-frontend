/**
 * API client configuration — docs/api-convention.md
 */

export const DEFAULT_API_BASE = "http://localhost:5000/api/v1";

export type ApiBaseUrlEnv = {
  base: string | undefined;
  /** When set, SSR uses this origin instead of the host in `base` (rare Docker cases). */
  ssrOrigin: string | undefined;
};

export function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function isAbsoluteUrl(base: string): boolean {
  return base.startsWith("http://") || base.startsWith("https://");
}

/**
 * Resolves the API base URL for browser and SSR.
 * Use a full `http(s)://…/api/v1` in `VITE_API_BASE`; Nest `CORS_ORIGIN` must match the app origin.
 */
export function resolveApiBaseUrl(env: ApiBaseUrlEnv): string {
  const base = trimTrailingSlash(env.base ?? DEFAULT_API_BASE);

  if (isAbsoluteUrl(base)) {
    if (env.ssrOrigin) {
      const origin = trimTrailingSlash(env.ssrOrigin);
      try {
        const path = new URL(base).pathname;
        return `${origin}${path}`;
      } catch {
        return base;
      }
    }
    return base;
  }

  throw new Error(
    `VITE_API_BASE must be a full URL (e.g. ${DEFAULT_API_BASE}), got "${base}". ` +
      "Relative paths require a removed dev proxy; set CORS_ORIGIN on the API to match your app URL.",
  );
}

export function apiBaseUrl(): string {
  return resolveApiBaseUrl({
    base: import.meta.env.VITE_API_BASE,
    ssrOrigin: import.meta.env.VITE_API_SSR_ORIGIN,
  });
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

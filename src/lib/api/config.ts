/**
 * API client configuration — docs/api-convention.md
 */

export type ApiBaseUrlEnv = {
  ssr: boolean;
  base: string | undefined;
  ssrOrigin: string | undefined;
  proxyPort: string | undefined;
};

export function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

/**
 * Resolves the API base URL for browser vs SSR.
 * Browser may use a same-origin path (`/api/v1`) proxied by Vite.
 * Node SSR `fetch` requires an absolute URL — proxy does not apply on the server.
 */
export function resolveApiBaseUrl(env: ApiBaseUrlEnv): string {
  const base = trimTrailingSlash(env.base ?? "/api/v1");

  if (base.startsWith("http://") || base.startsWith("https://")) {
    return base;
  }

  if (!env.ssr) {
    return base;
  }

  const ssrOrigin = trimTrailingSlash(
    env.ssrOrigin ?? `http://localhost:${env.proxyPort ?? "5000"}`,
  );
  const path = base.startsWith("/") ? base : `/${base}`;
  return `${ssrOrigin}${path}`;
}

export function apiBaseUrl(): string {
  return resolveApiBaseUrl({
    ssr: import.meta.env.SSR,
    base: import.meta.env.VITE_API_BASE,
    ssrOrigin: import.meta.env.VITE_API_SSR_ORIGIN,
    proxyPort: import.meta.env.VITE_API_PROXY_PORT,
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

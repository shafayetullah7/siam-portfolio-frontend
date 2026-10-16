import { isPublicAdminAuthPath } from "./publicAdminAuthPaths";

let logoutInFlight: Promise<void> | null = null;

function loginRedirectUrl(): string {
  const params = new URLSearchParams({ reason: "session_expired" });
  const { pathname, search } = window.location;
  if (pathname.startsWith("/admin") && !isPublicAdminAuthPath(pathname)) {
    params.set("returnUrl", pathname + search);
  }
  return `/admin/login?${params.toString()}`;
}

/** Clear admin session and redirect to login (frontend-developer-guide §6). */
export async function forceLogout(): Promise<void> {
  if (typeof window === "undefined") return;
  if (logoutInFlight) return logoutInFlight;

  logoutInFlight = (async () => {
    try {
      const { adminAuthApi } = await import(
        "../api/endpoints/admin/auth.api"
      );
      await adminAuthApi.logout();
    } catch {
      // Best-effort logout
    }
    const { adminSession } = await import("./adminSession");
    adminSession.clear();
    if (window.location.pathname.startsWith("/admin")) {
      window.location.replace(loginRedirectUrl());
    }
  })().finally(() => {
    logoutInFlight = null;
  });

  return logoutInFlight;
}

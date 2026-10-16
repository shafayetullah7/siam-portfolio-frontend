import { apiBaseUrl } from "../api/config";
import { executeRequest } from "../api/internal/request";

let logoutInFlight: Promise<void> | null = null;

/** Clear admin session and redirect to login (Phase 5 wires auth store). */
export async function forceLogout(): Promise<void> {
  if (typeof window === "undefined") return;
  if (logoutInFlight) return logoutInFlight;

  logoutInFlight = (async () => {
    try {
      await executeRequest<void>({
        method: "POST",
        path: "/auth/logout",
        baseUrl: apiBaseUrl(),
        prefix: "/admin",
        credentials: "include",
        unwrap: true,
      });
    } catch {
      // Best-effort logout
    }
    const { adminSession } = await import("./adminSession");
    adminSession.clear();
    // Login page shows banner when reason=session_expired (frontend-developer-guide §6.4).
    const login = "/admin/login?reason=session_expired";
    if (window.location.pathname.startsWith("/admin")) {
      window.location.replace(login);
    }
  })().finally(() => {
    logoutInFlight = null;
  });

  return logoutInFlight;
}

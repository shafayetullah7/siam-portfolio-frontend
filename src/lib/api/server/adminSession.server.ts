import { apiBaseUrl } from "../config";
import { executeRequest } from "../internal/request";
import { ApiError } from "../types";
import type { AdminProfile } from "../types/admin.types";

/** SSR-only: forward browser cookies to GET /admin/auth/check. */
export async function fetchAdminSession(
  cookieHeader: string | null,
): Promise<AdminProfile | null> {
  const headers: Record<string, string> = {};
  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  try {
    return await executeRequest<AdminProfile>({
      method: "GET",
      path: "/auth/check",
      baseUrl: apiBaseUrl(),
      prefix: "/admin",
      headers,
      credentials: "omit",
      unwrap: true,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return null;
    }
    throw error;
  }
}

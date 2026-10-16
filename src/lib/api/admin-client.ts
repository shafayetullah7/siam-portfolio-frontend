import { apiBaseUrl, isAdminAuthExcludedPath } from "./config";
import { getXsrfTokenFromDocument } from "./internal/cookies";
import { executeRequest, type RequestConfig, type ResponseType } from "./internal/request";
import { forceLogout } from "../auth/forceLogout";
import { ApiError } from "./types";

const ADMIN_PREFIX = "/admin";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export interface AdminClientOptions {
  params?: RequestConfig["params"];
  unwrap?: boolean;
  headers?: Record<string, string>;
  responseType?: ResponseType;
  strictAuth?: boolean;
  skipAuthHandler?: boolean;
  authRefreshRetried?: boolean;
  csrfRetried?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      await executeRequest<void>({
        method: "POST",
        path: "/auth/refresh",
        baseUrl: apiBaseUrl(),
        prefix: ADMIN_PREFIX,
        credentials: "include",
        unwrap: true,
      });
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function withCsrf(
  method: string,
  headers: Record<string, string>,
): Record<string, string> {
  if (!MUTATING.has(method)) return headers;
  const token = getXsrfTokenFromDocument();
  if (!token) return headers;
  return { ...headers, "X-XSRF-TOKEN": token };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: AdminClientOptions = {},
): Promise<T> {
  const strictAuth = options.strictAuth ?? true;
  const headers = withCsrf(method, options.headers ?? {});

  try {
    return await executeRequest<T>({
      method,
      path,
      body,
      baseUrl: apiBaseUrl(),
      prefix: ADMIN_PREFIX,
      params: options.params,
      unwrap: options.unwrap,
      headers,
      credentials: "include",
      responseType: options.responseType,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 403 &&
      MUTATING.has(method) &&
      !options.csrfRetried &&
      getXsrfTokenFromDocument()
    ) {
      return request<T>(method, path, body, {
        ...options,
        csrfRetried: true,
      });
    }

    if (
      !(error instanceof ApiError) ||
      error.status !== 401 ||
      options.skipAuthHandler ||
      !strictAuth ||
      isAdminAuthExcludedPath(path) ||
      options.authRefreshRetried
    ) {
      throw error;
    }

    const refreshed = await tryRefreshSession();
    if (!refreshed) {
      await forceLogout();
      throw error;
    }

    return request<T>(method, path, body, {
      ...options,
      authRefreshRetried: true,
    });
  }
}

export const adminClient = {
  get: <T>(path: string, options?: AdminClientOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: AdminClientOptions) =>
    request<T>("POST", path, body, options),

  put: <T>(path: string, body?: unknown, options?: AdminClientOptions) =>
    request<T>("PUT", path, body, options),

  patch: <T>(path: string, body?: unknown, options?: AdminClientOptions) =>
    request<T>("PATCH", path, body, options),

  delete: <T>(path: string, options?: AdminClientOptions) =>
    request<T>("DELETE", path, undefined, options),
};

import { apiBaseUrl } from "./config";
import { executeRequest, type RequestConfig, type ResponseType } from "./internal/request";

const PUBLIC_PREFIX = "/public";

export interface PublicClientOptions {
  params?: RequestConfig["params"];
  unwrap?: boolean;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  responseType?: ResponseType;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: PublicClientOptions = {},
): Promise<T> {
  return executeRequest<T>({
    method,
    path,
    body,
    baseUrl: apiBaseUrl(),
    prefix: PUBLIC_PREFIX,
    params: options.params,
    unwrap: options.unwrap,
    headers: options.headers,
    credentials: options.credentials ?? "omit",
    responseType: options.responseType,
  });
}

export const publicClient = {
  get: <T>(path: string, options?: PublicClientOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: PublicClientOptions) =>
    request<T>("POST", path, body, options),
};

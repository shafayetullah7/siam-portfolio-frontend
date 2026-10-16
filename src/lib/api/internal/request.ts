import { ApiError, type ApiFailure, type ApiSuccess } from "../types";

export type ResponseType = "json" | "text" | "blob";

export interface RequestConfig {
  method: string;
  path: string;
  baseUrl: string;
  prefix: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  unwrap?: boolean;
  responseType?: ResponseType;
}

function buildUrl(
  baseUrl: string,
  prefix: string,
  path: string,
  params?: RequestConfig["params"],
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${prefix}${normalizedPath}`;
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

function isEnvelope<T>(body: unknown): body is ApiSuccess<T> | ApiFailure {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    typeof (body as ApiSuccess<T>).success === "boolean"
  );
}

export async function executeRequest<T>(config: RequestConfig): Promise<T> {
  const url = buildUrl(
    config.baseUrl,
    config.prefix,
    config.path,
    config.params,
  );

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...config.headers,
  };

  let body: BodyInit | undefined;
  if (config.body !== undefined && config.body !== null) {
    if (config.body instanceof FormData) {
      body = config.body;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(config.body);
    }
  }

  const response = await fetch(url, {
    method: config.method,
    headers,
    body,
    credentials: config.credentials ?? "same-origin",
  });

  const responseType = config.responseType ?? "json";

  if (responseType === "blob") {
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }
    return (await response.blob()) as T;
  }

  if (responseType === "text") {
    const text = await response.text();
    if (!response.ok) {
      throw new ApiError(text || response.statusText, response.status);
    }
    return text as T;
  }

  let parsed: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      if (!response.ok) {
        throw new ApiError(response.statusText, response.status, text);
      }
      const trimmed = text.trimStart().toLowerCase();
      const looksHtml =
        trimmed.startsWith("<!doctype") || trimmed.startsWith("<html");
      const hint = looksHtml
        ? " Expected API JSON but got HTML — check VITE_API_BASE points at Nest, API is running, and CORS_ORIGIN matches your app origin."
        : "";
      throw new ApiError(`Invalid JSON response.${hint}`, response.status, text);
    }
  }

  if (!response.ok) {
    const failure = isEnvelope(parsed) && !parsed.success
      ? parsed
      : undefined;
    const message =
      failure?.message ??
      (typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : response.statusText);
    throw new ApiError(message, response.status, failure ?? parsed);
  }

  const unwrap = config.unwrap ?? true;
  if (!unwrap) {
    return parsed as T;
  }

  if (isEnvelope<T>(parsed) && parsed.success) {
    return parsed.data;
  }

  return parsed as T;
}

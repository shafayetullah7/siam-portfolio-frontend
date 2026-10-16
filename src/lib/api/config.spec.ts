import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "./config";

describe("resolveApiBaseUrl", () => {
  it("returns relative base in the browser", () => {
    expect(
      resolveApiBaseUrl({
        ssr: false,
        base: "/api/v1",
        ssrOrigin: undefined,
        proxyPort: undefined,
      }),
    ).toBe("/api/v1");
  });

  it("strips trailing slash from relative base in the browser", () => {
    expect(
      resolveApiBaseUrl({
        ssr: false,
        base: "/api/v1/",
        ssrOrigin: undefined,
        proxyPort: undefined,
      }),
    ).toBe("/api/v1");
  });

  it("builds absolute URL on SSR with default port", () => {
    expect(
      resolveApiBaseUrl({
        ssr: true,
        base: "/api/v1",
        ssrOrigin: undefined,
        proxyPort: undefined,
      }),
    ).toBe("http://localhost:5000/api/v1");
  });

  it("uses VITE_API_PROXY_PORT on SSR when origin is omitted", () => {
    expect(
      resolveApiBaseUrl({
        ssr: true,
        base: "/api/v1",
        ssrOrigin: undefined,
        proxyPort: "4001",
      }),
    ).toBe("http://localhost:4001/api/v1");
  });

  it("uses explicit SSR origin", () => {
    expect(
      resolveApiBaseUrl({
        ssr: true,
        base: "/api/v1",
        ssrOrigin: "http://api.internal",
        proxyPort: "5000",
      }),
    ).toBe("http://api.internal/api/v1");
  });

  it("returns full https base unchanged on SSR", () => {
    expect(
      resolveApiBaseUrl({
        ssr: true,
        base: "https://example.com/api/v1",
        ssrOrigin: undefined,
        proxyPort: undefined,
      }),
    ).toBe("https://example.com/api/v1");
  });

  it("defaults base when env base is undefined", () => {
    expect(
      resolveApiBaseUrl({
        ssr: false,
        base: undefined,
        ssrOrigin: undefined,
        proxyPort: undefined,
      }),
    ).toBe("/api/v1");
  });
});

import { describe, expect, it } from "vitest";
import { DEFAULT_API_BASE, resolveApiBaseUrl } from "./config";

describe("resolveApiBaseUrl", () => {
  it("returns full base in the browser", () => {
    expect(
      resolveApiBaseUrl({
        base: "http://localhost:5000/api/v1",
        ssrOrigin: undefined,
      }),
    ).toBe("http://localhost:5000/api/v1");
  });

  it("strips trailing slash from full base", () => {
    expect(
      resolveApiBaseUrl({
        base: "http://localhost:5000/api/v1/",
        ssrOrigin: undefined,
      }),
    ).toBe("http://localhost:5000/api/v1");
  });

  it("returns full https base unchanged", () => {
    expect(
      resolveApiBaseUrl({
        base: "https://example.com/api/v1",
        ssrOrigin: undefined,
      }),
    ).toBe("https://example.com/api/v1");
  });

  it("defaults when env base is undefined", () => {
    expect(
      resolveApiBaseUrl({
        base: undefined,
        ssrOrigin: undefined,
      }),
    ).toBe(DEFAULT_API_BASE);
  });

  it("uses SSR origin override with full base pathname", () => {
    expect(
      resolveApiBaseUrl({
        base: "http://localhost:5000/api/v1",
        ssrOrigin: "http://api.internal",
      }),
    ).toBe("http://api.internal/api/v1");
  });

  it("throws on relative base", () => {
    expect(() =>
      resolveApiBaseUrl({
        base: "/api/v1",
        ssrOrigin: undefined,
      }),
    ).toThrow(/full URL/);
  });
});

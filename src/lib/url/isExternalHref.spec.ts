import { describe, expect, it } from "vitest";
import { isExternalHref } from "./isExternalHref";

describe("isExternalHref", () => {
  it("returns true for http and https URLs", () => {
    expect(isExternalHref("https://example.org/paper")).toBe(true);
    expect(isExternalHref("http://example.org")).toBe(true);
    expect(isExternalHref("HTTPS://Example.ORG")).toBe(true);
  });

  it("returns false for internal paths and other schemes", () => {
    expect(isExternalHref("/about")).toBe(false);
    expect(isExternalHref("#section")).toBe(false);
    expect(isExternalHref("mailto:a@b.c")).toBe(false);
  });
});

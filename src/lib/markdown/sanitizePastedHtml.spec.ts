import { describe, expect, it } from "vitest";
import {
  pastedHtmlIsUnsafe,
  pastedHtmlNeedsSanitization,
  plainTextFromClipboard,
} from "./sanitizePastedHtml";

describe("sanitizePastedHtml", () => {
  it("detects rich HTML paste", () => {
    expect(pastedHtmlNeedsSanitization("<p>Hi</p>")).toBe(true);
    expect(pastedHtmlNeedsSanitization("plain")).toBe(false);
  });

  it("flags unsafe HTML", () => {
    expect(pastedHtmlIsUnsafe('<script>alert(1)</script>')).toBe(true);
    expect(pastedHtmlIsUnsafe("<p>ok</p>")).toBe(false);
  });

  it("prefers plain text from clipboard", () => {
    expect(plainTextFromClipboard("<p>x</p>", "hello")).toBe("hello");
  });
});

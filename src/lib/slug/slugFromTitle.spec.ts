import { describe, expect, it } from "vitest";
import { slugFromTitle } from "./slugFromTitle";

describe("slugFromTitle", () => {
  it("lowercases and hyphenates", () => {
    expect(slugFromTitle("Interpretable ML")).toBe("interpretable-ml");
  });

  it("strips punctuation", () => {
    expect(slugFromTitle("Hello, World!")).toBe("hello-world");
  });

  it("returns empty for whitespace-only", () => {
    expect(slugFromTitle("   ")).toBe("");
  });

  it("collapses multiple separators", () => {
    expect(slugFromTitle("a   b---c")).toBe("a-b-c");
  });
});

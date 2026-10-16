import { describe, expect, it } from "vitest";
import { homeContent } from "./home.content";
import type { HomePageContent } from "./home.types";
import {
  assertHomeContentBounds,
  hasValidMetricClaim,
  validateHomeContentBounds,
} from "./home.validation";

describe("home.validation", () => {
  it("default homeContent passes bounds", () => {
    expect(() => assertHomeContentBounds(homeContent)).not.toThrow();
    expect(validateHomeContentBounds(homeContent)).toEqual([]);
  });

  it("rejects researchFocus with 2 items", () => {
    const bad: HomePageContent = {
      ...homeContent,
      researchFocus: homeContent.researchFocus!.slice(0, 2),
    };
    const errors = validateHomeContentBounds(bad);
    expect(errors.some((e) => e.includes("researchFocus"))).toBe(true);
  });

  it("rejects metric highlight without source", () => {
    expect(
      hasValidMetricClaim({
        text: "Over 1,234 citations on this topic",
      }),
    ).toBe(false);
    expect(
      hasValidMetricClaim({
        text: "Over 1,234 citations on this topic",
        sourceUrl: "https://scholar.google.com/",
        asOfDate: "2026-10-01",
      }),
    ).toBe(true);
  });

  it("flags invalid highlights in content bounds", () => {
    const bad: HomePageContent = {
      ...homeContent,
      highlights: [{ text: "1,234 citations and growing" }],
    };
    expect(validateHomeContentBounds(bad).length).toBeGreaterThan(0);
  });
});

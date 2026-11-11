import { describe, expect, it } from "vitest";
import { homeContent } from "./home.content";
import type { HomePageContent } from "./home.types";
import {
  assertHomeContentBounds,
  hasValidMetricClaim,
  listVisibleSectionIds,
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
      researchFocus: [
        { title: "A", description: "a", href: "/research/a" },
        { title: "B", description: "b", href: "/research/b" },
      ],
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

  it("listVisibleSectionIds respects cmsSectionIds order and skips empty sections", () => {
    const cms: HomePageContent = {
      ...homeContent,
      cmsSectionIds: [
        "hero",
        "featuredProjects",
        "researchFocus",
        "highlights",
      ],
      featuredProjects: [
        { title: "P1", summary: "s", href: "/projects/p1" },
        { title: "P2", summary: "s", href: "/projects/p2" },
      ],
      researchFocus: [
        { title: "A", description: "a", href: "/r/a" },
        { title: "B", description: "b", href: "/r/b" },
        { title: "C", description: "c", href: "/r/c" },
      ],
      highlights: undefined,
    };
    const ids = listVisibleSectionIds(cms);
    expect(ids).toEqual(["hero", "featuredProjects", "researchFocus"]);
    expect(ids.includes("highlights")).toBe(false);
  });

  it("cms layout omits section even when static data exists on content", () => {
    const cms: HomePageContent = {
      ...homeContent,
      cmsSectionIds: ["hero", "researchFocus"],
      researchFocus: [
        { title: "A", description: "a", href: "/r/a" },
        { title: "B", description: "b", href: "/r/b" },
        { title: "C", description: "c", href: "/r/c" },
      ],
      highlights: [{ text: "Sample highlight for layout test" }],
    };
    expect(listVisibleSectionIds(cms)).toEqual(["hero", "researchFocus"]);
  });

  it("flags invalid highlights in content bounds", () => {
    const bad: HomePageContent = {
      ...homeContent,
      highlights: [{ text: "1,234 citations and growing" }],
    };
    expect(validateHomeContentBounds(bad).length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import {
  applyResearchListFilters,
  shouldGroupByStatus,
  shouldShowStatusFilters,
  shouldShowTagFilters,
} from "./public-research-list";
import type { ResearchThemeCardPublic } from "~/lib/api/types/research.types";

function card(
  overrides: Partial<ResearchThemeCardPublic> & { slug: string },
): ResearchThemeCardPublic {
  return {
    title: overrides.title ?? overrides.slug,
    summary: "S",
    themeStatus: overrides.themeStatus ?? "ongoing",
    tags: overrides.tags ?? null,
    href: `/research/${overrides.slug}`,
    ...overrides,
  };
}

describe("public-research-list", () => {
  it("shows status filters when enough themes and both statuses", () => {
    const cards = [
      card({ slug: "a", themeStatus: "ongoing" }),
      card({ slug: "b", themeStatus: "ongoing" }),
      card({ slug: "c", themeStatus: "ongoing" }),
      card({ slug: "d", themeStatus: "completed" }),
    ];
    expect(shouldShowStatusFilters(cards)).toBe(true);
    expect(shouldGroupByStatus(cards)).toBe(true);
  });

  it("hides status filters when only one status", () => {
    const cards = [
      card({ slug: "a" }),
      card({ slug: "b" }),
      card({ slug: "c" }),
      card({ slug: "d" }),
    ];
    expect(shouldShowStatusFilters(cards)).toBe(false);
  });

  it("shows tag filters when enough themes and tags", () => {
    const cards = Array.from({ length: 6 }, (_, i) =>
      card({
        slug: `t${i}`,
        tags: i % 2 === 0 ? ["ml"] : ["nlp"],
      }),
    );
    expect(shouldShowTagFilters(cards)).toBe(true);
  });

  it("filters by status and tag", () => {
    const cards = [
      card({ slug: "a", themeStatus: "ongoing", tags: ["ml"] }),
      card({ slug: "b", themeStatus: "completed", tags: ["ml"] }),
    ];
    const filtered = applyResearchListFilters(cards, "ongoing", "ml");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe("a");
  });
});

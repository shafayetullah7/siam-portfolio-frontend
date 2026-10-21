import { describe, expect, it } from "vitest";
import {
  getProject,
  getPublication,
  getResearchTheme,
  listCatalogSitemapPaths,
  validateCatalogFeaturedBounds,
} from "./catalog";

describe("catalog", () => {
  it("returns undefined for unknown slugs", () => {
    expect(getResearchTheme("not-a-theme")).toBeUndefined();
    expect(getPublication("not-a-paper")).toBeUndefined();
    expect(getProject("not-a-project")).toBeUndefined();
  });

  it("resolves known slugs", () => {
    expect(getResearchTheme("interpretable-representation-learning")?.title).toMatch(
      /Interpretable/i,
    );
  });

  it("featured bounds pass for seed data", () => {
    expect(validateCatalogFeaturedBounds()).toEqual([]);
  });

  it("includes hub paths in sitemap list (research details from API)", () => {
    const paths = listCatalogSitemapPaths();
    expect(paths).toContain("/research");
    expect(paths).toContain("/publications");
    expect(paths).toContain("/projects");
    expect(paths).toContain("/research");
    expect(paths.some((p) => p.startsWith("/research/"))).toBe(false);
  });
});

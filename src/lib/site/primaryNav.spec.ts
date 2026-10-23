import { describe, expect, it } from "vitest";
import { HOME_SECTION_DOM_IDS } from "./homeSectionIds";
import {
  buildFooterNavItems,
  buildPrimaryNavItems,
  isPrimaryNavActive,
  PUBLIC_FOCUS_NAV,
} from "./primaryNav";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: null,
  footerText: null,
  faviconUrl: null,
  nav: [
    { id: "1", label: "About", path: "/about", sortOrder: 0, visible: true },
    { id: "2", label: "Research dup", path: "/research", sortOrder: 1, visible: true },
    { id: "3", label: "Draft", path: "/pages/draft", sortOrder: 2, visible: true },
  ],
  sitemapPaths: ["/", "/about"],
};

describe("primaryNav", () => {
  it("orders hubs, focus, then cms", () => {
    const labels = buildPrimaryNavItems(mockSite).map((i) => i.label);
    expect(labels).toEqual([
      "Research",
      "Publications",
      "Projects",
      "Focus",
      "About",
    ]);
  });

  it("dedupes cms hub paths", () => {
    const items = buildPrimaryNavItems(mockSite);
    expect(items.filter((i) => i.href === "/research")).toHaveLength(1);
    expect(items.find((i) => i.label === "Research dup")).toBeUndefined();
  });

  it("returns hubs and focus when site is null", () => {
    expect(buildPrimaryNavItems(null).map((i) => i.label)).toEqual([
      "Research",
      "Publications",
      "Projects",
      "Focus",
    ]);
  });

  it("focus href matches currently-working-on section id", () => {
    expect(PUBLIC_FOCUS_NAV.href).toBe(
      `/#${HOME_SECTION_DOM_IDS.currentlyWorkingOn}`,
    );
  });

  it("active state for hub prefix and focus hash", () => {
    const research = buildPrimaryNavItems(null)[0]!;
    expect(isPrimaryNavActive("/research", "", research)).toBe(true);
    expect(isPrimaryNavActive("/research/foo", "", research)).toBe(true);
    expect(isPrimaryNavActive("/publications", "", research)).toBe(false);

    const focus = PUBLIC_FOCUS_NAV;
    expect(isPrimaryNavActive("/", "#currently-working-on", focus)).toBe(true);
    expect(isPrimaryNavActive("/about", "#currently-working-on", focus)).toBe(false);
  });

  it("footer nav omits focus", () => {
    const footer = buildFooterNavItems(mockSite);
    expect(footer.some((i) => i.kind === "focus")).toBe(false);
    expect(footer.map((i) => i.label)).toEqual([
      "Research",
      "Publications",
      "Projects",
      "About",
    ]);
  });

  it("includes Writing hub when sitemap lists /writing", () => {
    const siteWithWriting = {
      ...mockSite,
      sitemapPaths: ["/", "/about", "/writing"],
    };
    const labels = buildPrimaryNavItems(siteWithWriting).map((i) => i.label);
    expect(labels).toContain("Writing");
    expect(labels.indexOf("Writing")).toBeLessThan(labels.indexOf("Focus"));
  });

  it("omits Writing hub when sitemap has no /writing", () => {
    expect(
      buildPrimaryNavItems(mockSite).map((i) => i.label),
    ).not.toContain("Writing");
  });
});

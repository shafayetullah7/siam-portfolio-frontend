import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ResearchThemeDetail from "./[slug]";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockDetail = {
  slug: "live-theme",
  title: "Live theme",
  summary: "Summary",
  themeStatus: "ongoing" as const,
  tags: null,
  problem: "Problem text",
  seo: { title: "Live theme", description: "Summary" },
};

let themeResult: typeof mockDetail | null = null;

vi.mock("@solidjs/router", () => ({
  createAsync: () => () => themeResult,
  useParams: () => ({ slug: "live-theme" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicResearchTheme: () => Promise.resolve(themeResult),
}));

describe("ResearchThemeDetail route", () => {
  it("shows not found when API returns null", () => {
    themeResult = null;
    render(() => (
      <MetaProvider>
        <ResearchThemeDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: /Theme not found/i })).toBeTruthy();
  });

  it("renders theme title from API", () => {
    themeResult = mockDetail;
    render(() => (
      <MetaProvider>
        <ResearchThemeDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { level: 1, name: "Live theme" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Problem" })).toBeTruthy();
  });

  it("renders theme status and last updated in meta", () => {
    themeResult = {
      ...mockDetail,
      tags: ["Safety", "Interpretability"],
      updatedAt: "2026-10-01",
    };
    render(() => (
      <MetaProvider>
        <ResearchThemeDetail />
      </MetaProvider>
    ));
    expect(screen.getByText("ongoing")).toBeTruthy();
    expect(screen.getByText("Safety · Interpretability")).toBeTruthy();
    expect(screen.getByText(/Last updated October 1, 2026/)).toBeTruthy();
  });

  it("renders prev/next theme links when API provides slugs", () => {
    themeResult = {
      ...mockDetail,
      prevSlug: "first-theme",
      nextSlug: "third-theme",
    };
    render(() => (
      <MetaProvider>
        <ResearchThemeDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("link", { name: /Previous theme/i }).getAttribute("href")).toBe(
      "/research/first-theme",
    );
    expect(screen.getByRole("link", { name: /Next theme/i }).getAttribute("href")).toBe(
      "/research/third-theme",
    );
  });
});

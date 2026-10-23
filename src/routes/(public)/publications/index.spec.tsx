import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import PublicationsIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockList = {
  items: [
    {
      slug: "from-api",
      title: "From API List",
      authorsShort: "Author B",
      year: 2025,
      venue: "ICML",
      publicationType: "conference" as const,
      featured: false,
      href: "/publications/from-api",
      availability: "publisher_link" as const,
    },
  ],
  meta: {
    page: 1,
    limit: 24,
    itemCount: 1,
    total: 1,
    totalPages: 1,
  },
};

const mockThemes = {
  intro: null,
  items: [{ slug: "theme-a", title: "Theme A", summary: "", themeStatus: "ongoing" as const, href: "/research/theme-a" }],
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    if (key.includes("getPublicResearchThemes")) {
      return () => mockThemes;
    }
    return () => mockList;
  },
  useSearchParams: () => [{}, vi.fn()],
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicResearchThemes: () => Promise.resolve(mockThemes),
  getPublicPublications: () => Promise.resolve(mockList),
}));

describe("PublicationsIndex route", () => {
  it("renders publications from public API with total count", () => {
    render(() => (
      <MetaProvider>
        <PublicationsIndex />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { level: 1, name: /Publications/i })).toBeTruthy();
    expect(screen.getByText("From API List")).toBeTruthy();
    expect(screen.getByText("1 publication")).toBeTruthy();
  });
});

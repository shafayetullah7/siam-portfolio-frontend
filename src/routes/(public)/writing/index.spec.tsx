import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import WritingIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/writing"],
  footerText: "",
};

const featuredCard = {
  slug: "featured-essay",
  title: "Featured Essay",
  summary: "Featured summary",
  href: "/writing/featured-essay",
  featuredOnHub: true,
  readingTimeMinutes: 5,
};

const gridCard = {
  slug: "other-essay",
  title: "Other Essay",
  summary: "Other summary",
  href: "/writing/other-essay",
  readingTimeMinutes: 3,
};

const mockMainList = {
  intro: null,
  items: [gridCard],
  meta: { page: 1, limit: 24, total: 1 },
};

const mockFeaturedList = {
  intro: null,
  items: [featuredCard],
  meta: { page: 1, limit: 1, total: 1 },
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    if (key.includes("featuredOnHub")) {
      return () => mockFeaturedList;
    }
    return () => mockMainList;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicWriting: (params?: { featuredOnHub?: boolean }) =>
    Promise.resolve(
      params?.featuredOnHub ? mockFeaturedList : mockMainList,
    ),
}));

describe("WritingIndex route", () => {
  it("renders featured article and grid from API", () => {
    render(() => (
      <MetaProvider>
        <WritingIndex />
      </MetaProvider>
    ));

    expect(screen.getByRole("heading", { name: "Writing" })).toBeTruthy();
    expect(screen.getByText("Featured Essay")).toBeTruthy();
    expect(screen.getByText("Other Essay")).toBeTruthy();
  });
});

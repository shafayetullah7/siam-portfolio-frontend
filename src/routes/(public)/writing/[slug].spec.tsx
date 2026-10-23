import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { WritingPublicDetail } from "~/lib/api/types/writing.types";
import WritingArticleDetail from "./[slug]";

const mockSite = {
  siteName: "SIAM Lab",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/writing"],
  footerText: "",
};

const mockDetail: WritingPublicDetail = {
  slug: "live-essay",
  title: "Live Essay",
  summary: "Summary from API.",
  href: "/writing/live-essay",
  body: "# Heading\n\nParagraph.",
  readingTimeMinutes: 4,
  related: {
    articles: [],
    publications: [],
    projects: [],
    themes: [],
  },
};

let detailResult: WritingPublicDetail | null | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => detailResult;
  },
  useParams: () => ({ slug: "live-essay" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicWritingBySlug: () => Promise.resolve(detailResult),
}));

describe("WritingArticleDetail route", () => {
  it("shows not found when API returns null", () => {
    detailResult = null;
    render(() => (
      <MetaProvider>
        <WritingArticleDetail />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { name: /Article not found/i }),
    ).toBeTruthy();
  });

  it("renders title and reading time when detail loads", () => {
    detailResult = mockDetail;
    render(() => (
      <MetaProvider>
        <WritingArticleDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: "Live Essay" })).toBeTruthy();
    expect(screen.getByText("4 min read")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeTruthy();
  });
});

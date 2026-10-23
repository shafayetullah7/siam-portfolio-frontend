import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { PublicationPublicDetail } from "~/lib/api/types/publication.types";
import PublicationDetail from "./[slug]";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockDetail: PublicationPublicDetail = {
  slug: "live-paper",
  title: "Live Paper",
  authorsShort: "Author A",
  year: 2024,
  venue: "NeurIPS",
  publicationType: "conference",
  peerReviewed: true,
  abstract: "Abstract from API.",
  seoTitle: "SEO Paper Title",
  href: "/publications/live-paper",
  availability: "publisher_link",
};

let detailResult: PublicationPublicDetail | null | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => detailResult;
  },
  useParams: () => ({ slug: "live-paper" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicPublicationBySlug: () => Promise.resolve(detailResult),
}));

describe("PublicationDetail route", () => {
  it("shows not found when API returns null", () => {
    detailResult = null;
    render(() => (
      <MetaProvider>
        <PublicationDetail />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { name: /Publication not found/i }),
    ).toBeTruthy();
  });

  it("renders title and abstract from API", () => {
    detailResult = mockDetail;
    render(() => (
      <MetaProvider>
        <PublicationDetail />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { level: 1, name: "Live Paper" }),
    ).toBeTruthy();
    expect(screen.getByText("Abstract from API.")).toBeTruthy();
  });
});

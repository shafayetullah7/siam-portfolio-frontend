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

vi.mock("@solidjs/router", () => ({
  createAsync: () => () => mockSite,
  useParams: () => ({ slug: "bogus-slug-xyz" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
}));

describe("ResearchThemeDetail route", () => {
  it("shows not found for unknown slug", () => {
    render(() => (
      <MetaProvider>
        <ResearchThemeDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: /Theme not found/i })).toBeTruthy();
  });
});

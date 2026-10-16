import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { listResearchThemes } from "~/content";
import ResearchIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

vi.mock("@solidjs/router", () => ({
  createAsync: () => () => mockSite,
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
}));

describe("ResearchIndex route", () => {
  it("renders heading and theme count", () => {
    render(() => (
      <MetaProvider>
        <ResearchIndex />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { level: 1, name: /Research themes/i })).toBeTruthy();
    expect(
      screen.getByText(`${listResearchThemes().length} themes in catalog`),
    ).toBeTruthy();
  });
});

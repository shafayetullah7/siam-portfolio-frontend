import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ResearchIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockHub = {
  intro: "Hub intro from API",
  items: [
    {
      slug: "live-theme",
      title: "Published theme",
      summary: "Summary",
      themeStatus: "ongoing" as const,
      tags: ["ml"],
      href: "/research/live-theme",
    },
  ],
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => mockHub;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicResearchThemes: () => Promise.resolve(mockHub),
}));

describe("ResearchIndex route", () => {
  it("renders heading and theme from API", () => {
    render(() => (
      <MetaProvider>
        <ResearchIndex />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { level: 1, name: /Research themes/i })).toBeTruthy();
    expect(screen.getByText("Published theme")).toBeTruthy();
  });
});

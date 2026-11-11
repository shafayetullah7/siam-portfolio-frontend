import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { homeContent } from "~/content";
import type { PublicHomePayload } from "~/lib/api/endpoints/public/site.api";
import Home from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockHome: PublicHomePayload = {
  published: true,
  visibleSectionIds: ["hero", "researchFocus"],
  heroTitle: null,
  heroSubtitle: null,
  hero: {
    name: "Ada Lovelace",
    descriptor: "Researcher",
    positioning: "Trustworthy ML.",
    primaryCta: { label: "Explore research", href: "/research" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
  },
  researchFocus: [
    {
      title: "Live theme",
      description: "From API",
      href: "/research/live",
    },
    {
      title: "Theme B",
      description: "B",
      href: "/research/b",
    },
    {
      title: "Theme C",
      description: "C",
      href: "/research/c",
    },
  ],
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => mockHome;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicHome: () => Promise.resolve(mockHome),
}));

describe("Home route", () => {
  it("renders published hero and CMS sections without static placeholder", () => {
    render(() => (
      <MetaProvider>
        <Home />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { level: 1, name: "Ada Lovelace" }),
    ).toBeTruthy();
    expect(screen.getByText("Live theme")).toBeTruthy();
    expect(screen.queryByText(homeContent.hero.name)).toBeNull();
  });
});

import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { homeContent, listVisibleSectionIds, type HomePageContent } from "~/content";
import LandingPage from "./LandingPage";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; "aria-label"?: string }) => (
    <a href={props.href} aria-label={props["aria-label"]}>{props.children}</a>
  ),
  query: (fn: () => unknown) => fn,
}));

vi.mock("~/lib/site/PublicSiteProvider", () => ({
  usePublicSite: () => ({
    site: () => ({ siteName: "SIAM", footerText: "", nav: [], sitemapPaths: [] }),
  }),
}));

function expectedHomeH2Count(content: HomePageContent): number {
  const ids = listVisibleSectionIds(content);
  let count = 0;
  if (ids.includes("researchFocus")) count += 1;
  if (ids.includes("selectedPublications")) count += 1;
  if (ids.includes("featuredProjects")) count += 1;
  if (ids.includes("highlights")) count += 1;
  if (ids.includes("currentlyWorkingOn")) count += 1;
  if (ids.includes("collaborationCta")) count += 1;
  return count;
}

const apiMappedContent: HomePageContent = {
  cmsSectionIds: ["hero", "researchFocus"],
  hero: {
    name: "API Hero",
    descriptor: "D",
    positioning: "P",
    portrait: {
      src: "https://cdn.example/hero.jpg",
      alt: "API Hero portrait",
    },
    primaryCta: { label: "Explore research", href: "/research" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
  },
  researchFocus: [
    { title: "Focus A", description: "a", href: "/r/a" },
    { title: "Focus B", description: "b", href: "/r/b" },
    { title: "Focus C", description: "c", href: "/r/c" },
  ],
};

describe("LandingPage", () => {
  it("renders mapped API fixture with CMS section count", () => {
    render(() => <LandingPage content={apiMappedContent} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "API Hero" }),
    ).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBe(
      expectedHomeH2Count(apiMappedContent),
    );
  });

  it("renders hero name and section headings from static content", () => {
    render(() => <LandingPage content={homeContent} />);

    expect(
      screen.getByRole("heading", { level: 1, name: homeContent.hero.name }),
    ).toBeTruthy();
    expect(screen.queryAllByRole("heading", { level: 2 }).length).toBe(
      expectedHomeH2Count(homeContent),
    );
    expect(screen.getByRole("link", { name: "Explore research" }).getAttribute("href")).toBe(
      "/research",
    );
    expect(screen.queryByText("Scholar ledger")).toBeNull();
  });

  it("renders hero portrait from API-mapped content", () => {
    render(() => <LandingPage content={apiMappedContent} />);
    expect(screen.getByRole("img", { name: "API Hero portrait" })).toBeTruthy();
  });
});

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

describe("LandingPage", () => {
  it("renders hero name and section headings from static content", () => {
    render(() => <LandingPage content={homeContent} />);

    expect(
      screen.getByRole("heading", { level: 1, name: homeContent.hero.name }),
    ).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBe(
      expectedHomeH2Count(homeContent),
    );
    expect(document.getElementById("affiliation")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Explore research" }).getAttribute("href")).toBe(
      "/research",
    );
  });
});

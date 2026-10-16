import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { homeContent, listVisibleSectionIds, type HomePageContent } from "~/content";
import LandingPage from "./LandingPage";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; "aria-label"?: string }) => (
    <a href={props.href} aria-label={props["aria-label"]}>{props.children}</a>
  ),
}));

function expectedHomeH2Count(content: HomePageContent): number {
  return listVisibleSectionIds(content).filter(
    (id) => id !== "hero" && id !== "affiliation",
  ).length;
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
    expect(screen.getByRole("link", { name: "View research" }).getAttribute("href")).toBe(
      "/#research-focus",
    );
  });
});

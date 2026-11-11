import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import HomeFeaturedSummaryPanel from "./HomeFeaturedSummaryPanel";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

const summary = {
  caps: { research: 6, publications: 4, projects: 3 },
  research: [
    {
      id: "r1",
      slug: "theme-a",
      title: "Theme A",
      publishStatus: "draft",
      kind: "research" as const,
      appearsOnPublicHome: false,
    },
  ],
  publications: [],
  projects: [],
};

describe("HomeFeaturedSummaryPanel", () => {
  it("shows cap count and draft warning", () => {
    render(() => <HomeFeaturedSummaryPanel summary={summary} />);
    expect(screen.getByText(/Research focus \(1\/6\)/)).toBeTruthy();
    expect(screen.getByText("Omitted on /")).toBeTruthy();
    const link = screen.getByRole("link", { name: "Theme A" });
    expect(link.getAttribute("href")).toBe("/admin/research/r1");
  });
});

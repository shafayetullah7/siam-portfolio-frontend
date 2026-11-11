import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));
import ResearchThemeDetailContent from "./ResearchThemeDetailContent";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";

const baseTheme: ResearchThemeDetailPublic = {
  slug: "x",
  title: "Title",
  summary: "Summary",
  themeStatus: "ongoing",
  tags: null,
  problem: "Problem text",
  seo: { title: "Title", description: "Summary" },
};

describe("ResearchThemeDetailContent", () => {
  it("renders problem section when problem is set", () => {
    render(() => <ResearchThemeDetailContent theme={baseTheme} />);
    expect(screen.getByRole("heading", { name: "Problem" })).toBeTruthy();
    expect(screen.getByText("Problem text")).toBeTruthy();
  });

  it("omits significance when empty", () => {
    render(() => <ResearchThemeDetailContent theme={baseTheme} />);
    expect(screen.queryByRole("heading", { name: "Significance" })).toBeNull();
  });

  it("renders resources when present", () => {
    render(() => (
      <ResearchThemeDetailContent
        theme={{
          ...baseTheme,
          resources: [
            {
              label: "Dataset",
              url: "https://example.com/data",
              resourceType: "data",
            },
          ],
        }}
      />
    ));
    expect(screen.getByRole("heading", { name: "Resources" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dataset" })).toBeTruthy();
  });

  it("hides resources section when empty", () => {
    render(() => <ResearchThemeDetailContent theme={baseTheme} />);
    expect(screen.queryByRole("heading", { name: "Resources" })).toBeNull();
  });

  it("renders related talks with links to talk detail", () => {
    render(() => (
      <ResearchThemeDetailContent
        theme={{
          ...baseTheme,
          related: {
            publications: [],
            projects: [],
            talks: [
              {
                slug: "my-talk",
                title: "My Talk",
                eventName: "Conf 2026",
                startsAt: "2026-06-15T14:30:00.000Z",
                talkType: "invited_talk",
              },
            ],
          },
        }}
      />
    ));
    expect(
      screen.getByRole("heading", { name: "Related talks" }),
    ).toBeTruthy();
    const link = screen.getByRole("link", { name: "My Talk" });
    expect(link.getAttribute("href")).toBe("/talks/my-talk");
    expect(screen.getByText("Conf 2026")).toBeTruthy();
  });
});

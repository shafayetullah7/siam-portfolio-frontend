import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
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
});

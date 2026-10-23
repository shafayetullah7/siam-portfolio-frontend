import { describe, expect, it } from "vitest";
import {
  extractArticleHeadings,
  shouldShowArticleToc,
} from "./articleHeadings";

describe("articleHeadings", () => {
  it("extracts h2 and h3 in order", () => {
    const md = "## Intro\n\n### Detail\n\n## Outro";
    const headings = extractArticleHeadings(md);
    expect(headings.map((h) => h.text)).toEqual(["Intro", "Detail", "Outro"]);
    expect(headings[0].id).toBe("intro");
  });

  it("shows TOC when four or more headings", () => {
    const md = "## A\n## B\n## C\n## D";
    expect(shouldShowArticleToc(100, md)).toBe(true);
  });

  it("shows TOC when word count is at least 1200", () => {
    expect(shouldShowArticleToc(1200, "## Only one")).toBe(true);
  });
});

import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import WritingArticleRelatedSection from "./WritingArticleRelatedSection";

describe("WritingArticleRelatedSection", () => {
  it("renders nothing when all related lists are empty", () => {
    const { container } = render(() => (
      <WritingArticleRelatedSection
        related={{
          articles: [],
          publications: [],
          projects: [],
          themes: [],
        }}
      />
    ));
    expect(container.querySelector("section")).toBeNull();
  });

  it("renders publication links when present", () => {
    const { getByText } = render(() => (
      <WritingArticleRelatedSection
        related={{
          articles: [],
          publications: [
            {
              slug: "paper",
              title: "My Paper",
              authorsShort: "A. Author",
              year: 2024,
              venue: "Venue",
              publicationType: "journal",
              featured: false,
              href: "/publications/paper",
              availability: "open",
            },
          ],
          projects: [],
          themes: [],
        }}
      />
    ));
    expect(getByText("My Paper")).toBeTruthy();
  });
});

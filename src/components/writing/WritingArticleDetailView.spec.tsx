import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { WritingPublicDetail } from "~/lib/api/types/writing.types";
import WritingArticleDetailView from "./WritingArticleDetailView";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

const baseDetail: WritingPublicDetail = {
  slug: "essay",
  title: "Essay",
  summary: "Summary",
  href: "/writing/essay",
  body: "## Section\n\nBody text.",
  related: {
    articles: [],
    publications: [],
    projects: [],
    themes: [],
  },
};

describe("WritingArticleDetailView", () => {
  it("renders markdown heading in the body", () => {
    render(() => (
      <WritingArticleDetailView
        detail={baseDetail}
        backHref="/writing"
        backLabel="All writing"
      />
    ));
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeTruthy();
    expect(screen.getByText("Body text.")).toBeTruthy();
  });

  it("uses defaultAuthor when byline is empty", () => {
    render(() => (
      <WritingArticleDetailView
        detail={baseDetail}
        backHref="/writing"
        backLabel="All writing"
        defaultAuthor="SIAM Lab"
      />
    ));
    expect(screen.getByText("SIAM Lab")).toBeTruthy();
  });
});

import { describe, expect, it } from "vitest";
import { renderArticleMarkdown } from "./renderArticleMarkdown";

describe("renderArticleMarkdown", () => {
  it("renders headings and strips script tags", () => {
    const html = renderArticleMarkdown(
      "# Hello\n\n<script>alert(1)</script>\n\n- one",
    );
    expect(html).toContain("<h1");
    expect(html.toLowerCase()).toContain("hello");
    expect(html).toContain("<li");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
  });

  it("preserves fenced code as pre/code", () => {
    const html = renderArticleMarkdown("```\nconst x = 1;\n```");
    expect(html).toContain("<pre");
    expect(html).toContain("const x = 1");
  });

  it("renders GFM tables", () => {
    const html = renderArticleMarkdown("|a|b|\n|---|---|\n|1|2|");
    expect(html).toContain("<table");
    expect(html).toContain("<td");
  });

  it("renders display math with KaTeX", () => {
    const html = renderArticleMarkdown("$$\nx^2\n$$");
    expect(html).toContain("katex");
  });
});

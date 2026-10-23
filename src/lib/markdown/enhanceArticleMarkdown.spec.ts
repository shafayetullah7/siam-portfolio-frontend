import { describe, expect, it } from "vitest";
import { enhanceArticleMarkdown } from "./enhanceArticleMarkdown";

describe("enhanceArticleMarkdown", () => {
  it("wraps pre blocks with a copy button", () => {
    const root = document.createElement("div");
    root.innerHTML = "<pre><code>const x = 1;</code></pre>";
    enhanceArticleMarkdown(root);
    expect(root.querySelector(".article-code-block")).toBeTruthy();
    expect(
      root.querySelector('button[aria-label="Copy code to clipboard"]'),
    ).toBeTruthy();
  });

  it("is idempotent on second run", () => {
    const root = document.createElement("div");
    root.innerHTML = "<pre><code>a</code></pre>";
    enhanceArticleMarkdown(root);
    enhanceArticleMarkdown(root);
    expect(root.querySelectorAll(".article-code-block").length).toBe(1);
  });
});

import { renderArticleMarkdown } from "./renderArticleMarkdown";

/** @deprecated Use `renderArticleMarkdown` (WRIT9). */
export function renderBasicArticleMarkdown(markdown: string): string {
  return renderArticleMarkdown(markdown);
}

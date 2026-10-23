/**
 * Article Markdown → safe HTML (GFM subset, KaTeX math).
 * Store Markdown in the API; render HTML only in the frontend at read time.
 * Do not rely on raw HTML in source — it is stripped by `rehype-sanitize`.
 */
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { articleMarkdownSanitizeSchema } from "./articleMarkdownSanitizeSchema";

const articleMarkdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeSanitize, articleMarkdownSanitizeSchema)
  .use(rehypeStringify);

export function renderArticleMarkdown(markdown: string): string {
  if (!markdown) return "";
  return String(articleMarkdownProcessor.processSync(markdown));
}

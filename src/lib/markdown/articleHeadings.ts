export type ArticleHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractArticleHeadings(markdown: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();
  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;
    const base = slugifyHeading(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ depth, text, id });
  }
  return headings;
}

export function shouldShowArticleToc(
  wordCount: number | null | undefined,
  markdown: string,
): boolean {
  const headings = extractArticleHeadings(markdown);
  const h2h3 = headings.length;
  return (wordCount ?? 0) >= 1200 || h2h3 >= 4;
}

export function injectHeadingIds(html: string, markdown: string): string {
  const headings = extractArticleHeadings(markdown);
  if (headings.length === 0) return html;
  let index = 0;
  return html.replace(/<h([23])>([^<]*)<\/h[23]>/g, (_match, depth, inner) => {
    const entry = headings[index];
    index += 1;
    const id = entry?.id ?? slugifyHeading(String(inner));
    return `<h${depth} id="${id}">${inner}</h${depth}>`;
  });
}

import { createEffect, createMemo, onMount } from "solid-js";
import { enhanceArticleMarkdown } from "~/lib/markdown/enhanceArticleMarkdown";
import { renderArticleMarkdown } from "~/lib/markdown/renderArticleMarkdown";

export type ArticleMarkdownBodyProps = {
  markdown: string;
};

let katexCssLoaded = false;

function loadKatexCss(): void {
  if (katexCssLoaded || typeof document === "undefined") return;
  katexCssLoaded = true;
  void import("katex/dist/katex.min.css");
}

export default function ArticleMarkdownBody(props: ArticleMarkdownBodyProps) {
  let containerRef: HTMLDivElement | undefined;

  const html = createMemo(() => renderArticleMarkdown(props.markdown ?? ""));

  onMount(() => {
    loadKatexCss();
  });

  createEffect(() => {
    html();
    enhanceArticleMarkdown(containerRef);
  });

  return (
    <div
      ref={(el) => {
        containerRef = el;
      }}
      class="siam-prose article-markdown max-w-none text-ink"
      innerHTML={html()}
    />
  );
}

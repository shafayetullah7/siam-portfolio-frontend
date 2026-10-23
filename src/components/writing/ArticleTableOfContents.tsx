import { For, Show } from "solid-js";
import {
  extractArticleHeadings,
  shouldShowArticleToc,
} from "~/lib/markdown/articleHeadings";

export type ArticleTableOfContentsProps = {
  markdown: string;
  wordCount?: number | null;
};

export default function ArticleTableOfContents(props: ArticleTableOfContentsProps) {
  const headings = () => extractArticleHeadings(props.markdown);
  const visible = () =>
    shouldShowArticleToc(props.wordCount, props.markdown) &&
    headings().length > 0;

  return (
    <Show when={visible()}>
      <nav
        class="mb-8 rounded-lg border border-border bg-surface-container-lowest p-4 lg:sticky lg:top-6"
        aria-label="Table of contents"
      >
        <h2 class="text-sm font-semibold text-ink">On this page</h2>
        <ol class="mt-2 list-none space-y-1 p-0 text-sm">
          <For each={headings()}>
            {(heading) => (
              <li
                classList={{
                  "pl-0": heading.depth === 2,
                  "pl-3": heading.depth === 3,
                }}
              >
                <a
                  href={`#${heading.id}`}
                  class="text-ink-muted no-underline hover:text-ink hover:underline"
                >
                  {heading.text}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
}

import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import EmptyState from "~/components/EmptyState";
import WritingArticleCard from "~/components/writing/WritingArticleCard";
import WritingFeaturedArticle from "~/components/writing/WritingFeaturedArticle";
import type { WritingPublicCard } from "~/lib/api/types/writing.types";
export type WritingArticlePublicListProps = {
  featuredItem?: WritingPublicCard | null;
  items: WritingPublicCard[];
};

export default function WritingArticlePublicList(
  props: WritingArticlePublicListProps,
) {
  const featured = createMemo(() => props.featuredItem ?? null);
  const hasAny = createMemo(
    () => (featured() != null) || props.items.length > 0,
  );

  return (
    <Show
      when={hasAny()}
      fallback={
        <EmptyState
          variant="list"
          title="No articles published yet"
          description="Published writing will appear here when articles go live."
        >
          <div class="flex flex-wrap justify-center gap-2">
            <A href="/research" class="siam-btn-secondary no-underline">
              Research
            </A>
            <A href="/publications" class="siam-btn-secondary no-underline">
              Publications
            </A>
          </div>
        </EmptyState>
      }
    >
      <Show when={featured()}>
        {(item) => (
          <div class="mb-10">
            <WritingFeaturedArticle item={item()} />
          </div>
        )}
      </Show>
      <Show when={props.items.length > 0}>
        <section aria-labelledby="all-articles-heading">
          <h2
            id="all-articles-heading"
            class="mb-4 text-lg font-semibold text-brand-deep"
          >
            {featured() ? "More articles" : "Articles"}
          </h2>
          <ul
            class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            <For each={props.items}>
              {(item) => (
                <li>
                  <WritingArticleCard item={item} />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>
    </Show>
  );
}

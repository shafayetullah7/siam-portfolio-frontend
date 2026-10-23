import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { WritingPublicCard } from "~/lib/api/types/writing.types";

export type WritingFeaturedArticleProps = {
  item: WritingPublicCard;
};

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export default function WritingFeaturedArticle(props: WritingFeaturedArticleProps) {
  const item = () => props.item;
  const displayDate = () =>
    formatDate(
      item().materiallyUpdatedAt ?? item().publishedAt ?? item().updatedAt,
    );

  return (
    <section
      class="overflow-hidden rounded-xl bg-accent-writing text-accent-writing-ink"
      aria-labelledby="featured-article-heading"
    >
      <div class="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div class="flex flex-col justify-center">
          <p class="text-xs font-medium uppercase tracking-wider opacity-80">
            Featured
          </p>
          <h2
            id="featured-article-heading"
            class="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {item().title}
          </h2>
          <p class="mt-3 text-sm opacity-90 md:text-base">{item().summary}</p>
          <div class="mt-3 flex flex-wrap gap-3 text-sm opacity-80">
            <Show when={item().readingTimeMinutes != null}>
              <span>{item().readingTimeMinutes} min read</span>
            </Show>
            <Show when={displayDate()}>
              <span>{displayDate()}</span>
            </Show>
          </div>
          <Show when={item().tags && item().tags!.length > 0}>
            <div class="mt-3 flex flex-wrap gap-2">
              <For each={item().tags}>
                {(tag) => (
                  <span class="rounded bg-white/40 px-2 py-0.5 font-mono text-xs">
                    {tag}
                  </span>
                )}
              </For>
            </div>
          </Show>
          <A
            href={item().href}
            class="mt-6 inline-flex w-fit rounded-md bg-brand-deep px-4 py-2 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Read article
          </A>
        </div>
        <Show
          when={item().coverUrl && (item().coverAlt?.trim() ?? "") !== ""}
        >
          <div class="overflow-hidden rounded-lg">
            <img
              src={item().coverUrl!}
              alt={item().coverAlt!.trim()}
              class="size-full max-h-64 object-cover md:max-h-none"
            />
          </div>
        </Show>
      </div>
    </section>
  );
}

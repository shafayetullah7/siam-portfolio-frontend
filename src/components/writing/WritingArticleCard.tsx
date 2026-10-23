import { For, Show } from "solid-js";
import LandingContentLink from "~/components/landing/LandingContentLink";
import type { WritingPublicCard } from "~/lib/api/types/writing.types";
import { ChevronRight } from "~/icons";

export type WritingArticleCardProps = {
  item: WritingPublicCard;
};

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export default function WritingArticleCard(props: WritingArticleCardProps) {
  const { item } = props;
  const displayDate = () =>
    formatDate(item.materiallyUpdatedAt ?? item.publishedAt ?? item.updatedAt);

  return (
    <LandingContentLink
      href={item.href}
      ariaLabel={`Read article: ${item.title}`}
      class="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md no-underline"
    >
      <Show
        when={item.coverUrl && (item.coverAlt?.trim() ?? "") !== ""}
      >
        <div class="-mx-5 -mt-5 mb-4 aspect-[16/10] overflow-hidden bg-surface-muted">
          <img
            src={item.coverUrl!}
            alt={item.coverAlt!.trim()}
            loading="lazy"
            decoding="async"
            class="size-full object-cover"
          />
        </div>
      </Show>
      <h3 class="siam-headline-md mb-2 font-medium text-brand-deep">{item.title}</h3>
      <p class="mb-3 flex-1 text-sm text-on-surface-variant line-clamp-3">
        {item.summary}
      </p>
      <div class="mt-auto flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <Show when={item.readingTimeMinutes != null}>
          <span>{item.readingTimeMinutes} min read</span>
        </Show>
        <Show when={displayDate()}>
          <span>{displayDate()}</span>
        </Show>
      </div>
      <Show when={item.tags && item.tags.length > 0}>
        <div class="mt-2 flex flex-wrap gap-1">
          <For each={item.tags!.slice(0, 4)}>
            {(tag) => (
              <span class="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-primary">
                {tag}
              </span>
            )}
          </For>
        </div>
      </Show>
      <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Read
        <ChevronRight class="size-4" aria-hidden="true" />
      </span>
    </LandingContentLink>
  );
}

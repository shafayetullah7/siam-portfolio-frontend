import { For, Show } from "solid-js";
import EmptyState from "~/components/EmptyState";
import PublicationHighlightList from "~/components/landing/PublicationHighlightList";
import type { PublicationPublicCard } from "~/lib/api/types/publication.types";
import { publicationPublicCardToHomeItem } from "~/lib/publications/publication-card-mapper";

export type PublicationCatalogListProps = {
  items: readonly PublicationPublicCard[];
  groupByYear?: boolean;
  hasActiveFilters?: boolean;
};

function groupItemsByYear(
  items: readonly PublicationPublicCard[],
): { year: number; items: PublicationPublicCard[] }[] {
  const groups = new Map<number, PublicationPublicCard[]>();
  for (const item of items) {
    const bucket = groups.get(item.year) ?? [];
    bucket.push(item);
    groups.set(item.year, bucket);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearItems]) => ({ year, items: yearItems }));
}

export default function PublicationCatalogList(props: PublicationCatalogListProps) {
  const items = () => props.items;
  const count = () => items().length;
  const highlightItems = () =>
    items().map((card) => publicationPublicCardToHomeItem(card));
  const yearGroups = () => groupItemsByYear(items());

  return (
    <Show
      when={count() > 0}
      fallback={
        <EmptyState
          variant="list"
          title={props.hasActiveFilters ? "No matching publications" : "No publications yet"}
          description={
            props.hasActiveFilters
              ? "Try clearing filters or broadening your search."
              : "Published papers and preprints will appear here once they are live on the site."
          }
        />
      }
    >
      <div class="flex flex-col gap-5">
        <Show
          when={props.groupByYear}
          fallback={
            <div
              class="flex flex-col divide-y divide-surface-container overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
            >
              <PublicationHighlightList items={highlightItems()} />
            </div>
          }
        >
          <div class="flex flex-col gap-6">
            <For each={yearGroups()}>
              {(group) => (
                <section>
                  <h2 class="mb-3 font-mono text-sm font-semibold text-ink-muted">
                    {group.year}
                  </h2>
                  <div
                    class="flex flex-col divide-y divide-surface-container overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
                  >
                    <PublicationHighlightList
                      items={group.items.map((card) =>
                        publicationPublicCardToHomeItem(card),
                      )}
                    />
                  </div>
                </section>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
}

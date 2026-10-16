import { listPublications, publicationToHomeItem } from "~/content";
import PublicationHighlightList from "~/components/landing/PublicationHighlightList";

export type PublicationCatalogListProps = {
  showFilterChip?: boolean;
};

export default function PublicationCatalogList(props: PublicationCatalogListProps) {
  const items = listPublications().map(publicationToHomeItem);
  const count = items.length;

  return (
    <div class="flex flex-col gap-5">
      {props.showFilterChip && (
        <div
          class="flex flex-wrap items-center gap-1.5 self-start rounded-xl bg-surface-container p-1"
          role="group"
          aria-label="Publication filters (static)"
        >
          <span
            class="rounded-lg bg-surface-container-lowest px-3 py-1 font-mono text-xs font-semibold text-primary shadow-sm"
          >
            All ({count})
          </span>
        </div>
      )}
      <div
        class="flex flex-col divide-y divide-surface-container overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
      >
        <PublicationHighlightList items={items} />
      </div>
    </div>
  );
}

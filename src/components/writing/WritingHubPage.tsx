import { For, Show } from "solid-js";
import WritingArticlePublicList from "~/components/writing/WritingArticlePublicList";
import WritingSeriesSection from "~/components/writing/WritingSeriesSection";
import type {
  WritingPublicCard,
  WritingPublicSeriesSection,
} from "~/lib/api/types/writing.types";
import type { PaginationMeta } from "~/lib/api/types";

export type WritingHubPageProps = {
  featuredItem?: WritingPublicCard | null;
  seriesSections?: WritingPublicSeriesSection[];
  items: WritingPublicCard[];
  meta: PaginationMeta;
  hasActiveFilters?: boolean;
  showSeriesSections?: boolean;
};

export default function WritingHubPage(props: WritingHubPageProps) {
  const showSections = () =>
    props.showSeriesSections &&
    props.seriesSections &&
    props.seriesSections.length > 0;

  return (
    <div class="flex flex-col gap-6">
      <p class="font-mono text-xs text-on-surface-variant">
        {props.meta.total}{" "}
        {props.meta.total === 1 ? "article" : "articles"}
        {props.hasActiveFilters ? " matching filters" : ""}
      </p>
      <Show when={showSections()}>
        <For each={props.seriesSections}>
          {(section) => <WritingSeriesSection section={section} />}
        </For>
      </Show>
      <WritingArticlePublicList
        featuredItem={props.featuredItem}
        items={props.items}
        hasActiveFilters={props.hasActiveFilters}
      />
    </div>
  );
}

import { Show } from "solid-js";
import WritingArticlePublicList from "~/components/writing/WritingArticlePublicList";
import type { WritingPublicCard } from "~/lib/api/types/writing.types";
import type { PaginationMeta } from "~/lib/api/types";

export type WritingHubPageProps = {
  featuredItem?: WritingPublicCard | null;
  items: WritingPublicCard[];
  meta: PaginationMeta;
};

export default function WritingHubPage(props: WritingHubPageProps) {
  return (
    <div class="flex flex-col gap-6">
      <p class="font-mono text-xs text-on-surface-variant">
        {props.meta.total}{" "}
        {props.meta.total === 1 ? "article" : "articles"}
      </p>
      <WritingArticlePublicList
        featuredItem={props.featuredItem}
        items={props.items}
      />
    </div>
  );
}

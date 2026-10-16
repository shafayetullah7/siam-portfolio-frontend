import { For } from "solid-js";
import type { HomePublicationHighlight } from "~/content";
import PublicationHighlightRow from "./PublicationHighlightRow";

export type PublicationHighlightListProps = {
  items: readonly HomePublicationHighlight[];
};

export default function PublicationHighlightList(props: PublicationHighlightListProps) {
  return (
    <div class="border-t border-border">
      <For each={props.items}>
        {(item) => <PublicationHighlightRow item={item} />}
      </For>
    </div>
  );
}

import { For } from "solid-js";
import type { HomeResearchFocusItem } from "~/content";
import ResearchFocusCard from "./ResearchFocusCard";

export type ResearchFocusGridProps = {
  items: readonly HomeResearchFocusItem[];
};

export default function ResearchFocusGrid(props: ResearchFocusGridProps) {
  return (
    <ul class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <For each={props.items}>
        {(item, index) => (
          <li>
            <ResearchFocusCard item={item} themeIndex={index() + 1} />
          </li>
        )}
      </For>
    </ul>
  );
}

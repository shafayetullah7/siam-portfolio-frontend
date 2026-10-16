import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { HomeResearchFocusItem } from "~/content";
import { ChevronRight } from "~/icons";

export type ResearchFocusCardProps = {
  item: HomeResearchFocusItem;
  themeIndex: number;
};

export default function ResearchFocusCard(props: ResearchFocusCardProps) {
  const { item } = props;
  const themeLabel = () =>
    `THEME ${String(props.themeIndex).padStart(2, "0")}`;

  return (
    <A
      href={item.href}
      aria-label={`Research area: ${item.title}`}
      class="group relative flex h-full flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md no-underline"
    >
      <div class="flex flex-col">
        <div class="mb-3 flex items-center justify-between">
          <span
            class="rounded bg-surface-container-high px-2 py-0.5 font-mono text-xs font-medium text-primary"
          >
            {themeLabel()}
          </span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
            aria-hidden="true"
          >
            <span class="text-sm font-semibold">{props.themeIndex}</span>
          </div>
        </div>
        <h3 class="siam-headline-md mb-2 font-medium text-brand-deep group-hover:text-primary">
          {item.title}
        </h3>
        <p class="mb-4 text-sm leading-relaxed text-on-surface-variant">{item.description}</p>
        <Show when={item.tags && item.tags.length > 0}>
          <ul class="mb-4 flex flex-wrap gap-1.5" role="list">
            <For each={item.tags}>
              {(tag) => (
                <li>
                  <span
                    class="rounded-full bg-surface-container-low px-2 py-0.5 font-mono text-[11px] text-secondary"
                  >
                    {tag}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
      <span
        class="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2"
      >
        {item.linkLabel ?? "Explore theme"}
        <ChevronRight class="size-4" aria-hidden="true" />
      </span>
    </A>
  );
}

import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import WritingArticleCard from "~/components/writing/WritingArticleCard";
import type { WritingPublicSeriesSection } from "~/lib/api/types/writing.types";

export type WritingSeriesSectionProps = {
  section: WritingPublicSeriesSection;
};

export default function WritingSeriesSection(props: WritingSeriesSectionProps) {
  return (
    <section class="mb-10" aria-labelledby={`series-${props.section.slug}`}>
      <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id={`series-${props.section.slug}`}
          class="text-lg font-semibold text-brand-deep"
        >
          {props.section.title}
        </h2>
        <A
          href={`/writing?series=${encodeURIComponent(props.section.slug)}`}
          class="text-sm font-medium text-link no-underline hover:underline"
        >
          View series →
        </A>
      </div>
      <Show when={props.section.summary?.trim()}>
        <p class="mb-4 max-w-3xl text-sm text-ink-muted">{props.section.summary}</p>
      </Show>
      <ul
        class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        <For each={props.section.items}>
          {(item) => (
            <li>
              <WritingArticleCard item={item} />
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

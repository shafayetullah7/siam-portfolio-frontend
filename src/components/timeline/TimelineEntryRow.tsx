import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { TimelinePublicCard } from "~/lib/api/types/timeline.types";
import { formatTimelineDateRange } from "~/lib/timeline/format-timeline-dates";

export type TimelineEntryRowProps = {
  card: TimelinePublicCard;
};

export default function TimelineEntryRow(props: TimelineEntryRowProps) {
  const c = () => props.card;
  const thumb = () =>
    [...c().images].sort((a, b) => a.sortOrder - b.sortOrder)[0];

  const content = (
    <div class="rounded-lg border border-border bg-surface-container-lowest p-4">
      <div class="flex flex-wrap items-center gap-2">
        <h4 class="text-base font-semibold text-ink">{c().title}</h4>
        <Show when={c().isCurrent === true}>
          <span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Current
          </span>
        </Show>
      </div>
      <Show when={c().subtitle}>
        <p class="mt-1 text-sm text-ink-muted">{c().subtitle}</p>
      </Show>
      <Show when={c().organization}>
        <p class="mt-1 text-sm text-ink">{c().organization}</p>
      </Show>
      <Show when={c().location}>
        <p class="mt-0.5 text-sm text-ink-muted">{c().location}</p>
      </Show>
      <p class="mt-2 text-sm text-ink-muted">
        {formatTimelineDateRange(c().startDate, c().endDate, c().isOngoing)}
      </p>
      <Show when={c().summary?.trim()}>
        <p class="mt-3 whitespace-pre-wrap text-sm text-ink-muted">
          {c().summary}
        </p>
      </Show>
      <Show when={thumb()}>
        {(img) => (
          <img
            src={img().url}
            alt={img().alt}
            class="mt-3 h-16 w-16 rounded-md object-cover"
          />
        )}
      </Show>
    </div>
  );

  return (
    <Show when={c().href} fallback={content}>
      {(href) => (
        <A href={href()} class="block no-underline text-inherit">
          {content}
        </A>
      )}
    </Show>
  );
}

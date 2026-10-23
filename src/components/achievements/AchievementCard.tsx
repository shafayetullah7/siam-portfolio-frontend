import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { TimelinePublicCard } from "~/lib/api/types/timeline.types";
import { isCertificationExpired } from "~/lib/timeline/achievements-hub";
import { formatTimelineDateRange } from "~/lib/timeline/format-timeline-dates";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type AchievementCardProps = {
  card: TimelinePublicCard;
};

export default function AchievementCard(props: AchievementCardProps) {
  const c = () => props.card;
  const thumb = () =>
    [...c().images].sort((a, b) => a.sortOrder - b.sortOrder)[0];

  const inner = (
    <div
      class="flex flex-col gap-3 rounded-lg border border-border bg-surface-container-lowest p-4 transition-colors hover:border-primary/40"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-ink-muted">
          {timelineKindLabel(c().kind)}
        </span>
        <Show
          when={
            c().kind === "certification" &&
            isCertificationExpired(c().expiresAt ?? null)
          }
        >
          <span class="text-xs text-warning">Expired</span>
        </Show>
      </div>
      <h3 class="text-lg font-semibold text-ink">{c().title}</h3>
      <Show when={c().organization}>
        <p class="text-sm text-ink-muted">{c().organization}</p>
      </Show>
      <p class="text-sm text-ink-muted">
        {formatTimelineDateRange(c().startDate, c().endDate, c().isOngoing)}
      </p>
      <Show when={thumb()}>
        {(img) => (
          <img
            src={img().url}
            alt={img().alt}
            class="h-32 w-full rounded-md object-cover"
          />
        )}
      </Show>
      <Show when={c().proofUrl}>
        <span class="text-sm text-link">Proof available</span>
      </Show>
    </div>
  );

  return (
    <Show when={c().href} fallback={inner}>
      {(href) => (
        <A href={href()} class="block no-underline text-inherit">
          {inner}
        </A>
      )}
    </Show>
  );
}

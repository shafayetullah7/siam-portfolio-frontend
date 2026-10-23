import { A } from "@solidjs/router";
import { Show } from "solid-js";
import AchievementGallery from "~/components/achievements/AchievementGallery";
import type { TimelinePublicDetail } from "~/lib/api/types/timeline.types";
import { isCertificationExpired } from "~/lib/timeline/achievements-hub";
import { formatTimelineDateRange } from "~/lib/timeline/format-timeline-dates";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type TimelinePublicDetailViewProps = {
  detail: TimelinePublicDetail;
  backHref: string;
  backLabel: string;
};

export default function TimelinePublicDetailView(
  props: TimelinePublicDetailViewProps,
) {
  const d = () => props.detail;

  return (
    <article class="max-w-3xl min-w-0">
      <p class="mb-4">
        <A href={props.backHref} class="text-link text-sm">
          ← {props.backLabel}
        </A>
      </p>
      <header>
        <p class="text-sm text-ink-muted">{timelineKindLabel(d().kind)}</p>
        <h1 class="mt-1 text-2xl font-semibold text-ink">{d().title}</h1>
        <Show when={d().subtitle}>
          <p class="mt-1 text-lg text-ink-muted">{d().subtitle}</p>
        </Show>
        <p class="mt-2 text-sm text-ink-muted">
          {formatTimelineDateRange(d().startDate, d().endDate, d().isOngoing)}
        </p>
        <Show when={d().organization}>
          <p class="mt-1 text-sm text-ink">{d().organization}</p>
        </Show>
        <Show when={d().eventName}>
          <p class="mt-1 text-sm text-ink-muted">{d().eventName}</p>
        </Show>
        <Show when={d().rankOrPlacement}>
          <p class="mt-1 text-sm text-ink">{d().rankOrPlacement}</p>
        </Show>
        <Show when={d().credentialId}>
          <p class="mt-1 text-sm font-mono text-ink-muted">
            Credential ID: {d().credentialId}
          </p>
        </Show>
        <Show
          when={
            d().kind === "certification" &&
            isCertificationExpired(d().expiresAt)
          }
        >
          <p class="mt-2 text-sm text-warning">This certification has expired.</p>
        </Show>
      </header>

      <Show when={d().summary?.trim()}>
        <p class="mt-6 whitespace-pre-wrap text-ink">{d().summary}</p>
      </Show>

      <Show when={d().proofUrl}>
        <p class="mt-4">
          <a
            href={d().proofUrl!}
            class="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View proof
          </a>
        </p>
      </Show>

      <AchievementGallery images={d().images} />
    </article>
  );
}

import { Show } from "solid-js";
import LandingContentLink from "~/components/landing/LandingContentLink";
import type { TalkPublicCard } from "~/lib/api/types/talks.types";
import { formatTalkDateTime } from "~/lib/talks/formatTalkDateTime";
import { TALK_ROLE_LABELS, TALK_TYPE_LABELS } from "~/lib/talks/talkLabels";
import { ChevronRight } from "~/icons";

export type TalkCardProps = {
  talk: TalkPublicCard;
};

function locationLine(talk: TalkPublicCard): string | null {
  if (talk.isOnline) {
    const venue = talk.venue?.trim();
    return venue ? `Online · ${venue}` : "Online";
  }
  const parts = [talk.location?.trim(), talk.venue?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default function TalkCard(props: TalkCardProps) {
  const talk = () => props.talk;
  const when = () => formatTalkDateTime(talk().startsAt, talk().timezone);
  const desc = () => talk().description?.trim() ?? "";

  return (
    <LandingContentLink
      href={`/talks/${talk().slug}`}
      ariaLabel={`View talk: ${talk().title}`}
      class="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md no-underline"
    >
      <div
        class="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary/5 transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
      <div class="relative">
        <div class="mb-2 flex flex-wrap gap-2">
          <span class="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-primary">
            {TALK_TYPE_LABELS[talk().talkType]}
          </span>
          <span class="rounded bg-surface-container px-2 py-0.5 font-mono text-xs text-secondary">
            {TALK_ROLE_LABELS[talk().role]}
          </span>
        </div>
        <h3 class="siam-headline-md mb-1 font-medium text-brand-deep">{talk().title}</h3>
        <p class="mb-2 text-sm font-medium text-ink">{talk().eventName}</p>
        <Show when={when()}>
          {(w) => (
            <p class="mb-2 text-sm text-ink-muted">
              <time dateTime={talk().startsAt}>{w().formatted}</time>
              <span class="ml-1 text-xs">({w().timezoneLabel})</span>
            </p>
          )}
        </Show>
        <Show when={locationLine(talk())}>
          {(line) => <p class="mb-3 text-sm text-on-surface-variant">{line()}</p>}
        </Show>
        <Show when={desc()}>
          <p class="text-sm text-on-surface-variant line-clamp-3">{desc()}</p>
        </Show>
      </div>
      <div class="relative mt-4 flex items-center justify-end border-t border-surface-container pt-3 text-sm font-medium text-primary">
        <span class="inline-flex items-center gap-1 transition-all group-hover:gap-1.5">
          View
          <ChevronRight class="size-4" aria-hidden="true" />
        </span>
      </div>
    </LandingContentLink>
  );
}

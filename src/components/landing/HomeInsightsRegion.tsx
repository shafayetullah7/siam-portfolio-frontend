import { For, Show } from "solid-js";
import type {
  HomeCurrentlyWorkingOn,
  HomeHighlight,
  HomeProfileLink,
} from "~/content";
import { ArrowExternal } from "~/icons";
import { formatDisplayDate } from "./formatDisplayDate";
import LandingContentLink from "./LandingContentLink";

export type HomeInsightsRegionProps = {
  highlights?: readonly HomeHighlight[];
  currentlyWorkingOn?: HomeCurrentlyWorkingOn;
  profiles?: readonly HomeProfileLink[];
};

function HighlightTimelineItem(props: { highlight: HomeHighlight }) {
  const { highlight } = props;
  const title = () => highlight.title ?? highlight.text.split("—")[0]?.trim() ?? highlight.text;

  return (
    <div class="flex items-start gap-3">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary"
        aria-hidden="true"
      >
        ◆
      </div>
      <div class="flex flex-col">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <Show when={highlight.badge?.trim()}>
            <span
              class="rounded bg-primary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-foreground"
            >
              {highlight.badge}
            </span>
          </Show>
          <Show when={highlight.dateLabel?.trim()}>
            <span class="font-mono text-[11px] text-secondary">{highlight.dateLabel}</span>
          </Show>
        </div>
        <h3 class="text-headline-sm font-semibold leading-snug text-brand-deep">{title()}</h3>
        <p class="text-sm text-on-surface-variant">{highlight.text}</p>
        <Show when={highlight.sourceUrl?.trim()}>
          <LandingContentLink
            href={highlight.sourceUrl!}
            class="mt-1 text-sm text-link no-underline hover:underline"
          >
            Source
          </LandingContentLink>
        </Show>
      </div>
    </div>
  );
}

export default function HomeInsightsRegion(props: HomeInsightsRegionProps) {
  const hasHighlights = () => (props.highlights?.length ?? 0) > 0;
  const hasWorkingOn = () => Boolean(props.currentlyWorkingOn?.text?.trim());
  const hasProfiles = () => (props.profiles?.length ?? 0) > 0;

  if (!hasHighlights() && !hasWorkingOn() && !hasProfiles()) {
    return null;
  }

  return (
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <Show when={hasHighlights()}>
        <section class="flex flex-col gap-3 lg:col-span-7" id="highlights">
          <span class="siam-eyebrow text-secondary">04 // MILESTONES</span>
          <h2 class="siam-headline-lg mb-2 font-normal text-brand-deep">
            Recent highlights &amp; talks
          </h2>
          <div class="landing-panel divide-y divide-surface-container p-5 sm:p-6">
            <For each={props.highlights}>
              {(highlight) => (
                <div class="py-4 first:pt-0 last:pb-0">
                  <HighlightTimelineItem highlight={highlight} />
                </div>
              )}
            </For>
          </div>
        </section>
      </Show>

      <div class="flex flex-col gap-8 lg:col-span-5">
        <Show when={hasWorkingOn()}>
          <section class="flex flex-col gap-3" id="currently-working-on">
            <span class="siam-eyebrow text-secondary">05 // DISPATCH</span>
            <h2 class="siam-headline-lg mb-2 font-normal text-brand-deep">Active exploration</h2>
            <div
              class="landing-panel flex flex-col gap-3 border-l-4 border-primary p-5 sm:p-6"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-xs font-semibold text-primary">LIVE INQUIRY</span>
                <span class="font-mono text-[11px] text-secondary">
                  Updated {formatDisplayDate(props.currentlyWorkingOn!.updatedAt)}
                </span>
              </div>
              <Show when={props.currentlyWorkingOn!.headline?.trim()}>
                <p class="text-headline-sm font-medium italic leading-relaxed text-brand-deep">
                  {props.currentlyWorkingOn!.headline}
                </p>
              </Show>
              <p class="text-sm text-on-surface-variant">{props.currentlyWorkingOn!.text}</p>
              <Show
                when={
                  props.currentlyWorkingOn!.statusLabel?.trim() ||
                  props.currentlyWorkingOn!.statusDetail?.trim()
                }
              >
                <div
                  class="flex items-center justify-between rounded bg-surface-container-low p-2 font-mono text-xs text-secondary"
                >
                  <span>{props.currentlyWorkingOn!.statusLabel ?? "Status"}</span>
                  <span class="font-medium text-primary">
                    {props.currentlyWorkingOn!.statusDetail}
                  </span>
                </div>
              </Show>
            </div>
          </section>
        </Show>

        <Show when={hasProfiles()}>
          <section class="flex flex-col gap-3" id="profiles">
            <span class="siam-eyebrow text-secondary">06 // IDENTIFIERS</span>
            <div class="grid grid-cols-2 gap-2">
              <For each={props.profiles}>
                {(profile) => (
                  <a
                    href={profile.href}
                    class="flex items-center justify-between rounded-lg bg-surface-container-lowest p-3 shadow-sm transition-colors hover:bg-surface-container no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div class="flex flex-col">
                      <span class="font-mono text-xs font-semibold text-primary">
                        {profile.label}
                      </span>
                      <Show when={profile.subtitle?.trim()}>
                        <span class="font-mono text-[11px] text-secondary">
                          {profile.subtitle}
                        </span>
                      </Show>
                    </div>
                    <ArrowExternal
                      class="size-4 shrink-0 text-secondary"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </For>
            </div>
          </section>
        </Show>
      </div>
    </div>
  );
}

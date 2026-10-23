import { For, Show } from "solid-js";
import AchievementCard from "~/components/achievements/AchievementCard";
import type {
  TimelinePublicCard,
  TimelinePublicSection,
} from "~/lib/api/types/timeline.types";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type AchievementsHubPageProps = {
  sections: TimelinePublicSection[];
  featuredItems?: TimelinePublicCard[];
};

export default function AchievementsHubPage(props: AchievementsHubPageProps) {
  const featured = () => props.featuredItems ?? [];

  return (
    <div class="flex flex-col gap-10">
      <Show when={featured().length > 0}>
        <section aria-labelledby="achievements-featured-heading">
          <h2
            id="achievements-featured-heading"
            class="text-lg font-semibold text-ink"
          >
            Featured
          </h2>
          <ul class="mt-4 grid list-none gap-4 pl-0 sm:grid-cols-2 lg:grid-cols-3">
            <For each={featured()}>
              {(card) => (
                <li>
                  <AchievementCard card={card} />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>

      <For each={props.sections}>
        {(section) => (
          <Show when={section.items.length > 0}>
            <section aria-labelledby={`achievements-section-${section.kind}`}>
              <h2
                id={`achievements-section-${section.kind}`}
                class="text-lg font-semibold text-ink"
              >
                {timelineKindLabel(section.kind)}
              </h2>
              <ul class="mt-4 grid list-none gap-4 pl-0 sm:grid-cols-2">
                <For each={section.items}>
                  {(card) => (
                    <li>
                      <AchievementCard card={card} />
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Show>
        )}
      </For>
    </div>
  );
}

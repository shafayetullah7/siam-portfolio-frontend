import { For, Show } from "solid-js";
import TimelineEntryRow from "~/components/timeline/TimelineEntryRow";
import type { TimelinePublicSection } from "~/lib/api/types/timeline.types";
import { countExperienceItems } from "~/lib/timeline/achievements-hub";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type ExperienceTimelineSectionProps = {
  sections: TimelinePublicSection[];
  intro: string;
};

export default function ExperienceTimelineSection(
  props: ExperienceTimelineSectionProps,
) {
  const total = () => countExperienceItems(props.sections);

  return (
    <Show when={total() > 0}>
      <section
        class="mt-12 border-t border-border pt-10"
        aria-labelledby="about-experience-heading"
      >
        <h2
          id="about-experience-heading"
          class="siam-headline-md text-brand-deep"
        >
          Education & experience
        </h2>
        <p class="siam-prose mt-3 max-w-prose text-ink-muted">{props.intro}</p>
        <div class="mt-8 flex flex-col gap-10">
          <For each={props.sections}>
            {(section) => (
              <Show when={section.items.length > 0}>
                <div>
                  <h3 class="text-lg font-semibold text-ink">
                    {timelineKindLabel(section.kind)}
                  </h3>
                  <ul class="mt-4 flex list-none flex-col gap-4 pl-0">
                    <For each={section.items}>
                      {(card) => (
                        <li>
                          <TimelineEntryRow card={card} />
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </Show>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}

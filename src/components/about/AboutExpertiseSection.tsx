import { For, Show } from "solid-js";
import type { ProfileExpertise } from "~/lib/api/types/home.types";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

const GROUPS: { key: keyof ProfileExpertise; title: string }[] = [
  { key: "domains", title: "Domains" },
  { key: "methodologies", title: "Methodologies" },
  { key: "tooling", title: "Programming & tooling" },
  { key: "practices", title: "Scientific practices" },
];

export type AboutExpertiseSectionProps = {
  model: AboutPageViewModel;
};

export default function AboutExpertiseSection(props: AboutExpertiseSectionProps) {
  const expertise = () => props.model.expertise;
  return (
    <Show when={expertise()}>
      {(value) => (
        <section
          class="mt-12 border-t border-border pt-10"
          aria-labelledby="about-expertise-heading"
        >
          <h2
            id="about-expertise-heading"
            class="siam-headline-md text-brand-deep"
          >
            Research expertise
          </h2>
          <div class="mt-6 grid gap-8 sm:grid-cols-2">
            <For each={GROUPS}>
              {(group) => {
                const items = () => value()[group.key];
                return (
                  <Show when={items().length > 0}>
                    <div>
                      <h3 class="text-base font-semibold text-ink">{group.title}</h3>
                      <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                        <For each={items()}>
                          {(item) => <li>{item}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>
                );
              }}
            </For>
          </div>
        </section>
      )}
    </Show>
  );
}

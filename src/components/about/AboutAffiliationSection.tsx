import { Show } from "solid-js";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

export type AboutAffiliationSectionProps = {
  model: AboutPageViewModel;
};

export default function AboutAffiliationSection(props: AboutAffiliationSectionProps) {
  const aff = () => props.model.affiliation;
  return (
    <Show when={aff()}>
      {(value) => (
        <section
          class="mt-8 border-t border-border pt-8"
          aria-labelledby="about-affiliation-heading"
        >
          <h2
            id="about-affiliation-heading"
            class="siam-headline-md text-brand-deep"
          >
            Affiliation
          </h2>
          <Show
            when={value().legacyLine}
            fallback={
              <div class="mt-3 space-y-1 text-sm text-ink-muted">
                <Show when={value().role}>
                  <p>{value().role}</p>
                </Show>
                <Show when={value().organization}>
                  <p>{value().organization}</p>
                </Show>
                <Show when={value().location}>
                  <p>{value().location}</p>
                </Show>
              </div>
            }
          >
            <p class="mt-3 text-sm text-ink-muted">{value().legacyLine}</p>
          </Show>
        </section>
      )}
    </Show>
  );
}

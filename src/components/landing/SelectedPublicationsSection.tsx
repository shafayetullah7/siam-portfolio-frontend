import type { HomePublicationHighlight } from "~/content";
import LandingSectionHeader from "./LandingSectionHeader";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import PublicationHighlightList from "./PublicationHighlightList";

export type SelectedPublicationsSectionProps = {
  items: readonly HomePublicationHighlight[];
};

export default function SelectedPublicationsSection(
  props: SelectedPublicationsSectionProps,
) {
  const meta = HOME_SECTION_LABELS.selectedPublications;
  const count = () => props.items.length;

  return (
    <section
      id={meta.domId}
      class="scroll-mt-24 flex w-full flex-col gap-5"
      aria-labelledby={`${meta.domId}-heading`}
    >
      <LandingSectionHeader
        headingId={`${meta.domId}-heading`}
        sectionEyebrow={meta.sectionEyebrow ?? "02 // SCHOLARSHIP"}
        title={meta.title}
        aside={
          <div
            class="flex flex-wrap items-center gap-1.5 rounded-xl bg-surface-container p-1"
            role="group"
            aria-label="Publication filters (preview)"
          >
            <span
              class="rounded-lg bg-surface-container-lowest px-3 py-1 font-mono text-xs font-semibold text-primary shadow-sm"
            >
              All ({count()})
            </span>
            <span class="rounded-lg px-3 py-1 font-mono text-xs text-on-surface-variant">
              Conference
            </span>
            <span class="rounded-lg px-3 py-1 font-mono text-xs text-on-surface-variant">
              Preprints
            </span>
          </div>
        }
      />
      <div
        class="flex flex-col divide-y divide-surface-container overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
      >
        <PublicationHighlightList items={props.items} />
      </div>
    </section>
  );
}

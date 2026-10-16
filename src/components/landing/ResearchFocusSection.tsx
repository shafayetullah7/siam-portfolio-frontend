import type { HomeResearchFocusItem } from "~/content";
import LandingSectionHeader from "./LandingSectionHeader";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import ResearchFocusGrid from "./ResearchFocusGrid";

export type ResearchFocusSectionProps = {
  items: readonly HomeResearchFocusItem[];
};

export default function ResearchFocusSection(props: ResearchFocusSectionProps) {
  const meta = HOME_SECTION_LABELS.researchFocus;

  return (
    <section id={meta.domId} class="scroll-mt-24 flex w-full flex-col gap-5" aria-labelledby={`${meta.domId}-heading`}>
      <LandingSectionHeader
        headingId={`${meta.domId}-heading`}
        sectionEyebrow={meta.sectionEyebrow ?? "01 // FOCUS AREAS"}
        title={meta.title}
        aside={
          <p class="max-w-md text-sm text-secondary">
            {meta.aside ??
              "Theoretical rigor met with operational deployments. Addressing failure modes before systems enter high-stakes settings."}
          </p>
        }
      />
      <ResearchFocusGrid items={props.items} />
    </section>
  );
}

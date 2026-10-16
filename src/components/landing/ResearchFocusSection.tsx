import type { HomeResearchFocusItem } from "~/content";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import ResearchFocusGrid from "./ResearchFocusGrid";

export type ResearchFocusSectionProps = {
  items: readonly HomeResearchFocusItem[];
};

export default function ResearchFocusSection(props: ResearchFocusSectionProps) {
  const meta = HOME_SECTION_LABELS.researchFocus;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <ResearchFocusGrid items={props.items} />
    </LandingSection>
  );
}

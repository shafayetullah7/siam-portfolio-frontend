import type { HomeHighlight } from "~/content";
import HighlightsList from "./HighlightsList";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";

export type HighlightsSectionProps = {
  items: readonly HomeHighlight[];
};

export default function HighlightsSection(props: HighlightsSectionProps) {
  const meta = HOME_SECTION_LABELS.highlights;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <HighlightsList items={props.items} />
    </LandingSection>
  );
}

import type { HomePublicationHighlight } from "~/content";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import PublicationHighlightList from "./PublicationHighlightList";

export type SelectedPublicationsSectionProps = {
  items: readonly HomePublicationHighlight[];
};

export default function SelectedPublicationsSection(
  props: SelectedPublicationsSectionProps,
) {
  const meta = HOME_SECTION_LABELS.selectedPublications;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <PublicationHighlightList items={props.items} />
    </LandingSection>
  );
}

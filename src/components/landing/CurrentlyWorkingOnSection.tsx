import type { HomeCurrentlyWorkingOn } from "~/content";
import CurrentlyWorkingOn from "./CurrentlyWorkingOn";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";

export type CurrentlyWorkingOnSectionProps = {
  data: HomeCurrentlyWorkingOn;
};

export default function CurrentlyWorkingOnSection(props: CurrentlyWorkingOnSectionProps) {
  const meta = HOME_SECTION_LABELS.currentlyWorkingOn;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <CurrentlyWorkingOn data={props.data} />
    </LandingSection>
  );
}

import type { HomeProfileLink } from "~/content";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import ProfileLinks from "./ProfileLinks";

export type ProfilesSectionProps = {
  items: readonly HomeProfileLink[];
};

export default function ProfilesSection(props: ProfilesSectionProps) {
  const meta = HOME_SECTION_LABELS.profiles;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <ProfileLinks items={props.items} />
    </LandingSection>
  );
}

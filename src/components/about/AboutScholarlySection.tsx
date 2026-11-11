import LandingSection from "~/components/landing/LandingSection";
import ProfileLinks from "~/components/landing/ProfileLinks";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

export type AboutScholarlySectionProps = {
  model: AboutPageViewModel;
};

export default function AboutScholarlySection(props: AboutScholarlySectionProps) {
  return (
    <div class="mt-12 border-t border-border pt-10">
      <LandingSection id="about-scholarly" title="Scholarly profiles">
        <ProfileLinks items={props.model.scholarlyProfiles} />
      </LandingSection>
    </div>
  );
}

import type { HomeProjectHighlight } from "~/content";
import LandingSection from "./LandingSection";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";
import ProjectCardGrid from "./ProjectCardGrid";

export type FeaturedProjectsSectionProps = {
  items: readonly HomeProjectHighlight[];
};

export default function FeaturedProjectsSection(props: FeaturedProjectsSectionProps) {
  const meta = HOME_SECTION_LABELS.featuredProjects;

  return (
    <LandingSection id={meta.domId} title={meta.title} kicker={meta.kicker}>
      <ProjectCardGrid items={props.items} />
    </LandingSection>
  );
}

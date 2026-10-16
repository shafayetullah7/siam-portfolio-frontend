import type { JSX } from "solid-js";
import type { HomePageContent } from "~/content";
import { listVisibleSectionIds } from "~/content";
import CollaborationCta from "./CollaborationCta";
import CurrentlyWorkingOnSection from "./CurrentlyWorkingOnSection";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import HighlightsSection from "./HighlightsSection";
import HomeHeroRegion from "./HomeHeroRegion";
import LandingSectionReveal from "./LandingSectionReveal";
import ProfilesSection from "./ProfilesSection";
import ResearchFocusSection from "./ResearchFocusSection";
import SelectedPublicationsSection from "./SelectedPublicationsSection";

export type HomeLandingSectionsProps = {
  content: HomePageContent;
};

function reveal(children: JSX.Element) {
  return <LandingSectionReveal>{children}</LandingSectionReveal>;
}

export default function HomeLandingSections(props: HomeLandingSectionsProps) {
  const sectionIds = () => listVisibleSectionIds(props.content);

  return (
    <>
      {sectionIds().map((id) => {
        if (id === "hero") {
          return reveal(
            <HomeHeroRegion
              hero={props.content.hero}
              affiliation={
                sectionIds().includes("affiliation")
                  ? props.content.affiliation
                  : undefined
              }
            />,
          );
        }
        if (id === "affiliation") {
          return null;
        }
        if (id === "researchFocus") {
          return reveal(<ResearchFocusSection items={props.content.researchFocus!} />);
        }
        if (id === "selectedPublications") {
          return reveal(
            <SelectedPublicationsSection items={props.content.selectedPublications!} />,
          );
        }
        if (id === "featuredProjects") {
          return reveal(<FeaturedProjectsSection items={props.content.featuredProjects!} />);
        }
        if (id === "highlights") {
          return reveal(<HighlightsSection items={props.content.highlights!} />);
        }
        if (id === "currentlyWorkingOn") {
          return reveal(
            <CurrentlyWorkingOnSection data={props.content.currentlyWorkingOn!} />,
          );
        }
        if (id === "profiles") {
          return reveal(<ProfilesSection items={props.content.profiles!} />);
        }
        if (id === "collaborationCta") {
          return reveal(<CollaborationCta cta={props.content.collaborationCta!} />);
        }
        return null;
      })}
    </>
  );
}

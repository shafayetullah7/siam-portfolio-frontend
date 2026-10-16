import type { JSX } from "solid-js";
import type { HomePageContent } from "~/content";
import { listVisibleSectionIds } from "~/content";
import CollaborationCta from "./CollaborationCta";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import HomeHeroRegion from "./HomeHeroRegion";
import HomeInsightsRegion from "./HomeInsightsRegion";
import LandingSectionReveal from "./LandingSectionReveal";
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
  const showInsights = () =>
    sectionIds().includes("highlights") ||
    sectionIds().includes("currentlyWorkingOn") ||
    sectionIds().includes("profiles");

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
          if (!showInsights()) return null;
          return reveal(
            <HomeInsightsRegion
              highlights={props.content.highlights}
              currentlyWorkingOn={props.content.currentlyWorkingOn}
              profiles={props.content.profiles}
            />,
          );
        }
        if (id === "currentlyWorkingOn" || id === "profiles") {
          return null;
        }
        if (id === "collaborationCta") {
          return reveal(<CollaborationCta cta={props.content.collaborationCta!} />);
        }
        return null;
      })}
    </>
  );
}

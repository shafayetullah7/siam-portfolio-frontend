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
          const items = props.content.researchFocus;
          if (!items?.length) return null;
          return reveal(<ResearchFocusSection items={items} />);
        }
        if (id === "selectedPublications") {
          const items = props.content.selectedPublications;
          if (!items?.length) return null;
          return reveal(<SelectedPublicationsSection items={items} />);
        }
        if (id === "featuredProjects") {
          const items = props.content.featuredProjects;
          if (!items?.length) return null;
          return reveal(<FeaturedProjectsSection items={items} />);
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
          const cta = props.content.collaborationCta;
          if (!cta?.headline?.trim()) return null;
          return reveal(<CollaborationCta cta={cta} />);
        }
        return null;
      })}
    </>
  );
}

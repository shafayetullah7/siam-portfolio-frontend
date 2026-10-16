import type { HomeSectionId } from "~/content";
import { HOME_SECTION_DOM_IDS } from "~/lib/site/homeSectionIds";

export type HomeSectionLabel = {
  domId: string;
  title: string;
  kicker?: string;
  sectionEyebrow?: string;
  aside?: string;
  /** LP phase that replaces this stub. */
  shipsInPhase: string;
};

const NON_HERO_SECTIONS: Exclude<HomeSectionId, "hero">[] = [
  "affiliation",
  "researchFocus",
  "selectedPublications",
  "featuredProjects",
  "highlights",
  "currentlyWorkingOn",
  "profiles",
  "collaborationCta",
];

export const HOME_SECTION_LABELS: Record<
  Exclude<HomeSectionId, "hero">,
  HomeSectionLabel
> = {
  affiliation: {
    domId: HOME_SECTION_DOM_IDS.affiliation,
    title: "Current affiliation",
    shipsInPhase: "LP2",
  },
  researchFocus: {
    domId: HOME_SECTION_DOM_IDS.researchFocus,
    title: "Research pillars & foundations",
    sectionEyebrow: "01 // FOCUS AREAS",
    shipsInPhase: "LP3",
  },
  selectedPublications: {
    domId: HOME_SECTION_DOM_IDS.selectedPublications,
    title: "Selected publications",
    sectionEyebrow: "02 // SCHOLARSHIP",
    shipsInPhase: "LP4",
  },
  featuredProjects: {
    domId: HOME_SECTION_DOM_IDS.featuredProjects,
    title: "Open source & applied systems",
    sectionEyebrow: "03 // ARTIFACTS & SYSTEMS",
    shipsInPhase: "LP4",
  },
  highlights: {
    domId: HOME_SECTION_DOM_IDS.highlights,
    title: "Highlights",
    shipsInPhase: "LP5",
  },
  currentlyWorkingOn: {
    domId: HOME_SECTION_DOM_IDS.currentlyWorkingOn,
    title: "Currently working on",
    shipsInPhase: "LP5",
  },
  profiles: {
    domId: HOME_SECTION_DOM_IDS.profiles,
    title: "Profiles",
    shipsInPhase: "LP5",
  },
  collaborationCta: {
    domId: HOME_SECTION_DOM_IDS.collaborationCta,
    title: "Collaboration",
    shipsInPhase: "LP5",
  },
};

export function getNonHeroSectionIds(): Exclude<HomeSectionId, "hero">[] {
  return NON_HERO_SECTIONS;
}

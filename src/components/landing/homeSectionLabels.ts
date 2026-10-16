import type { HomeSectionId } from "~/content";

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
    domId: "affiliation",
    title: "Current affiliation",
    shipsInPhase: "LP2",
  },
  researchFocus: {
    domId: "research-focus",
    title: "Research pillars & foundations",
    sectionEyebrow: "01 // FOCUS AREAS",
    shipsInPhase: "LP3",
  },
  selectedPublications: {
    domId: "selected-publications",
    title: "Selected publications",
    sectionEyebrow: "02 // SCHOLARSHIP",
    shipsInPhase: "LP4",
  },
  featuredProjects: {
    domId: "featured-projects",
    title: "Open source & applied systems",
    sectionEyebrow: "03 // ARTIFACTS & SYSTEMS",
    shipsInPhase: "LP4",
  },
  highlights: {
    domId: "highlights",
    title: "Highlights",
    shipsInPhase: "LP5",
  },
  currentlyWorkingOn: {
    domId: "currently-working-on",
    title: "Currently working on",
    shipsInPhase: "LP5",
  },
  profiles: {
    domId: "profiles",
    title: "Profiles",
    shipsInPhase: "LP5",
  },
  collaborationCta: {
    domId: "collaboration",
    title: "Collaboration",
    shipsInPhase: "LP5",
  },
};

export function getNonHeroSectionIds(): Exclude<HomeSectionId, "hero">[] {
  return NON_HERO_SECTIONS;
}

export type {
  HomeAffiliation,
  HomeCollaborationCta,
  HomeCta,
  HomeCurrentlyWorkingOn,
  HomeHero,
  HomeHeroLedger,
  HomeHeroMetric,
  HomeHighlight,
  HomePageContent,
  HomePageSeo,
  HomePortrait,
  HomeProfileLink,
  HomeProjectHighlight,
  HomePublicationHighlight,
  HomeResearchFocusItem,
  HomeSectionId,
} from "./home.types";

export { homeContent } from "./home.content";

export {
  assertHomeContentBounds,
  hasValidMetricClaim,
  isNonEmptySection,
  listVisibleSectionIds,
  validateHomeContentBounds,
} from "./home.validation";

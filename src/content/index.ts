export type {
  ProjectRecord,
  PublicationRecord,
  ResearchTheme,
  ResearchThemeStatus,
} from "./catalog.types";

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
export { projectsCatalog } from "./projects.catalog";
export { publicationsCatalog } from "./publications.catalog";
export { researchThemesCatalog } from "./research.catalog";

export {
  getProject,
  getPublication,
  getResearchTheme,
  listCatalogSitemapPaths,
  listFeaturedProjectsForHome,
  listFeaturedPublicationsForHome,
  listFeaturedResearchForHome,
  listProjects,
  listPublications,
  listResearchThemes,
  projectToHomeItem,
  publicationToHomeItem,
  researchThemeToHomeItem,
  validateCatalogFeaturedBounds,
} from "./catalog";

export {
  assertHomeContentBounds,
  hasValidMetricClaim,
  isNonEmptySection,
  listVisibleSectionIds,
  validateHomeContentBounds,
} from "./home.validation";

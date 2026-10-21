/**
 * Static home page content model (P01). Keep aligned with future GET /public/home
 * aggregate and PublicHomePayload extensions (LP7 / A03).
 */

export type HomeCta = {
  label: string;
  href: string;
};

export type HomePortrait = {
  src: string;
  alt: string;
};

export type HomeHeroMetric = {
  value: string;
  label: string;
};

export type HomeHeroLedger = {
  headerLabel?: string;
  orcid?: string;
  metrics?: readonly HomeHeroMetric[];
};

export type HomeHero = {
  name: string;
  descriptor: string;
  positioning: string;
  portrait: HomePortrait | null;
  primaryCta: HomeCta;
  secondaryCta: HomeCta;
  /** Mono badge e.g. "LIVE DISPATCH" */
  statusBadge?: string;
  contactEmail?: string;
  ledger?: HomeHeroLedger;
};

export type HomeAffiliation = {
  role: string;
  organization: string;
  location?: string;
};

export type HomeResearchFocusItem = {
  title: string;
  description: string;
  href: string;
  tags?: readonly string[];
  linkLabel?: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  relatedPublicationCount?: number;
  relatedProjectCount?: number;
};

export type HomePublicationHighlight = {
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  significance: string;
  href: string;
};

export type HomeProjectHighlight = {
  title: string;
  summary: string;
  href: string;
  tags?: readonly string[];
  image?: HomePortrait;
};

export type HomeHighlight = {
  text: string;
  sourceUrl?: string;
  asOfDate?: string;
  title?: string;
  badge?: string;
  dateLabel?: string;
};

export type HomeCurrentlyWorkingOn = {
  text: string;
  updatedAt: string;
  headline?: string;
  statusLabel?: string;
  statusDetail?: string;
};

export type HomeProfileLink = {
  label: string;
  href: string;
  subtitle?: string;
};

export type HomeCollaborationCta = {
  headline: string;
  body: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  replyNote?: string;
};

export type HomePageSeo = {
  title?: string;
  description?: string;
};

export type HomePageContent = {
  hero: HomeHero;
  affiliation?: HomeAffiliation;
  researchFocus?: readonly HomeResearchFocusItem[];
  selectedPublications?: readonly HomePublicationHighlight[];
  featuredProjects?: readonly HomeProjectHighlight[];
  highlights?: readonly HomeHighlight[];
  currentlyWorkingOn?: HomeCurrentlyWorkingOn;
  profiles?: readonly HomeProfileLink[];
  collaborationCta?: HomeCollaborationCta;
  seo?: HomePageSeo;
};

export type HomeSectionId =
  | "hero"
  | "affiliation"
  | "researchFocus"
  | "selectedPublications"
  | "featuredProjects"
  | "highlights"
  | "currentlyWorkingOn"
  | "profiles"
  | "collaborationCta";

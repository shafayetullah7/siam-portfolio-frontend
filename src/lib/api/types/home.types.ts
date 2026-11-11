/**
 * Admin/public home DTO stubs (HOME1). Align section ids with `~/content/home.types.ts`.
 */

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

export type HomeSectionConfig = {
  id: HomeSectionId;
  visible: boolean;
};

export type ScholarlyProfileLink = {
  label: string;
  href: string;
  subtitle?: string;
};

export type ProfileExpertise = {
  domains: string[];
  methodologies: string[];
  tooling: string[];
  practices: string[];
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

export type HomeCollaborationCta = {
  headline: string;
  body: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  replyNote?: string;
};

export type PublishStatus = "draft" | "published" | "scheduled" | "archived";

export type ProfileAdmin = {
  id: string;
  headline: string | null;
  displayName: string | null;
  professionalTitle: string | null;
  contactEmail: string | null;
  shortBio: string | null;
  longBio: string | null;
  affiliation: string | null;
  affiliationRole: string | null;
  affiliationOrganization: string | null;
  affiliationLocation: string | null;
  portraitMediaId: string | null;
  scholarlyProfiles: ScholarlyProfileLink[] | null;
  researchStatement: string | null;
  expertise: ProfileExpertise | null;
  collaborationInterests: string | null;
  publishStatus: PublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HomepageAdmin = {
  id: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescriptor: string | null;
  heroPositioning: string | null;
  statusBadge: string | null;
  primaryCtaLabel: string | null;
  primaryCtaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  heroMediaId: string | null;
  sections: HomeSectionConfig[] | null;
  highlights: HomeHighlight[] | null;
  currentlyWorkingOn: HomeCurrentlyWorkingOn | null;
  collaborationCta: HomeCollaborationCta | null;
  profiles: ScholarlyProfileLink[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishStatus: PublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HomePublicShell = {
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescriptor: string | null;
  heroPositioning: string | null;
  statusBadge: string | null;
  primaryCta: { label: string; href: string } | null;
  secondaryCta: { label: string; href: string } | null;
  displayName: string | null;
  affiliationRole: string | null;
  affiliationOrganization: string | null;
  affiliationLocation: string | null;
  visibleSectionIds: HomeSectionId[];
  highlights: HomeHighlight[] | null;
  currentlyWorkingOn: HomeCurrentlyWorkingOn | null;
  collaborationCta: HomeCollaborationCta | null;
  profiles: ScholarlyProfileLink[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type HomeAdminAggregate = {
  profile: ProfileAdmin;
  homepage: HomepageAdmin;
};

export type HomeFeaturedKind = "research" | "publication" | "project";

export type HomeFeaturedSummaryItem = {
  id: string;
  slug: string;
  title: string;
  publishStatus: PublishStatus | string;
  kind: HomeFeaturedKind;
  appearsOnPublicHome: boolean;
};

export type HomeFeaturedSummaryResponse = {
  caps: {
    research: number;
    publications: number;
    projects: number;
  };
  research: HomeFeaturedSummaryItem[];
  publications: HomeFeaturedSummaryItem[];
  projects: HomeFeaturedSummaryItem[];
};

type ReadonlyKeys =
  | "id"
  | "publishStatus"
  | "publishedAt"
  | "scheduledAt"
  | "archivedAt"
  | "createdAt"
  | "updatedAt";

export type UpdateHomepageBody = Partial<
  Omit<HomepageAdmin, ReadonlyKeys>
>;

export type UpdateProfileBody = Partial<Omit<ProfileAdmin, ReadonlyKeys>>;

export type HomePublishChecklistItem = {
  code: string;
  message: string;
};

export type HomePublishChecklist = {
  errors: HomePublishChecklistItem[];
  warnings: HomePublishChecklistItem[];
};

export type PublishSingletonBody = {
  confirmWarnings?: boolean;
};

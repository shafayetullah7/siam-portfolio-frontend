import { publicClient } from "../../public-client";
import type { HomeSectionId } from "../../types/home.types";

export interface PublicSitePayload {
  siteName: string;
  defaultMetaDescription: string | null;
  footerText: string | null;
  faviconUrl: string | null;
  nav: { id: string; label: string; path: string; sortOrder: number; visible: boolean }[];
  sitemapPaths: string[];
}

export interface PublicHomeResearchFocusItem {
  title: string;
  description: string;
  href: string;
  tags?: string[];
  coverUrl?: string | null;
  coverAlt?: string | null;
}

export interface PublicHomePublicationHighlight {
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  significance: string;
  href: string;
  featured?: boolean;
}

export interface PublicHomeProjectHighlight {
  title: string;
  summary: string;
  href: string;
  tags?: string[];
  coverUrl?: string | null;
  coverAlt?: string | null;
}

export interface PublicHomeHeroPayload {
  name: string;
  descriptor: string;
  positioning: string;
  statusBadge?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  portrait?: { url: string; alt: string };
}

export interface PublicHomeAffiliationPayload {
  role: string;
  organization: string;
  location?: string;
}

export interface PublicHomeSeoPayload {
  title?: string;
  description?: string;
}

export interface PublicHomePayload {
  published: boolean;
  visibleSectionIds: HomeSectionId[];
  heroTitle: string | null;
  heroSubtitle: string | null;
  hero?: PublicHomeHeroPayload;
  affiliation?: PublicHomeAffiliationPayload;
  highlights?: import("~/content/home.types").HomeHighlight[];
  currentlyWorkingOn?: import("~/content/home.types").HomeCurrentlyWorkingOn;
  profiles?: import("~/content/home.types").HomeProfileLink[];
  collaborationCta?: import("~/content/home.types").HomeCollaborationCta;
  seo?: PublicHomeSeoPayload;
  researchFocus: PublicHomeResearchFocusItem[];
  selectedPublications?: PublicHomePublicationHighlight[];
  selectedProjects?: PublicHomeProjectHighlight[];
}

export interface PublicAboutPayload {
  published: boolean;
  headline: string | null;
  shortBio: string | null;
  longBio: string | null;
  affiliation: string | null;
  displayName?: string | null;
  professionalTitle?: string | null;
  contactEmail?: string | null;
  affiliationRole?: string | null;
  affiliationOrganization?: string | null;
  affiliationLocation?: string | null;
  scholarlyProfiles?: import("~/content/home.types").HomeProfileLink[] | null;
  researchStatement?: string | null;
  expertise?: import("~/lib/api/types/home.types").ProfileExpertise | null;
  collaborationInterests?: string | null;
}

export const sitePublicApi = {
  get: () => publicClient.get<PublicSitePayload>("/site"),
  home: () => publicClient.get<PublicHomePayload>("/home"),
  about: () => publicClient.get<PublicAboutPayload>("/about"),
};

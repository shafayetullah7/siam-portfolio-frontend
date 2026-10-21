import { publicClient } from "../../public-client";

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

export interface PublicHomePayload {
  heroTitle: string | null;
  heroSubtitle: string | null;
  researchFocus: PublicHomeResearchFocusItem[];
}

export interface PublicAboutPayload {
  headline: string | null;
  shortBio: string | null;
  longBio: string | null;
  affiliation: string | null;
}

export const sitePublicApi = {
  get: () => publicClient.get<PublicSitePayload>("/site"),
  home: () => publicClient.get<PublicHomePayload>("/home"),
  about: () => publicClient.get<PublicAboutPayload>("/about"),
};

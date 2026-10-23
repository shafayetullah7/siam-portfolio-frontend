import type { PublishChecklistItem } from "./research.types";
import type { ResearchPublicationCardPublic } from "./research.types";
import type { ResearchProjectCardPublic } from "./research.types";
import type { ResearchThemeCardPublic } from "./research.types";

export type WritingPublishChecklist = {
  errors: PublishChecklistItem[];
  warnings: PublishChecklistItem[];
};

export type WritingPublishStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

export type WritingAdminSummary = {
  id: string;
  slug: string;
  title: string;
  publishStatus: WritingPublishStatus;
  updatedAt: string;
  readingTimeMinutes?: number | null;
  tags?: string[] | null;
};

export type WritingAdminDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  body: string;
  tags: string[] | null;
  seriesId: string | null;
  seriesSortOrder: number | null;
  coverMediaId: string | null;
  byline: string | null;
  readingTimeMinutes: number | null;
  wordCount: number | null;
  featuredOnHub: boolean;
  featured: boolean;
  sortOrder: number;
  materiallyUpdatedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hideFromSearch: boolean;
  publishStatus: WritingPublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WritingWriteBody = {
  slug: string;
  title: string;
  summary: string;
  subtitle?: string | null;
  body?: string;
  tags?: string[] | null;
  seriesId?: string | null;
  seriesSortOrder?: number | null;
  coverMediaId?: string | null;
  byline?: string | null;
  featuredOnHub?: boolean;
  featured?: boolean;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  hideFromSearch?: boolean;
};

export type WritingPublicCard = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags?: string[];
  readingTimeMinutes?: number | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  materiallyUpdatedAt?: string | null;
  featuredOnHub?: boolean;
  coverUrl?: string | null;
  coverAlt?: string | null;
};

export type WritingThemeRelatedCard = Pick<
  ResearchThemeCardPublic,
  "slug" | "title" | "summary" | "href"
>;

export type WritingPublicRelated = {
  articles: WritingPublicCard[];
  publications: ResearchPublicationCardPublic[];
  projects: ResearchProjectCardPublic[];
  themes: WritingThemeRelatedCard[];
};

export type ArticleRelations = {
  publicationIds: string[];
  projectIds: string[];
  themeIds: string[];
  relatedArticleIds: string[];
};

export type WritingPublicSeriesSection = {
  slug: string;
  title: string;
  summary?: string | null;
  items: WritingPublicCard[];
};

export type WritingPublicList = {
  intro: string | null;
  items: WritingPublicCard[];
  meta: import("./index").PaginationMeta;
  seriesSections?: WritingPublicSeriesSection[];
};

export type WritingPublicDetail = WritingPublicCard & {
  subtitle?: string | null;
  body: string;
  wordCount?: number | null;
  byline?: string | null;
  related: WritingPublicRelated;
  seoTitle?: string | null;
  seoDescription?: string | null;
  prevSlug?: string;
  nextSlug?: string;
  seriesPrevSlug?: string;
  seriesNextSlug?: string;
  series?: { slug: string; title: string };
};

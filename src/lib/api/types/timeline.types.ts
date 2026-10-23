import type { PublishChecklistItem } from "./research.types";

export type TimelineEntryKind =
  | "award"
  | "competition"
  | "scholarship_fellowship_grant"
  | "certification"
  | "recognition_service"
  | "education"
  | "research_experience"
  | "industry_experience"
  | "teaching_mentoring"
  | "affiliation";

export type TimelinePublishStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

export type TimelineImageRole = "certificate" | "photo" | "badge" | "logo";

export type TimelinePublicImage = {
  url: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
  imageRole?: TimelineImageRole | null;
};

export type TimelinePublicCard = {
  id: string;
  kind: TimelineEntryKind;
  title: string;
  subtitle: string | null;
  organization: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  featured: boolean;
  proofUrl: string | null;
  images: TimelinePublicImage[];
  href?: string;
  expiresAt?: string | null;
  summary?: string | null;
  isCurrent?: boolean | null;
};

export type TimelinePublicSection = {
  kind: TimelineEntryKind;
  items: TimelinePublicCard[];
};

export type TimelinePublicGroupedList = {
  intro?: string | null;
  sections: TimelinePublicSection[];
};

export type TimelinePublicDetail = TimelinePublicCard & {
  summary: string | null;
  proofUrl: string | null;
  rankOrPlacement: string | null;
  eventName: string | null;
  credentialId: string | null;
  expiresAt: string | null;
  isCurrent: boolean | null;
  publicationId: string | null;
  projectId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishStatus: TimelinePublishStatus;
  publishedAt: string | null;
};

export type TimelineEntryMediaAdmin = {
  id: string;
  mediaId: string;
  sortOrder: number;
  caption: string | null;
  imageRole: TimelineImageRole | null;
};

export type TimelineMediaLinkAdmin = {
  id: string;
  mediaId: string;
  sortOrder: number;
  caption: string | null;
  imageRole: TimelineImageRole | null;
  url?: string;
  alt?: string | null;
};

export type TimelineReplaceMediaItem = {
  mediaId: string;
  sortOrder: number;
  caption?: string | null;
  imageRole?: TimelineImageRole | null;
};

export type TimelineReplaceMediaBody = {
  items: TimelineReplaceMediaItem[];
};

export type TimelinePublishChecklist = {
  errors: PublishChecklistItem[];
  warnings: PublishChecklistItem[];
};

export type TimelineAdminSummary = {
  id: string;
  kind: TimelineEntryKind;
  title: string;
  slug: string | null;
  publishStatus: TimelinePublishStatus;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  featured: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type TimelineAdminDetail = {
  id: string;
  kind: TimelineEntryKind;
  slug: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  organization: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  isCurrent: boolean | null;
  proofUrl: string | null;
  rankOrPlacement: string | null;
  eventName: string | null;
  credentialId: string | null;
  expiresAt: string | null;
  featured: boolean;
  sortOrder: number;
  publicationId: string | null;
  projectId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hideFromSearch: boolean;
  metadata?: Record<string, unknown> | null;
  publishStatus: TimelinePublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mediaLinks: TimelineMediaLinkAdmin[];
};

export type TimelineWriteBody = {
  kind: TimelineEntryKind;
  title: string;
  slug?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  organization?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isOngoing?: boolean;
  isCurrent?: boolean | null;
  proofUrl?: string | null;
  rankOrPlacement?: string | null;
  eventName?: string | null;
  credentialId?: string | null;
  expiresAt?: string | null;
  featured?: boolean;
  sortOrder?: number;
  publicationId?: string | null;
  projectId?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  hideFromSearch?: boolean;
  metadata?: Record<string, unknown> | null;
};

export type TimelineEntryAdmin = {
  id: string;
  kind: TimelineEntryKind;
  slug: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  organization: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  isCurrent: boolean | null;
  proofUrl: string | null;
  rankOrPlacement: string | null;
  eventName: string | null;
  credentialId: string | null;
  expiresAt: string | null;
  featured: boolean;
  sortOrder: number;
  publicationId: string | null;
  projectId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hideFromSearch: boolean;
  publishStatus: TimelinePublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  media: TimelineEntryMediaAdmin[];
};

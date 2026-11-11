import type { PublishChecklistItem, ResearchPublicationCardPublic, ResearchProjectCardPublic, ResearchThemeCardPublic } from "./research.types";

export type TalkPublishStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

export type TalkRole =
  | "speaker"
  | "panelist"
  | "poster_presenter"
  | "attendee"
  | "organizer";

export type TalkType =
  | "invited_talk"
  | "conference_talk"
  | "poster"
  | "workshop"
  | "other";

export type TalkResourceType =
  | "slides"
  | "video"
  | "poster"
  | "event_page"
  | "other";

export type AcademicServiceType =
  | "reviewing"
  | "committee"
  | "mentoring"
  | "outreach"
  | "editorial"
  | "other";

export type TalkPublishChecklist = {
  errors: PublishChecklistItem[];
  warnings: PublishChecklistItem[];
};

export type TalkAdminSummary = {
  id: string;
  slug: string;
  title: string;
  eventName: string;
  startsAt: string;
  timezone: string;
  publishStatus: TalkPublishStatus;
  role: TalkRole;
  talkType: TalkType;
  updatedAt: string;
};

export type TalkResourceAdmin = {
  id: string;
  label: string;
  url: string;
  resourceType: TalkResourceType;
  sortOrder: number;
};

export type TalkRelationsAdmin = {
  publicationIds: string[];
  projectIds: string[];
  themeIds: string[];
};

export type TalkAdminDetail = {
  id: string;
  slug: string;
  title: string;
  eventName: string;
  venue: string | null;
  location: string | null;
  isOnline: boolean;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  role: TalkRole;
  talkType: TalkType;
  description: string | null;
  sortOrder: number;
  hideFromSearch: boolean;
  publishStatus: TalkPublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  resources: TalkResourceAdmin[];
  relations: TalkRelationsAdmin;
};

export type TalkPublicCard = {
  slug: string;
  title: string;
  eventName: string;
  startsAt: string;
  timezone: string;
  role: TalkRole;
  talkType: TalkType;
  isOnline: boolean;
  location?: string | null;
  venue?: string | null;
  description?: string | null;
};

export type TalkPublicResource = {
  label: string;
  url: string;
  resourceType: TalkResourceType;
};

export type TalkPublicRelated = {
  publications: ResearchPublicationCardPublic[];
  projects: ResearchProjectCardPublic[];
  themes: ResearchThemeCardPublic[];
};

export type TalkPublicDetail = TalkPublicCard & {
  endsAt?: string | null;
  resources: TalkPublicResource[];
  related: TalkPublicRelated;
};

export type TalkWriteBody = {
  slug: string;
  title: string;
  eventName: string;
  timezone: string;
  startsAt: string;
  endsAt?: string | null;
  venue?: string | null;
  location?: string | null;
  isOnline?: boolean;
  role?: TalkRole;
  talkType?: TalkType;
  description?: string | null;
  sortOrder?: number;
  hideFromSearch?: boolean;
};

export type PutTalkResourcesBody = {
  resources: {
    label: string;
    url: string;
    resourceType?: TalkResourceType;
  }[];
};

export type PutTalkRelationsBody = {
  publicationIds?: string[];
  projectIds?: string[];
  themeIds?: string[];
};

export type TalksPublicHub = {
  intro?: string | null;
  upcoming: TalkPublicCard[];
  past: TalkPublicCard[];
};

export type CollaborationWriteBody = {
  partnerName: string;
  summary: string;
  institution?: string | null;
  logoMediaId?: string | null;
  role?: string | null;
  period?: string | null;
  outcomes?: string | null;
  sortOrder?: number;
};

export type AcademicServiceWriteBody = {
  organization: string;
  roleTitle: string;
  serviceType?: AcademicServiceType;
  startYear?: number | null;
  endYear?: number | null;
  proofUrl?: string | null;
  summary?: string | null;
  sortOrder?: number;
};

export type CollaborationAdmin = {
  id: string;
  partnerName: string;
  institution: string | null;
  logoMediaId: string | null;
  role: string | null;
  period: string | null;
  summary: string;
  outcomes: string | null;
  sortOrder: number;
  publishStatus: TalkPublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CollaborationPublicCard = {
  partnerName: string;
  institution?: string | null;
  role?: string | null;
  period?: string | null;
  summary: string;
  outcomes?: string | null;
  logo: { url: string; alt: string } | null;
};

export type AcademicServiceAdmin = {
  id: string;
  serviceType: AcademicServiceType;
  organization: string;
  roleTitle: string;
  startYear: number | null;
  endYear: number | null;
  proofUrl: string | null;
  summary: string | null;
  sortOrder: number;
  publishStatus: TalkPublishStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AcademicServicePublicRow = {
  serviceType: AcademicServiceType;
  organization: string;
  roleTitle: string;
  startYear?: number | null;
  endYear?: number | null;
  proofUrl?: string | null;
  summary?: string | null;
};

export type CollaborationsPagePublic = {
  pageEnabled: boolean;
  intro?: string | null;
  collaborations: CollaborationPublicCard[];
  service: AcademicServicePublicRow[];
};

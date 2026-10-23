import { adminClient } from "../../admin-client";
import type {
  PublicationAuthor,
  PublicationPdfMediaSummary,
  PublicationPublicDetail,
  PublicationSupplement,
  PublicationCitation,
  PublicationImportConfirmBody,
  PublicationImportPreview,
  PublicationImportPreviewBody,
  PublicationPublishChecklist,
  PublicationType,
  PublicationWriteBody,
} from "../../types/publication.types";

export type PublicationAdminSummary = {
  id: string;
  slug: string;
  title: string;
  authorsShort: string;
  authors: PublicationAuthor[];
  year: number;
  venue: string;
  significance: string | null;
  abstract: string | null;
  publicationType: PublicationType;
  peerReviewed: boolean;
  doi: string | null;
  publisherUrl: string | null;
  featured: boolean;
  featuredOnHome: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  ownerContribution: string | null;
  correctionNotice: string | null;
  hideFromSearch: boolean;
  supplements: PublicationSupplement[];
  pdfMediaId: string | null;
  openAccess: boolean;
  pdfRightsGranted: boolean;
  pdfMedia?: PublicationPdfMediaSummary | null;
  publishStatus: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  duplicateHint?: boolean;
};

export type ListPublicationsParams = {
  q?: string;
  publishStatus?: string;
  year?: number;
  publicationType?: PublicationType;
  limit?: number;
};

export const adminPublicationsApi = {
  list: (params?: ListPublicationsParams) =>
    adminClient.get<PublicationAdminSummary[]>("/publications", { params }),

  get: (id: string) =>
    adminClient.get<PublicationAdminSummary>(`/publications/${id}`),

  preview: (id: string) =>
    adminClient.get<PublicationPublicDetail>(`/publications/${id}/preview`),

  citation: (id: string) =>
    adminClient.get<PublicationCitation>(`/publications/${id}/citation`),

  getPublishCheck: (id: string) =>
    adminClient.get<PublicationPublishChecklist>(
      `/publications/${id}/publish-check`,
    ),

  create: (body: PublicationWriteBody) =>
    adminClient.post<PublicationAdminSummary>("/publications", body),

  update: (id: string, body: Partial<PublicationWriteBody>) =>
    adminClient.patch<PublicationAdminSummary>(`/publications/${id}`, body),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<PublicationAdminSummary>(
      `/publications/${id}/publish`,
      body ?? {},
    ),

  unpublish: (id: string) =>
    adminClient.post<PublicationAdminSummary>(`/publications/${id}/unpublish`),

  archive: (id: string) =>
    adminClient.post<PublicationAdminSummary>(`/publications/${id}/archive`),

  schedule: (id: string, body: { scheduledAt: string }) =>
    adminClient.post<PublicationAdminSummary>(
      `/publications/${id}/schedule`,
      body,
    ),

  importPreview: (body: PublicationImportPreviewBody) =>
    adminClient.post<PublicationImportPreview>(
      "/publications/import/preview",
      body,
    ),

  importConfirm: (body: PublicationImportConfirmBody) =>
    adminClient.post<PublicationAdminSummary>(
      "/publications/import/confirm",
      body,
    ),
};

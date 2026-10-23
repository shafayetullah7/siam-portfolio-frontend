import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  ArticleRelations,
  WritingAdminDetail,
  WritingAdminSummary,
  WritingPublishChecklist,
  WritingPublicDetail,
  WritingWriteBody,
} from "../../types/writing.types";

export type ListWritingParams = {
  q?: string;
  publishStatus?: string;
  tag?: string;
  seriesId?: string;
  page?: number;
  limit?: number;
  sort?: "updatedAtDesc" | "titleAsc" | "publishedAtDesc";
};

export const adminWritingApi = {
  list: (params?: ListWritingParams) =>
    adminClient.get<Paginated<WritingAdminSummary>>("/writing", { params }),

  get: (id: string) =>
    adminClient.get<WritingAdminDetail>(`/writing/${id}`),

  preview: (id: string) =>
    adminClient.get<WritingPublicDetail>(`/writing/${id}/preview`),

  getPublishCheck: (id: string) =>
    adminClient.get<WritingPublishChecklist>(`/writing/${id}/publish-check`),

  create: (body: WritingWriteBody) =>
    adminClient.post<WritingAdminDetail>("/writing", body),

  update: (id: string, body: Partial<WritingWriteBody>) =>
    adminClient.patch<WritingAdminDetail>(`/writing/${id}`, body),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<WritingAdminDetail>(
      `/writing/${id}/publish`,
      body ?? {},
    ),

  unpublish: (id: string) =>
    adminClient.post<WritingAdminDetail>(`/writing/${id}/unpublish`),

  archive: (id: string) =>
    adminClient.post<WritingAdminDetail>(`/writing/${id}/archive`),

  schedule: (id: string, body: { scheduledAt: string }) =>
    adminClient.post<WritingAdminDetail>(`/writing/${id}/schedule`, body),

  getRelations: (id: string) =>
    adminClient.get<ArticleRelations>(`/writing/${id}/relations`),

  putRelations: (id: string, body: Partial<ArticleRelations>) =>
    adminClient.put<ArticleRelations>(`/writing/${id}/relations`, body),
};

import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  TimelineAdminDetail,
  TimelineAdminSummary,
  TimelinePublicDetail,
  TimelinePublishChecklist,
  TimelineReplaceMediaBody,
  TimelineWriteBody,
} from "../../types/timeline.types";

export type ListTimelineParams = {
  q?: string;
  publishStatus?: string;
  kind?: string;
  kinds?: string[];
  page?: number;
  limit?: number;
  sort?: "startDateDesc" | "updatedAtDesc" | "titleAsc" | "sortOrderAsc";
};

export type ReorderTimelineBody = {
  items: { id: string; sortOrder: number }[];
  kinds?: string[];
};

export const adminTimelineApi = {
  list: (params?: ListTimelineParams) =>
    adminClient.get<Paginated<TimelineAdminSummary>>("/timeline", { params }),

  get: (id: string) => adminClient.get<TimelineAdminDetail>(`/timeline/${id}`),

  create: (body: TimelineWriteBody) =>
    adminClient.post<TimelineAdminDetail>("/timeline", body),

  update: (id: string, body: Partial<TimelineWriteBody>) =>
    adminClient.patch<TimelineAdminDetail>(`/timeline/${id}`, body),

  replaceMedia: (id: string, body: TimelineReplaceMediaBody) =>
    adminClient.put<TimelineAdminDetail>(`/timeline/${id}/media`, body),

  preview: (id: string) =>
    adminClient.get<TimelinePublicDetail>(`/timeline/${id}/preview`),

  getPublishCheck: (id: string) =>
    adminClient.get<TimelinePublishChecklist>(`/timeline/${id}/publish-check`),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<TimelineAdminDetail>(`/timeline/${id}/publish`, body ?? {}),

  unpublish: (id: string) =>
    adminClient.post<TimelineAdminDetail>(`/timeline/${id}/unpublish`),

  archive: (id: string) =>
    adminClient.post<TimelineAdminDetail>(`/timeline/${id}/archive`),

  schedule: (id: string, body: { scheduledAt: string }) =>
    adminClient.post<TimelineAdminDetail>(`/timeline/${id}/schedule`, body),

  reorder: (body: ReorderTimelineBody) =>
    adminClient.post<{ ok: boolean }>("/timeline/reorder", body),
};

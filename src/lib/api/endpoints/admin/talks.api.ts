import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  PutTalkRelationsBody,
  PutTalkResourcesBody,
  TalkAdminDetail,
  TalkAdminSummary,
  TalkPublishChecklist,
  TalkWriteBody,
} from "../../types/talks.types";

export type ListTalksParams = {
  q?: string;
  publishStatus?: string;
  talkType?: string;
  page?: number;
  limit?: number;
  sort?: "updatedAtDesc" | "startsAtDesc" | "startsAtAsc" | "titleAsc";
};

export const adminTalksApi = {
  list: (params?: ListTalksParams) =>
    adminClient.get<Paginated<TalkAdminSummary>>("/talks", { params }),

  get: (id: string) => adminClient.get<TalkAdminDetail>(`/talks/${id}`),

  create: (body: TalkWriteBody) =>
    adminClient.post<TalkAdminDetail>("/talks", body),

  update: (id: string, body: Partial<TalkWriteBody>) =>
    adminClient.patch<TalkAdminDetail>(`/talks/${id}`, body),

  putResources: (id: string, body: PutTalkResourcesBody) =>
    adminClient.put<TalkAdminDetail>(`/talks/${id}/resources`, body),

  putRelations: (id: string, body: PutTalkRelationsBody) =>
    adminClient.put<TalkAdminDetail>(`/talks/${id}/relations`, body),

  delete: (id: string) => adminClient.delete<null>(`/talks/${id}`),

  getPublishCheck: (id: string) =>
    adminClient.get<TalkPublishChecklist>(`/talks/${id}/publish-check`),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<TalkAdminDetail>(`/talks/${id}/publish`, body ?? {}),

  unpublish: (id: string) =>
    adminClient.post<TalkAdminDetail>(`/talks/${id}/unpublish`),

  schedule: (
    id: string,
    body: { scheduledAt: string; confirmWarnings?: boolean },
  ) => adminClient.post<TalkAdminDetail>(`/talks/${id}/schedule`, body),

  archive: (id: string) =>
    adminClient.post<TalkAdminDetail>(`/talks/${id}/archive`),
};

import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  CollaborationAdmin,
  CollaborationWriteBody,
  TalkPublishChecklist,
} from "../../types/talks.types";

export type ListCollaborationsParams = {
  q?: string;
  publishStatus?: string;
  page?: number;
  limit?: number;
  sort?: "updatedAtDesc" | "sortOrderAsc" | "partnerNameAsc";
};

export const adminCollaborationsApi = {
  list: (params?: ListCollaborationsParams) =>
    adminClient.get<Paginated<CollaborationAdmin>>("/collaborations", {
      params,
    }),

  get: (id: string) =>
    adminClient.get<CollaborationAdmin>(`/collaborations/${id}`),

  create: (body: CollaborationWriteBody) =>
    adminClient.post<CollaborationAdmin>("/collaborations", body),

  update: (id: string, body: Partial<CollaborationWriteBody>) =>
    adminClient.patch<CollaborationAdmin>(`/collaborations/${id}`, body),

  delete: (id: string) =>
    adminClient.delete<null>(`/collaborations/${id}`),

  getPublishCheck: (id: string) =>
    adminClient.get<TalkPublishChecklist>(`/collaborations/${id}/publish-check`),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<CollaborationAdmin>(
      `/collaborations/${id}/publish`,
      body ?? {},
    ),

  unpublish: (id: string) =>
    adminClient.post<CollaborationAdmin>(`/collaborations/${id}/unpublish`),

  schedule: (
    id: string,
    body: { scheduledAt: string; confirmWarnings?: boolean },
  ) =>
    adminClient.post<CollaborationAdmin>(`/collaborations/${id}/schedule`, body),

  archive: (id: string) =>
    adminClient.post<CollaborationAdmin>(`/collaborations/${id}/archive`),
};

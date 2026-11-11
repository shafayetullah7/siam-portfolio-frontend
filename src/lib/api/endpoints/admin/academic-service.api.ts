import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  AcademicServiceAdmin,
  AcademicServiceWriteBody,
  TalkPublishChecklist,
} from "../../types/talks.types";

export type ListAcademicServiceParams = {
  q?: string;
  publishStatus?: string;
  serviceType?: string;
  page?: number;
  limit?: number;
  sort?: "updatedAtDesc" | "sortOrderAsc" | "startYearDesc";
};

export const adminAcademicServiceApi = {
  list: (params?: ListAcademicServiceParams) =>
    adminClient.get<Paginated<AcademicServiceAdmin>>("/academic-service", {
      params,
    }),

  get: (id: string) =>
    adminClient.get<AcademicServiceAdmin>(`/academic-service/${id}`),

  create: (body: AcademicServiceWriteBody) =>
    adminClient.post<AcademicServiceAdmin>("/academic-service", body),

  update: (id: string, body: Partial<AcademicServiceWriteBody>) =>
    adminClient.patch<AcademicServiceAdmin>(`/academic-service/${id}`, body),

  delete: (id: string) =>
    adminClient.delete<null>(`/academic-service/${id}`),

  getPublishCheck: (id: string) =>
    adminClient.get<TalkPublishChecklist>(
      `/academic-service/${id}/publish-check`,
    ),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<AcademicServiceAdmin>(
      `/academic-service/${id}/publish`,
      body ?? {},
    ),

  unpublish: (id: string) =>
    adminClient.post<AcademicServiceAdmin>(
      `/academic-service/${id}/unpublish`,
    ),

  schedule: (
    id: string,
    body: { scheduledAt: string; confirmWarnings?: boolean },
  ) =>
    adminClient.post<AcademicServiceAdmin>(
      `/academic-service/${id}/schedule`,
      body,
    ),

  archive: (id: string) =>
    adminClient.post<AcademicServiceAdmin>(`/academic-service/${id}/archive`),
};

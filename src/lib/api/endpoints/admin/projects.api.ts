import { adminClient } from "../../admin-client";
import type {
  ProjectAdminSummary,
  ProjectPublishChecklist,
  ProjectPublicDetail,
  ProjectType,
  ProjectWriteBody,
} from "../../types/project.types";

export type { ProjectAdminSummary } from "../../types/project.types";

export type ListProjectsParams = {
  q?: string;
  publishStatus?: string;
  projectType?: ProjectType;
  featured?: boolean;
  limit?: number;
};

export const adminProjectsApi = {
  list: (params?: ListProjectsParams) =>
    adminClient.get<ProjectAdminSummary[]>("/projects", { params }),

  get: (id: string) =>
    adminClient.get<ProjectAdminSummary>(`/projects/${id}`),

  preview: (id: string) =>
    adminClient.get<ProjectPublicDetail>(`/projects/${id}/preview`),

  getPublishCheck: (id: string) =>
    adminClient.get<ProjectPublishChecklist>(`/projects/${id}/publish-check`),

  create: (body: ProjectWriteBody) =>
    adminClient.post<ProjectAdminSummary>("/projects", body),

  update: (id: string, body: Partial<ProjectWriteBody>) =>
    adminClient.patch<ProjectAdminSummary>(`/projects/${id}`, body),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<ProjectAdminSummary>(`/projects/${id}/publish`, body ?? {}),

  unpublish: (id: string) =>
    adminClient.post<ProjectAdminSummary>(`/projects/${id}/unpublish`),

  archive: (id: string) =>
    adminClient.post<ProjectAdminSummary>(`/projects/${id}/archive`),

  schedule: (id: string, body: { scheduledAt: string }) =>
    adminClient.post<ProjectAdminSummary>(`/projects/${id}/schedule`, body),

  getPublications: (id: string) =>
    adminClient.get<ProjectPublicationLink[]>(`/projects/${id}/publications`),

  putPublications: (id: string, publicationIds: string[]) =>
    adminClient.put<ProjectPublicationLink[]>(`/projects/${id}/publications`, {
      publicationIds,
    }),
};

export type ProjectPublicationLink = {
  id: string;
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  publishStatus: string;
  sortOrder: number;
};

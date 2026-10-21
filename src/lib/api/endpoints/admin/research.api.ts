import { adminClient } from "../../admin-client";
import type { ResearchThemeAdmin } from "../../types/admin.types";
import type {
  ContentRevision,
  ResearchThemeRevisionSnapshot,
} from "../../types/content-revision.types";
import type {
  ResearchPublishChecklist,
  ResearchThemeDetailPublic,
  ResearchThemeProjectLink,
  ResearchThemePublicationLink,
  ResearchThemeWriteBody,
} from "../../types/research.types";

export type ListResearchParams = {
  q?: string;
  publishStatus?: string;
  themeStatus?: "ongoing" | "completed";
  featured?: boolean;
};

export const adminResearchApi = {
  list: (params?: ListResearchParams) =>
    adminClient.get<ResearchThemeAdmin[]>("/research", { params }),

  get: (id: string) => adminClient.get<ResearchThemeAdmin>(`/research/${id}`),

  preview: (id: string) =>
    adminClient.get<ResearchThemeDetailPublic>(`/research/${id}/preview`),

  create: (body: ResearchThemeWriteBody) =>
    adminClient.post<ResearchThemeAdmin>("/research", body),

  update: (id: string, body: Partial<ResearchThemeWriteBody>) =>
    adminClient.patch<ResearchThemeAdmin>(`/research/${id}`, body),

  getPublishCheck: (id: string) =>
    adminClient.get<ResearchPublishChecklist>(
      `/research/${id}/publish-check`,
    ),

  publish: (id: string, body?: { confirmWarnings?: boolean }) =>
    adminClient.post<ResearchThemeAdmin>(`/research/${id}/publish`, body ?? {}),

  unpublish: (id: string) =>
    adminClient.post<ResearchThemeAdmin>(`/research/${id}/unpublish`),

  archive: (id: string) =>
    adminClient.post<ResearchThemeAdmin>(`/research/${id}/archive`),

  schedule: (id: string, body: { scheduledAt: string }) =>
    adminClient.post<ResearchThemeAdmin>(`/research/${id}/schedule`, body),

  listRevisions: (id: string) =>
    adminClient.get<ContentRevision<ResearchThemeRevisionSnapshot>[]>(
      `/research/${id}/revisions`,
    ),

  /** Admin UI is view-only; endpoint kept for API parity. */
  restoreRevision: (id: string, revisionId: string) =>
    adminClient.post<ResearchThemeAdmin>(
      `/research/${id}/revisions/${revisionId}/restore`,
    ),

  getPublications: (id: string) =>
    adminClient.get<ResearchThemePublicationLink[]>(
      `/research/${id}/publications`,
    ),

  putPublications: (id: string, body: { publicationIds: string[] }) =>
    adminClient.put<ResearchThemePublicationLink[]>(
      `/research/${id}/publications`,
      body,
    ),

  getProjects: (id: string) =>
    adminClient.get<ResearchThemeProjectLink[]>(`/research/${id}/projects`),

  putProjects: (id: string, body: { projectIds: string[] }) =>
    adminClient.put<ResearchThemeProjectLink[]>(
      `/research/${id}/projects`,
      body,
    ),
};

import { adminClient } from "../../admin-client";

export type ProjectAdminSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[] | null;
  publishStatus: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListProjectsParams = {
  q?: string;
  publishStatus?: string;
  limit?: number;
};

export const adminProjectsApi = {
  list: (params?: ListProjectsParams) =>
    adminClient.get<ProjectAdminSummary[]>("/projects", { params }),

  get: (id: string) =>
    adminClient.get<ProjectAdminSummary>(`/projects/${id}`),
};

import { adminClient } from "../../admin-client";

export type PublicationAdminSummary = {
  id: string;
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  significance: string | null;
  publishStatus: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListPublicationsParams = {
  q?: string;
  publishStatus?: string;
  limit?: number;
};

export const adminPublicationsApi = {
  list: (params?: ListPublicationsParams) =>
    adminClient.get<PublicationAdminSummary[]>("/publications", { params }),

  get: (id: string) =>
    adminClient.get<PublicationAdminSummary>(`/publications/${id}`),
};

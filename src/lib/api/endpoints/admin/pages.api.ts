import { adminClient } from "../../admin-client";
import type { SitePageAdmin } from "../../types/admin.types";

export const adminPagesApi = {
  list: () => adminClient.get<SitePageAdmin[]>("/pages"),

  get: (id: string) => adminClient.get<SitePageAdmin>(`/pages/${id}`),

  create: (body: {
    slug: string;
    title: string;
    body?: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }) => adminClient.post<SitePageAdmin>("/pages", body),

  update: (
    id: string,
    body: Partial<{
      slug: string;
      title: string;
      body: string;
      seoTitle: string | null;
      seoDescription: string | null;
    }>,
  ) => adminClient.patch<SitePageAdmin>(`/pages/${id}`, body),

  publish: (id: string) => adminClient.post<SitePageAdmin>(`/pages/${id}/publish`),

  unpublish: (id: string) =>
    adminClient.post<SitePageAdmin>(`/pages/${id}/unpublish`),

  preview: (id: string) =>
    adminClient.get<SitePageAdmin>(`/pages/${id}/preview`),
};

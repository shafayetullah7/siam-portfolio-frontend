import { publicClient } from "../../public-client";

export interface SitePagePublic {
  slug: string;
  title: string;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
}

export const pagesPublicApi = {
  bySlug: (slug: string) =>
    publicClient.get<SitePagePublic>(`/pages/${slug}`),
};

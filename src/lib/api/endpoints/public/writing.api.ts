import { publicClient } from "../../public-client";
import type {
  WritingPublicDetail,
  WritingPublicList,
} from "../../types/writing.types";

export type PublicWritingListParams = {
  q?: string;
  tag?: string;
  series?: string;
  sort?: "publishedAtDesc" | "titleAsc";
  featuredOnHub?: boolean;
  excludeFeaturedOnHub?: boolean;
  page?: number;
  limit?: number;
};

export const writingPublicApi = {
  list: (params?: PublicWritingListParams) =>
    publicClient.get<WritingPublicList>("/writing", { params }),

  bySlug: (slug: string) =>
    publicClient.get<WritingPublicDetail>(`/writing/${slug}`),
};

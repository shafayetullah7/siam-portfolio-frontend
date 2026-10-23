import { publicClient } from "../../public-client";
import type { Paginated } from "../../types";
import type {
  TimelinePublicCard,
  TimelinePublicDetail,
  TimelinePublicGroupedList,
} from "../../types/timeline.types";

export type PublicTimelineListParams = {
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: "startDateDesc" | "sortOrderAsc" | "titleAsc";
  kind?: string;
  kinds?: string[];
};

export const timelinePublicApi = {
  listAchievements: (params?: PublicTimelineListParams) =>
    publicClient.get<TimelinePublicGroupedList>("/timeline/achievements", {
      params,
    }),

  listExperience: (params?: PublicTimelineListParams) =>
    publicClient.get<TimelinePublicGroupedList>("/timeline/experience", {
      params,
    }),

  list: (params?: PublicTimelineListParams) =>
    publicClient.get<Paginated<TimelinePublicCard>>("/timeline", { params }),

  bySlug: (slug: string) =>
    publicClient.get<TimelinePublicDetail>(`/timeline/${slug}`),
};

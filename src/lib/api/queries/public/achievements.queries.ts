import { query } from "@solidjs/router";
import {
  timelinePublicApi,
  type PublicTimelineListParams,
} from "../../endpoints/public/timeline.api";
import { isApiError } from "../../errors";

function achievementsListCacheKey(params: PublicTimelineListParams = {}) {
  return JSON.stringify({
    featured: params.featured ?? "",
    page: params.page ?? "",
    limit: params.limit ?? "",
    sort: params.sort ?? "",
    kind: params.kind ?? "",
    kinds: params.kinds ?? "",
  });
}

export const getPublicAchievements = query(
  async (params: PublicTimelineListParams = {}) => {
    return await timelinePublicApi.listAchievements(params);
  },
  "public-achievements",
);

getPublicAchievements.keyFor = (params: PublicTimelineListParams = {}) =>
  `public-achievements:${achievementsListCacheKey(params)}`;

export const getPublicAchievementBySlug = query(async (slug: string) => {
  try {
    return await timelinePublicApi.bySlug(slug);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}, "public-achievement-slug");

getPublicAchievementBySlug.keyFor = (slug: string) =>
  `public-achievement-slug:${slug}`;

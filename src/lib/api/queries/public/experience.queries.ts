import { query } from "@solidjs/router";
import {
  timelinePublicApi,
  type PublicTimelineListParams,
} from "../../endpoints/public/timeline.api";

function experienceListCacheKey(params: PublicTimelineListParams = {}) {
  return JSON.stringify({
    featured: params.featured ?? "",
    page: params.page ?? "",
    limit: params.limit ?? "",
    sort: params.sort ?? "",
    kind: params.kind ?? "",
    kinds: params.kinds ?? "",
  });
}

export const getPublicExperience = query(
  async (params: PublicTimelineListParams = {}) => {
    return await timelinePublicApi.listExperience(params);
  },
  "public-experience",
);

getPublicExperience.keyFor = (params: PublicTimelineListParams = {}) =>
  `public-experience:${experienceListCacheKey(params)}`;

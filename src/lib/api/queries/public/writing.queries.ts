import { query } from "@solidjs/router";
import {
  writingPublicApi,
  type PublicWritingListParams,
} from "../../endpoints/public/writing.api";

function writingListCacheKey(params: PublicWritingListParams = {}) {
  return JSON.stringify({
    q: params.q ?? "",
    tag: params.tag ?? "",
    featuredOnHub: params.featuredOnHub ?? "",
    excludeFeaturedOnHub: params.excludeFeaturedOnHub ?? "",
    page: params.page ?? "",
    limit: params.limit ?? "",
  });
}

export const getPublicWriting = query(
  async (params: PublicWritingListParams = {}) => {
    return await writingPublicApi.list(params);
  },
  "public-writing",
);

getPublicWriting.keyFor = (params: PublicWritingListParams = {}) =>
  `public-writing:${writingListCacheKey(params)}`;

import { query } from "@solidjs/router";
import {
  writingPublicApi,
  type PublicWritingListParams,
} from "../../endpoints/public/writing.api";
import { isApiError } from "../../errors";

function writingListCacheKey(params: PublicWritingListParams = {}) {
  return JSON.stringify({
    q: params.q ?? "",
    tag: params.tag ?? "",
    series: params.series ?? "",
    sort: params.sort ?? "",
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

export const getPublicWritingBySlug = query(async (slug: string) => {
  try {
    return await writingPublicApi.bySlug(slug);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}, "public-writing-slug");

getPublicWritingBySlug.keyFor = (slug: string) => `public-writing-slug:${slug}`;

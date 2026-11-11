import { query } from "@solidjs/router";
import { talksPublicApi } from "../../endpoints/public/talks.api";
import { isApiError } from "../../errors";

export const getPublicTalks = query(async () => {
  return await talksPublicApi.hub();
}, "public-talks");

getPublicTalks.keyFor = () => "public-talks";

export const getPublicTalkBySlug = query(async (slug: string) => {
  try {
    return await talksPublicApi.bySlug(slug);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}, "public-talks-slug");

getPublicTalkBySlug.keyFor = (slug: string) => `public-talks-slug:${slug}`;

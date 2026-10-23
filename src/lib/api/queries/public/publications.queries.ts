import { query } from "@solidjs/router";
import {
  publicationsPublicApi,
  type PublicPublicationsListParams,
} from "../../endpoints/public/publications.api";
import { isApiError } from "../../errors";

function publicationsListCacheKey(params: PublicPublicationsListParams = {}) {
  return JSON.stringify({
    q: params.q ?? "",
    year: params.year ?? "",
    type: params.type ?? "",
    theme: params.theme ?? "",
    page: params.page ?? 1,
    limit: params.limit ?? "",
  });
}

export const getPublicPublications = query(
  async (params: PublicPublicationsListParams = {}) => {
    return await publicationsPublicApi.list(params);
  },
  "public-publications",
);

getPublicPublications.keyFor = (params: PublicPublicationsListParams = {}) =>
  `public-publications:${publicationsListCacheKey(params)}`;

export const getPublicPublicationBibtex = query(
  async (slug: string) => {
    try {
      return await publicationsPublicApi.bibtex(slug);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-publication-bibtex",
);

getPublicPublicationBibtex.keyFor = (slug: string) =>
  `public-publication-bibtex:${slug}`;

export const getPublicPublicationBySlug = query(
  async (slug: string) => {
    try {
      return await publicationsPublicApi.bySlug(slug);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-publication",
);

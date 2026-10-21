import { query } from "@solidjs/router";
import { researchPublicApi } from "../../endpoints/public/research.api";
import { isApiError } from "../../errors";

export const getPublicResearchThemes = query(
  () => researchPublicApi.list(),
  "public-research-themes",
);

export const getPublicResearchTheme = query(
  async (slug: string) => {
    try {
      return await researchPublicApi.bySlug(slug);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-research-theme",
);

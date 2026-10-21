import { publicClient } from "../../public-client";
import type {
  ResearchThemeDetailPublic,
  ResearchThemeListPublic,
} from "../../types/research.types";

export const researchPublicApi = {
  list: () =>
    publicClient.get<ResearchThemeListPublic>("/research-themes"),

  bySlug: (slug: string) =>
    publicClient.get<ResearchThemeDetailPublic>(`/research-themes/${slug}`),
};

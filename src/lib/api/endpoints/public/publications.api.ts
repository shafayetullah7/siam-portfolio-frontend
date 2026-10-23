import { publicClient } from "../../public-client";
import type {
  PublicationCitation,
  PublicationListPublic,
  PublicationPublicDetail,
  PublicationType,
} from "../../types/publication.types";

export type PublicPublicationsListParams = {
  q?: string;
  year?: number;
  type?: PublicationType;
  theme?: string;
  page?: number;
  limit?: number;
};

export const publicationsPublicApi = {
  list: (params?: PublicPublicationsListParams) =>
    publicClient.get<PublicationListPublic>("/publications", { params }),

  bySlug: (slug: string) =>
    publicClient.get<PublicationPublicDetail>(`/publications/${slug}`),

  bibtex: (slug: string) =>
    publicClient.get<PublicationCitation>(`/publications/${slug}/bibtex`),
};

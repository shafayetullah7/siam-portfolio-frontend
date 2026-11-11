import { publicClient } from "../../public-client";
import type { TalkPublicDetail, TalksPublicHub } from "../../types/talks.types";

export const talksPublicApi = {
  hub: () => publicClient.get<TalksPublicHub>("/talks"),

  bySlug: (slug: string) =>
    publicClient.get<TalkPublicDetail>(`/talks/${slug}`),
};

import { publicClient } from "../../public-client";
import type { CollaborationsPagePublic } from "../../types/talks.types";

export const collaborationsPublicApi = {
  getPage: () =>
    publicClient.get<CollaborationsPagePublic>("/collaborations-page"),
};

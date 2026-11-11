import { query } from "@solidjs/router";
import { collaborationsPublicApi } from "../../endpoints/public/collaborations.api";

export const getPublicCollaborationsPage = query(async () => {
  return await collaborationsPublicApi.getPage();
}, "public-collaborations-page");

getPublicCollaborationsPage.keyFor = () => "public-collaborations-page";

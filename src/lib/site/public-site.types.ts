import type { PublicSitePayload } from "~/lib/api/endpoints/public/site.api";

export type PublicSiteNavItem = PublicSitePayload["nav"][number];
export type { PublicSitePayload };

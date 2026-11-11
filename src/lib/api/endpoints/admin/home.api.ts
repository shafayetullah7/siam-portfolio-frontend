import { adminClient } from "../../admin-client";
import type { PublicHomePayload } from "../public/site.api";
import type {
  HomeAdminAggregate,
  HomeFeaturedSummaryResponse,
  HomePublishChecklist,
  HomepageAdmin,
  PublishSingletonBody,
  UpdateHomepageBody,
} from "../../types/home.types";

export const adminHomeApi = {
  getAggregate: () => adminClient.get<HomeAdminAggregate>("/home"),

  update: (body: UpdateHomepageBody) =>
    adminClient.patch<HomepageAdmin>("/home", body),

  getPublishCheck: () =>
    adminClient.get<HomePublishChecklist>("/home/publish-check"),

  publish: (body?: PublishSingletonBody) =>
    adminClient.post<HomepageAdmin>("/home/publish", body ?? {}),

  unpublish: () => adminClient.post<HomepageAdmin>("/home/unpublish", {}),

  preview: () => adminClient.get<PublicHomePayload>("/home/preview"),

  featuredSummary: () =>
    adminClient.get<HomeFeaturedSummaryResponse>("/home/featured-summary"),
};

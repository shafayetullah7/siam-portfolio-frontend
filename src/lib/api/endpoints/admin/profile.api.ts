import { adminClient } from "../../admin-client";
import type {
  HomePublishChecklist,
  ProfileAdmin,
  PublishSingletonBody,
  UpdateProfileBody,
} from "../../types/home.types";

export const adminProfileApi = {
  get: () => adminClient.get<ProfileAdmin>("/profile"),

  update: (body: UpdateProfileBody) =>
    adminClient.patch<ProfileAdmin>("/profile", body),

  getPublishCheck: () =>
    adminClient.get<HomePublishChecklist>("/profile/publish-check"),

  publish: (body?: PublishSingletonBody) =>
    adminClient.post<ProfileAdmin>("/profile/publish", body ?? {}),

  unpublish: () => adminClient.post<ProfileAdmin>("/profile/unpublish", {}),
};

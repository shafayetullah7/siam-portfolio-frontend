import { adminClient } from "../../admin-client";
import type { AdminProfile } from "../../types/admin.types";

export const adminAuthApi = {
  check: () =>
    adminClient.get<AdminProfile>("/auth/check", { strictAuth: false }),

  login: (body: { email: string; password: string }) =>
    adminClient.post<AdminProfile>("/auth/login", body, { strictAuth: false }),

  logout: () =>
    adminClient.post<void>("/auth/logout", undefined, {
      skipAuthHandler: true,
      strictAuth: false,
    }),

  refresh: () =>
    adminClient.post<void>("/auth/refresh", undefined, { strictAuth: false }),
};

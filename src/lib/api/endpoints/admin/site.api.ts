import { adminClient } from "../../admin-client";
import type { NavItemAdmin, SiteSettingsAdmin } from "../../types/admin.types";

export const adminSiteApi = {
  getSettings: () => adminClient.get<SiteSettingsAdmin>("/site/settings"),

  updateSettings: (body: {
    siteName?: string;
    defaultMetaDescription?: string | null;
    footerText?: string | null;
    faviconUrl?: string | null;
    faviconMediaId?: string | null;
  }) => adminClient.patch<SiteSettingsAdmin>("/site/settings", body),

  listNav: () => adminClient.get<NavItemAdmin[]>("/site/nav"),

  upsertNav: (body: {
    id?: string;
    label: string;
    path: string;
    sortOrder?: number;
    visible?: boolean;
  }) => adminClient.post<NavItemAdmin>("/site/nav", body),
};

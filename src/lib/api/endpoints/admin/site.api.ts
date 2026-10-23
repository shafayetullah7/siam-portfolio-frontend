import { adminClient } from "../../admin-client";
import type { NavItemAdmin, SiteSettingsAdmin } from "../../types/admin.types";

export const adminSiteApi = {
  getSettings: () => adminClient.get<SiteSettingsAdmin>("/site/settings"),

  updateSettings: (body: Partial<
    Pick<
      SiteSettingsAdmin,
      | "siteName"
      | "defaultMetaDescription"
      | "footerText"
      | "researchHubIntro"
      | "projectsHubIntro"
      | "writingHubIntro"
      | "achievementsHubIntro"
      | "experienceHubIntro"
      | "contactFormEnabled"
      | "contactPageIntro"
      | "contactCollaborationGuidance"
      | "contactResponseTimeNote"
      | "contactCategories"
      | "contactConsentText"
      | "contactSuccessMessage"
      | "contactPublicEmail"
      | "contactShowEmailOnPage"
      | "faviconUrl"
      | "faviconMediaId"
    >
  >) => adminClient.patch<SiteSettingsAdmin>("/site/settings", body),

  listNav: () => adminClient.get<NavItemAdmin[]>("/site/nav"),

  upsertNav: (body: {
    id?: string;
    label: string;
    path: string;
    sortOrder?: number;
    visible?: boolean;
  }) => adminClient.post<NavItemAdmin>("/site/nav", body),
};

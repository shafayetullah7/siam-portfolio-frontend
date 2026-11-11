import type { z } from "zod";
import { adminSiteSettingsSchema } from "./admin-site-settings.schema";

export const adminSiteGlobalPanelSchema = adminSiteSettingsSchema.pick({
  siteName: true,
  defaultMetaDescription: true,
  footerText: true,
  faviconUrl: true,
  faviconMediaId: true,
});

export const adminSiteHubsPanelSchema = adminSiteSettingsSchema.pick({
  researchHubIntro: true,
  projectsHubIntro: true,
  writingHubIntro: true,
  talksHubIntro: true,
  collaborationsPageIntro: true,
  collaborationsPageEnabled: true,
  achievementsHubIntro: true,
  experienceHubIntro: true,
});

export const adminSiteContactPanelSchema = adminSiteSettingsSchema.pick({
  contactFormEnabled: true,
  contactPageIntro: true,
  contactCollaborationGuidance: true,
  contactResponseTimeNote: true,
  contactCategories: true,
  contactConsentText: true,
  contactSuccessMessage: true,
  contactPublicEmail: true,
  contactShowEmailOnPage: true,
});

export type AdminSiteGlobalPanelInput = z.infer<typeof adminSiteGlobalPanelSchema>;
export type AdminSiteHubsPanelInput = z.infer<typeof adminSiteHubsPanelSchema>;
export type AdminSiteContactPanelInput = z.infer<typeof adminSiteContactPanelSchema>;

import { z } from "zod";

export const adminSiteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(200),
  defaultMetaDescription: z.string().max(320).nullable().optional(),
  footerText: z.string().nullable().optional(),
  researchHubIntro: z.string().max(10_000).nullable().optional(),
  projectsHubIntro: z.string().max(10_000).nullable().optional(),
  writingHubIntro: z.string().max(10_000).nullable().optional(),
  achievementsHubIntro: z.string().max(10_000).nullable().optional(),
  experienceHubIntro: z.string().max(10_000).nullable().optional(),
  faviconUrl: z.string().max(500).nullable().optional(),
  faviconMediaId: z.string().uuid().nullable().optional(),
});

export type AdminSiteSettingsInput = z.infer<typeof adminSiteSettingsSchema>;

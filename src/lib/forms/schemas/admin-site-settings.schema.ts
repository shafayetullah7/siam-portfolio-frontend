import { z } from "zod";

function normalizeContactCategories(categories: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of categories) {
    const trimmed = raw.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= 20) break;
  }
  return result;
}

const nullableLongText = z.string().max(10_000).nullable().optional();

export const adminSiteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(200),
  defaultMetaDescription: z.string().max(320).nullable().optional(),
  footerText: z.string().nullable().optional(),
  researchHubIntro: nullableLongText,
  projectsHubIntro: nullableLongText,
  writingHubIntro: nullableLongText,
  achievementsHubIntro: nullableLongText,
  experienceHubIntro: nullableLongText,
  contactFormEnabled: z.boolean(),
  contactPageIntro: nullableLongText,
  contactCollaborationGuidance: nullableLongText,
  contactResponseTimeNote: nullableLongText,
  contactCategories: z
    .array(z.string().max(100))
    .max(20)
    .transform(normalizeContactCategories),
  contactConsentText: nullableLongText,
  contactSuccessMessage: nullableLongText,
  contactPublicEmail: z
    .union([z.string().max(320), z.null()])
    .refine(
      (v) => v === null || z.email().safeParse(v).success,
      "Enter a valid email address",
    ),
  contactShowEmailOnPage: z.boolean(),
  faviconUrl: z.string().max(500).nullable().optional(),
  faviconMediaId: z.string().uuid().nullable().optional(),
});

export type AdminSiteSettingsInput = z.infer<typeof adminSiteSettingsSchema>;

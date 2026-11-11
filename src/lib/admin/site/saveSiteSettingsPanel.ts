import { revalidate } from "@solidjs/router";
import { adminSiteApi } from "~/lib/api/endpoints/admin/site.api";
import { mapAdminMutationError } from "~/lib/forms/mapAdminMutationError";
import {
  adminSiteContactPanelSchema,
  adminSiteGlobalPanelSchema,
  adminSiteHubsPanelSchema,
} from "~/lib/forms/schemas/admin-site-settings-panels.schema";
import {
  getPublicAchievements,
  getPublicCollaborationsPage,
  getPublicContactConfig,
  getPublicExperience,
  getPublicHome,
  getPublicResearchThemes,
  getPublicSite,
  getPublicTalks,
} from "~/lib/api/queries/public";
import type { z } from "zod";

export type SiteSettingsPanelKind = "global" | "hubs" | "contact";

export type SaveSiteSettingsPanelResult =
  | { ok: true }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

function schemaFor(kind: SiteSettingsPanelKind) {
  switch (kind) {
    case "global":
      return adminSiteGlobalPanelSchema;
    case "hubs":
      return adminSiteHubsPanelSchema;
    case "contact":
      return adminSiteContactPanelSchema;
  }
}

function flattenZodErrors(
  error: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}

export function revalidateAfterSiteSettingsSave(): void {
  revalidate(getPublicSite.key);
  revalidate(getPublicContactConfig.key);
  revalidate(getPublicHome.key);
  revalidate(getPublicResearchThemes.key);
  revalidate(getPublicAchievements.key);
  revalidate(getPublicExperience.key);
  revalidate(getPublicTalks.key);
  revalidate(getPublicCollaborationsPage.key);
}

export async function saveSiteSettingsPanel(
  kind: SiteSettingsPanelKind,
  input: unknown,
): Promise<SaveSiteSettingsPanelResult> {
  const parsed = schemaFor(kind).safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      formMessage: "Fix the highlighted fields and try again.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    await adminSiteApi.updateSettings(parsed.data);
    revalidateAfterSiteSettingsSave();
    return { ok: true };
  } catch (error) {
    const { formMessage, fieldErrors } = mapAdminMutationError(error);
    return { ok: false, formMessage, fieldErrors };
  }
}

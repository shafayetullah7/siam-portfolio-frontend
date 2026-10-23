import { action, revalidate } from "@solidjs/router";
import { adminSiteApi } from "~/lib/api/endpoints/admin/site.api";
import {
  getPublicHome,
  getPublicResearchThemes,
  getPublicSite,
} from "~/lib/api/queries/public";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import { emptyToNull, parseCheckbox, parseWithSchema } from "~/lib/forms/parseFormData";
import { adminNavItemSchema } from "~/lib/forms/schemas/admin-nav-item.schema";
import { adminSiteSettingsSchema } from "~/lib/forms/schemas/admin-site-settings.schema";
import { formSuccess, type FormActionResult } from "~/lib/forms/types";

export const saveSiteSettingsAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      siteName: fd.get("siteName")?.toString() ?? "",
      defaultMetaDescription: emptyToNull(
        fd.get("defaultMetaDescription")?.toString(),
      ),
      footerText: emptyToNull(fd.get("footerText")?.toString()),
      researchHubIntro: emptyToNull(fd.get("researchHubIntro")?.toString()),
      projectsHubIntro: emptyToNull(fd.get("projectsHubIntro")?.toString()),
      faviconUrl: emptyToNull(fd.get("faviconUrl")?.toString()),
      faviconMediaId: emptyToNull(fd.get("faviconMediaId")?.toString()),
    }),
    adminSiteSettingsSchema,
  );
  if (!parsed.success) return parsed.result;

  try {
    await adminSiteApi.updateSettings(parsed.data);
    revalidate(getPublicSite.key);
    revalidate(getPublicHome.key);
    revalidate(getPublicResearchThemes.key);
    return formSuccess();
  } catch (error) {
    return mapAdminMutationErrorToResult(error);
  }
}, "saveSiteSettings");

export const saveNavRowAction = action(
  async (navId: string, formData: FormData): Promise<FormActionResult> => {
    const parsed = parseWithSchema(
      formData,
      (fd) => ({
        id: navId,
        label: fd.get("label")?.toString() ?? "",
        path: fd.get("path")?.toString() ?? "",
        sortOrder: fd.get("sortOrder")?.toString() ?? "0",
        visible: parseCheckbox(fd, "visible"),
      }),
      adminNavItemSchema,
    );
    if (!parsed.success) return parsed.result;

    try {
      await adminSiteApi.upsertNav(parsed.data);
      revalidate(getPublicSite.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "saveNavRow",
);

export const addNavItemAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      label: fd.get("label")?.toString() ?? "",
      path: fd.get("path")?.toString() ?? "",
      sortOrder: fd.get("sortOrder")?.toString() ?? "0",
      visible: parseCheckbox(fd, "visible"),
    }),
    adminNavItemSchema,
  );
  if (!parsed.success) return parsed.result;

  try {
    await adminSiteApi.upsertNav(parsed.data);
    revalidate(getPublicSite.key);
    return formSuccess();
  } catch (error) {
    return mapAdminMutationErrorToResult(error);
  }
}, "addNavItem");

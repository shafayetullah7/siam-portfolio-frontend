import { action, redirect, revalidate } from "@solidjs/router";
import { getPublicHome, getPublicResearchThemes } from "~/lib/api/queries/public";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import { emptyToNull, parseCheckbox, parseWithSchema } from "~/lib/forms/parseFormData";
import {
  adminResearchThemeSchema,
  parseCollaboratorsJson,
  parseResourcesJson,
  parseTagsFromInput,
} from "~/lib/forms/schemas/admin-research-theme.schema";
import { z } from "zod";
import {
  formFailure,
  formSuccess,
  type FormActionResult,
} from "~/lib/forms/types";

const scheduleAtSchema = z.object({
  scheduledAt: z.string().min(1, "Pick a date and time"),
});

function guardSavedTheme(themeId: string): FormActionResult | null {
  if (themeId === "new") {
    return formFailure("Save the theme before changing publish status.");
  }
  return null;
}

function themeValuesFromFormData(fd: FormData) {
  return {
    title: fd.get("title")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    summary: fd.get("summary")?.toString() ?? "",
    themeStatus: fd.get("themeStatus")?.toString() ?? "ongoing",
    problem: fd.get("problem")?.toString() ?? "",
    significance: fd.get("significance")?.toString() ?? "",
    objectives: fd.get("objectives")?.toString() ?? "",
    approach: fd.get("approach")?.toString() ?? "",
    findings: fd.get("findings")?.toString() ?? "",
    limitations: fd.get("limitations")?.toString() ?? "",
    futureWork: fd.get("futureWork")?.toString() ?? "",
    tags: parseTagsFromInput(fd.get("tags")?.toString()),
    seoTitle: emptyToNull(fd.get("seoTitle")?.toString()),
    seoDescription: emptyToNull(fd.get("seoDescription")?.toString()),
    sortOrder: fd.get("sortOrder")?.toString() ?? "0",
    featuredOnHome: parseCheckbox(fd, "featuredOnHome"),
    linkLabel: emptyToNull(fd.get("linkLabel")?.toString()),
    coverMediaId: emptyToNull(fd.get("coverMediaId")?.toString()),
    acknowledgments: fd.get("acknowledgments")?.toString() ?? "",
    funding: fd.get("funding")?.toString() ?? "",
    collaborators: parseCollaboratorsJson(
      fd.get("collaboratorsJson")?.toString(),
    ),
    resources: parseResourcesJson(fd.get("resourcesJson")?.toString()),
  };
}

export const saveResearchThemeAction = action(
  async (themeId: string, formData: FormData): Promise<FormActionResult> => {
    const parsed = parseWithSchema(
      formData,
      themeValuesFromFormData,
      adminResearchThemeSchema,
    );
    if (!parsed.success) return parsed.result;

    const payload = {
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      themeStatus: parsed.data.themeStatus,
      problem: parsed.data.problem || undefined,
      significance: emptyToNull(parsed.data.significance) ?? null,
      objectives: emptyToNull(parsed.data.objectives) ?? null,
      approach: emptyToNull(parsed.data.approach) ?? null,
      findings: emptyToNull(parsed.data.findings) ?? null,
      limitations: emptyToNull(parsed.data.limitations) ?? null,
      futureWork: emptyToNull(parsed.data.futureWork) ?? null,
      tags: parsed.data.tags.length > 0 ? parsed.data.tags : null,
      seoTitle: parsed.data.seoTitle ?? null,
      seoDescription: parsed.data.seoDescription ?? null,
      sortOrder: parsed.data.sortOrder,
      featuredOnHome: parsed.data.featuredOnHome,
      linkLabel: parsed.data.linkLabel ?? null,
      coverMediaId: parsed.data.coverMediaId ?? null,
      collaborators:
        parsed.data.collaborators.length > 0
          ? parsed.data.collaborators.map((c) => ({
              name: c.name,
              role: c.role?.trim() ? c.role.trim() : null,
              url: c.url?.trim() ? c.url.trim() : null,
            }))
          : null,
      acknowledgments: emptyToNull(parsed.data.acknowledgments) ?? null,
      funding: emptyToNull(parsed.data.funding) ?? null,
      resources: parsed.data.resources.map((r, index) => ({
        label: r.label,
        url: r.url,
        resourceType: r.resourceType,
        sortOrder: index,
      })),
    };

    try {
      if (themeId === "new") {
        const created = await adminResearchApi.create(payload);
        return redirect(`/admin/research/${created.id}`);
      }
      await adminResearchApi.update(themeId, payload);
      revalidate(getPublicHome.key);
      revalidate(getPublicResearchThemes.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "saveResearchTheme",
);

export const publishResearchThemeAction = action(
  async (
    themeId: string,
    formData: FormData,
  ): Promise<FormActionResult> => {
    const guard = guardSavedTheme(themeId);
    if (guard) return guard;
    const confirmWarnings = formData.get("confirmWarnings") === "true";
    try {
      await adminResearchApi.publish(themeId, { confirmWarnings });
      revalidate(getPublicHome.key);
      revalidate(getPublicResearchThemes.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "publishResearchTheme",
);

export const unpublishResearchThemeAction = action(
  async (themeId: string): Promise<FormActionResult> => {
    const guard = guardSavedTheme(themeId);
    if (guard) return guard;
    try {
      await adminResearchApi.unpublish(themeId);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "unpublishResearchTheme",
);

export const archiveResearchThemeAction = action(
  async (themeId: string): Promise<FormActionResult> => {
    const guard = guardSavedTheme(themeId);
    if (guard) return guard;
    try {
      await adminResearchApi.archive(themeId);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "archiveResearchTheme",
);

export const scheduleResearchThemeAction = action(
  async (themeId: string, formData: FormData): Promise<FormActionResult> => {
    const guard = guardSavedTheme(themeId);
    if (guard) return guard;
    const raw = formData.get("scheduledAt")?.toString() ?? "";
    const parsed = scheduleAtSchema.safeParse({ scheduledAt: raw });
    if (!parsed.success) {
      return formFailure("Pick a valid schedule date and time.");
    }
    const scheduledAt = new Date(parsed.data.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      return formFailure("Pick a valid schedule date and time.");
    }
    try {
      await adminResearchApi.schedule(themeId, {
        scheduledAt: scheduledAt.toISOString(),
      });
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "scheduleResearchTheme",
);

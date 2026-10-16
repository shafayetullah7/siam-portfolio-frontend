import { action, revalidate } from "@solidjs/router";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";
import { getPublicSite } from "~/lib/api/queries/public";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import { emptyToNull, parseWithSchema } from "~/lib/forms/parseFormData";
import { adminPageSchema } from "~/lib/forms/schemas/admin-page.schema";
import { formSuccess, type FormActionResult } from "~/lib/forms/types";

function pageValuesFromFormData(fd: FormData) {
  return {
    title: fd.get("title")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    body: fd.get("body")?.toString() ?? "",
    seoTitle: emptyToNull(fd.get("seoTitle")?.toString()),
    seoDescription: emptyToNull(fd.get("seoDescription")?.toString()),
  };
}

export const savePageAction = action(
  async (pageId: string, formData: FormData): Promise<FormActionResult> => {
    const parsed = parseWithSchema(
      formData,
      pageValuesFromFormData,
      adminPageSchema,
    );
    if (!parsed.success) return parsed.result;

    const payload = {
      slug: parsed.data.slug,
      title: parsed.data.title,
      body: parsed.data.body,
      seoTitle: parsed.data.seoTitle ?? null,
      seoDescription: parsed.data.seoDescription ?? null,
    };

    try {
      if (pageId === "new") {
        await adminPagesApi.create(payload);
      } else {
        await adminPagesApi.update(pageId, payload);
      }
      revalidate(getPublicSite.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "savePage",
);

export const publishPageAction = action(
  async (pageId: string): Promise<FormActionResult> => {
    if (pageId === "new") {
      return {
        ok: false,
        formMessage: "Save the page before publishing.",
      };
    }
    try {
      await adminPagesApi.publish(pageId);
      revalidate(getPublicSite.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "publishPage",
);

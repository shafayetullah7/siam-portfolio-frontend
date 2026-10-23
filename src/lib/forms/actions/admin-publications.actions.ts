import { action, redirect, revalidate } from "@solidjs/router";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import { getPublicHome } from "~/lib/api/queries/public";
import { getPublicPublications } from "~/lib/api/queries/public/publications.queries";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import {
  fieldErrorsFromZod,
  publicationDraftToWriteBody,
  publicationWriteSchema,
} from "~/lib/forms/schemas/publication-write.schema";
import { formFailure, formSuccess, type FormActionResult } from "~/lib/forms/types";

function publicationDraftFromFormData(formData: FormData): unknown {
  const raw = formData.get("publicationDraftJson")?.toString();
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export const savePublicationAction = action(
  async (
    publicationId: string,
    formData: FormData,
  ): Promise<FormActionResult> => {
    const json = publicationDraftFromFormData(formData);
    const parsed = publicationWriteSchema.safeParse(json);
    if (!parsed.success) {
      return formFailure(
        "Check the fields below.",
        fieldErrorsFromZod(parsed.error),
      );
    }

    const body = publicationDraftToWriteBody(parsed.data);

    try {
      if (publicationId === "new") {
        const created = await adminPublicationsApi.create(body);
        return redirect(`/admin/publications/${created.id}`);
      }
      await adminPublicationsApi.update(publicationId, body);
      revalidate(getPublicPublications.key);
      revalidate(getPublicHome.key);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "savePublication",
);

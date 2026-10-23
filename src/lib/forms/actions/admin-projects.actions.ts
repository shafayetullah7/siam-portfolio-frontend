import { action, redirect } from "@solidjs/router";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import {
  fieldErrorsFromZod,
  projectDraftToWriteBody,
  projectWriteSchema,
} from "~/lib/forms/schemas/project-write.schema";
import {
  formFailure,
  formSuccess,
  type FormActionResult,
} from "~/lib/forms/types";

function projectDraftFromFormData(formData: FormData): unknown {
  const raw = formData.get("projectDraftJson")?.toString();
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export const saveProjectAction = action(
  async (projectId: string, formData: FormData): Promise<FormActionResult> => {
    const json = projectDraftFromFormData(formData);
    const parsed = projectWriteSchema.safeParse(json);
    if (!parsed.success) {
      return formFailure(
        "Check the fields below.",
        fieldErrorsFromZod(parsed.error),
      );
    }

    const body = projectDraftToWriteBody(parsed.data);

    try {
      if (projectId === "new") {
        const created = await adminProjectsApi.create(body);
        return redirect(`/admin/projects/${created.id}`);
      }
      await adminProjectsApi.update(projectId, body);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "saveProject",
);

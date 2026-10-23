import { action, redirect } from "@solidjs/router";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import {
  fieldErrorsFromZod,
  writingDraftToWriteBody,
  writingWriteSchema,
} from "~/lib/forms/schemas/writing-write.schema";
import { formFailure, formSuccess, type FormActionResult } from "~/lib/forms/types";

function writingDraftFromFormData(formData: FormData): unknown {
  const raw = formData.get("writingDraftJson")?.toString();
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export const saveWritingAction = action(
  async (
    articleId: string,
    formData: FormData,
  ): Promise<FormActionResult> => {
    const json = writingDraftFromFormData(formData);
    const parsed = writingWriteSchema.safeParse(json);
    if (!parsed.success) {
      return formFailure(
        "Check the fields below.",
        fieldErrorsFromZod(parsed.error),
      );
    }

    const body = writingDraftToWriteBody(parsed.data);

    try {
      if (articleId === "new") {
        const created = await adminWritingApi.create(body);
        return redirect(`/admin/writing/${created.id}`);
      }
      await adminWritingApi.update(articleId, body);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "saveWriting",
);

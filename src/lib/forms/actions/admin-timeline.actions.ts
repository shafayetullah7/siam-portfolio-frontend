import { action, redirect } from "@solidjs/router";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import { mapAdminMutationErrorToResult } from "~/lib/forms/mapAdminMutationError";
import {
  fieldErrorsFromZod,
  timelineDraftToWriteBody,
  timelineEntryWriteSchema,
} from "~/lib/forms/schemas/timeline-entry-write.schema";
import { formFailure, formSuccess, type FormActionResult } from "~/lib/forms/types";

function timelineDraftFromFormData(formData: FormData): unknown {
  const raw = formData.get("timelineDraftJson")?.toString();
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export const saveTimelineAction = action(
  async (
    entryId: string,
    formData: FormData,
  ): Promise<FormActionResult> => {
    const json = timelineDraftFromFormData(formData);
    const parsed = timelineEntryWriteSchema.safeParse(json);
    if (!parsed.success) {
      return formFailure(
        "Check the fields below.",
        fieldErrorsFromZod(parsed.error),
      );
    }

    const body = timelineDraftToWriteBody(parsed.data);

    try {
      if (entryId === "new") {
        const created = await adminTimelineApi.create(body);
        return redirect(`/admin/achievements/${created.id}/edit`);
      }
      await adminTimelineApi.update(entryId, body);
      return formSuccess();
    } catch (error) {
      return mapAdminMutationErrorToResult(error);
    }
  },
  "saveTimeline",
);

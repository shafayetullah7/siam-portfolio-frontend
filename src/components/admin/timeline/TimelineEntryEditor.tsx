import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import { saveTimelineAction } from "~/lib/forms/actions/admin-timeline.actions";
import type { FormActionResult } from "~/lib/forms/types";
import {
  emptyTimelineDraft,
  fieldErrorsFromZod,
  timelineDraftFromAdmin,
  timelineEntryWriteSchema,
  type TimelineEntryWriteInput,
} from "~/lib/forms/schemas/timeline-entry-write.schema";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import TimelineEntryForm from "./TimelineEntryForm";
import TimelineEntryMediaPanel from "./TimelineEntryMediaPanel";

function resultFieldErrors(
  result: FormActionResult | undefined,
): Record<string, string> {
  if (result && !result.ok && result.fieldErrors) return result.fieldErrors;
  return {};
}

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

export type TimelineEntryEditorProps = {
  entryId?: string;
  initialKind?: TimelineEntryWriteInput["kind"];
};

export default function TimelineEntryEditor(props: TimelineEntryEditorProps) {
  const entryId = () => props.entryId ?? "new";
  const isEdit = () => entryId() !== "new";

  const [draft, setDraft] = createSignal<TimelineEntryWriteInput>(
    props.initialKind
      ? { ...emptyTimelineDraft(), kind: props.initialKind }
      : emptyTimelineDraft(),
  );
  const [clientFieldErrors, setClientFieldErrors] = createSignal<
    Record<string, string>
  >({});
  const [savedMessage, setSavedMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [publishStatus, setPublishStatus] = createSignal("draft");

  const saveSubmission = useSubmission(saveTimelineAction);
  const fieldErrors = () => ({
    ...clientFieldErrors(),
    ...resultFieldErrors(saveSubmission.result),
  });
  const formMessage = () => {
    const fromResult = resultMessage(saveSubmission.result);
    if (fromResult) return fromResult;
    if (saveSubmission.error) return saveSubmission.error.message;
    return loadError();
  };

  useUnsavedChanges(dirty);

  createEffect(() => {
    if (saveSubmission.result?.ok) {
      setDirty(false);
      if (isEdit()) {
        setSavedMessage("Changes saved.");
      }
    }
  });

  function handleSubmit(e: SubmitEvent) {
    const parsed = timelineEntryWriteSchema.safeParse(draft());
    if (!parsed.success) {
      e.preventDefault();
      setClientFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    setClientFieldErrors({});
  }

  onMount(async () => {
    if (!isEdit()) {
      setLoading(false);
      return;
    }
    try {
      const row = await adminTimelineApi.get(entryId());
      setDraft(timelineDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Entry not found"
          description="This timeline entry may have been deleted or the link is wrong."
        >
          <A href="/admin/achievements" class="siam-btn-primary no-underline">
            Back to achievements
          </A>
        </EmptyState>
      }
    >
      <Show when={!loading()} fallback={<p class="text-ink-muted">Loading…</p>}>
        <div class="min-w-0">
          <AdminPageHeader
            title={isEdit() ? "Edit timeline entry" : "New timeline entry"}
            description={`${timelineKindLabel(draft().kind)} · A07`}
          >
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
              <A
                href={`/admin/achievements/${entryId()}`}
                class="siam-btn-secondary no-underline"
              >
                Overview
              </A>
            </Show>
            <A href="/admin/achievements" class="siam-btn-secondary no-underline">
              Cancel
            </A>
          </AdminPageHeader>

          <Show when={formMessage()}>
            <div class="mt-4">
              <FormErrorAlert message={formMessage()!} />
            </div>
          </Show>
          <Show when={savedMessage()}>
            <div class="mt-4">
              <FormSuccessNotice message={savedMessage()} />
            </div>
          </Show>

          <form
            class="mt-6 min-w-0 max-w-3xl"
            method="post"
            action={saveTimelineAction.with(entryId())}
            onSubmit={handleSubmit}
            onInput={() => {
              setDirty(true);
              setSavedMessage(null);
            }}
          >
            <input
              type="hidden"
              name="timelineDraftJson"
              value={JSON.stringify(draft())}
            />
            <TimelineEntryForm
              draft={draft()}
              fieldErrors={fieldErrors()}
              onChange={(next) => setDraft(next)}
              allowKindChange={!isEdit()}
            />
            <div class="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                class="siam-btn-primary"
                disabled={saveSubmission.pending}
              >
                {saveSubmission.pending ? "Saving…" : "Save draft"}
              </button>
            </div>
          </form>

          <Show when={isEdit()}>
            <TimelineEntryMediaPanel entryId={entryId()} kind={draft().kind} />
          </Show>
        </div>
      </Show>
    </Show>
  );
}

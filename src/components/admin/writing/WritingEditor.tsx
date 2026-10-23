import { A, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import { saveWritingAction } from "~/lib/forms/actions/admin-writing.actions";
import type { FormActionResult } from "~/lib/forms/types";
import {
  emptyWritingDraft,
  fieldErrorsFromZod,
  writingDraftFromAdmin,
  writingWriteSchema,
  type WritingWriteInput,
} from "~/lib/forms/schemas/writing-write.schema";
import {
  useDebouncedWritingAutosave,
  type AutosaveState,
} from "~/lib/forms/useDebouncedWritingAutosave";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import AutosaveStatus from "./AutosaveStatus";
import WritingBodyEditor from "./WritingBodyEditor";
import WritingMetadataForm from "./WritingMetadataForm";
import WritingPreviewPane from "./WritingPreviewPane";

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

export type WritingEditorProps = {
  articleId?: string;
};

export default function WritingEditor(props: WritingEditorProps) {
  const articleId = () => props.articleId ?? "new";
  const isEdit = () => articleId() !== "new";
  const formActionId = () => articleId();

  const [draft, setDraft] = createSignal<WritingWriteInput>(emptyWritingDraft());
  const [slugManual, setSlugManual] = createSignal(false);
  const [coverPickerOpen, setCoverPickerOpen] = createSignal(false);
  const [clientFieldErrors, setClientFieldErrors] = createSignal<
    Record<string, string>
  >({});
  const [savedMessage, setSavedMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [showPreview, setShowPreview] = createSignal(false);
  const [pasteNotice, setPasteNotice] = createSignal<string | null>(null);
  const [autosaveState, setAutosaveState] = createSignal<AutosaveState>({
    status: "idle",
  });

  const saveSubmission = useSubmission(saveWritingAction);
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

  useDebouncedWritingAutosave({
    articleId,
    draft,
    dirty,
    enabled: () => isEdit(),
    saveBlocked: () => saveSubmission.pending,
    setAutosaveState,
    onSaved: () => setDirty(false),
  });

  createEffect(() => {
    if (saveSubmission.result?.ok) {
      setDirty(false);
      if (isEdit()) {
        setSavedMessage("Changes saved.");
      }
    }
  });

  function patchDraft(patch: Partial<WritingWriteInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function markDirty() {
    setDirty(true);
    setSavedMessage(null);
  }

  function handleSubmit(e: SubmitEvent) {
    const parsed = writingWriteSchema.safeParse(draft());
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
    const id = articleId();
    try {
      const row = await adminWritingApi.get(id);
      setDraft(writingDraftFromAdmin(row));
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
          title="Article not found"
          description="This article may have been deleted or the link is wrong."
        >
          <A href="/admin/writing" class="siam-btn-primary no-underline">
            Back to writing
          </A>
        </EmptyState>
      }
    >
      <Show when={!loading()} fallback={<p class="text-ink-muted">Loading…</p>}>
        <div class="min-w-0 rounded-lg bg-accent-writing/40 p-1 lg:p-2">
          <AdminPageHeader
            title={isEdit() ? "Edit article" : "New article"}
            description="Draft metadata and Markdown body (A08)."
          >
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
              <A
                href={`/admin/writing/${articleId()}`}
                class="siam-btn-secondary no-underline"
              >
                Overview
              </A>
            </Show>
            <A href="/admin/writing" class="siam-btn-secondary no-underline">
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

          <Show when={isEdit()}>
            <div class="mt-2">
              <AutosaveStatus state={autosaveState()} />
            </div>
          </Show>

          <form
            class="mt-6 min-w-0"
            method="post"
            action={saveWritingAction.with(formActionId())}
            onSubmit={handleSubmit}
            onInput={markDirty}
          >
            <input
              type="hidden"
              name="writingDraftJson"
              value={JSON.stringify(draft())}
            />

            <div class="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
              <WritingMetadataForm
                draft={draft()}
                slugManual={slugManual()}
                coverPickerOpen={coverPickerOpen()}
                fieldErrors={fieldErrors()}
                onDraftChange={patchDraft}
                onSlugManualChange={setSlugManual}
                onCoverPickerOpen={setCoverPickerOpen}
                onDirty={markDirty}
              />

              <div class="siam-card flex min-h-0 flex-col gap-4 p-5">
                <Show when={pasteNotice()}>
                  <p class="rounded-md border border-border bg-surface-container-low px-3 py-2 text-sm text-ink-muted" role="status">
                    {pasteNotice()}
                    <button
                      type="button"
                      class="ml-2 text-ink underline"
                      onClick={() => setPasteNotice(null)}
                    >
                      Dismiss
                    </button>
                  </p>
                </Show>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h2 class="text-sm font-semibold text-ink">Content</h2>
                  <button
                    type="button"
                    class="siam-btn-secondary text-xs"
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    {showPreview() ? "Show source" : "Show preview"}
                  </button>
                </div>
                <Show
                  when={!showPreview()}
                  fallback={
                    <WritingPreviewPane
                      body={draft().body ?? ""}
                      showPreview={true}
                    />
                  }
                >
                  <WritingBodyEditor
                    draft={draft()}
                    onChange={(patch) => {
                      markDirty();
                      patchDraft(patch);
                    }}
                    error={fieldErrors().body}
                    onPasteSanitized={() =>
                      setPasteNotice(
                        "Pasted formatting was removed for safety.",
                      )
                    }
                  />
                </Show>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
              <button
                type="submit"
                class="siam-btn-primary"
                disabled={saveSubmission.pending}
              >
                {saveSubmission.pending
                  ? "Saving…"
                  : isEdit()
                    ? "Save draft"
                    : "Create draft"}
              </button>
            </div>
          </form>
        </div>
      </Show>
    </Show>
  );
}

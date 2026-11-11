import { A, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminCollaborationsApi } from "~/lib/api/endpoints/admin/collaborations.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import {
  collaborationDraftFromAdmin,
  collaborationFieldErrorsFromZod,
  collaborationWriteSchema,
  emptyCollaborationDraft,
  type CollaborationWriteInput,
} from "~/lib/forms/schemas/collaboration-write.schema";
import CollaborationPublishControls from "~/components/admin/talks/CollaborationPublishControls";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";

export type CollaborationEditorProps = {
  entryId?: string;
};

export default function CollaborationEditor(props: CollaborationEditorProps) {
  const navigate = useNavigate();
  const isEdit = () => Boolean(props.entryId);
  const [draft, setDraft] = createSignal<CollaborationWriteInput>(
    emptyCollaborationDraft(),
  );
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [formMessage, setFormMessage] = createSignal<string | null>(null);
  const [dirty, setDirty] = createSignal(false);
  const [loading, setLoading] = createSignal(isEdit());
  const [notFound, setNotFound] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [publishStatus, setPublishStatus] = createSignal("draft");
  const [pickerOpen, setPickerOpen] = createSignal(false);

  useUnsavedChanges(dirty);

  function patchDraft(patch: Partial<CollaborationWriteInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  async function save(e: Event) {
    e.preventDefault();
    const parsed = collaborationWriteSchema.safeParse(draft());
    if (!parsed.success) {
      setFieldErrors(collaborationFieldErrorsFromZod(parsed.error));
      return;
    }
    setFieldErrors({});
    setPending(true);
    setFormMessage(null);
    try {
      if (isEdit() && props.entryId) {
        const updated = await adminCollaborationsApi.update(
          props.entryId,
          parsed.data,
        );
        setDraft(collaborationDraftFromAdmin(updated));
        setPublishStatus(updated.publishStatus);
      } else {
        const created = await adminCollaborationsApi.create(parsed.data);
        setDirty(false);
        navigate(`/admin/talks/collaborations/${created.id}/edit`, {
          replace: true,
        });
        return;
      }
      setDirty(false);
    } catch (err) {
      setFormMessage(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!props.entryId) return;
    if (!window.confirm("Delete this collaboration?")) return;
    await adminCollaborationsApi.delete(props.entryId);
    navigate("/admin/talks/collaborations", { replace: true });
  }

  onMount(async () => {
    if (!props.entryId) {
      setLoading(false);
      return;
    }
    try {
      const row = await adminCollaborationsApi.get(props.entryId);
      setDraft(collaborationDraftFromAdmin(row));
      setPublishStatus(row.publishStatus);
    } catch (err) {
      if (isApiError(err) && err.status === 404) setNotFound(true);
      else setFormMessage(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show when={!loading()} fallback={<p>Loading…</p>}>
      <Show
        when={!notFound()}
        fallback={
          <EmptyState variant="detail" title="Not found">
            <A href="/admin/talks/collaborations">Back</A>
          </EmptyState>
        }
      >
        <AdminPageHeader
          title={isEdit() ? "Edit collaboration" : "New collaboration"}
        >
          <div class="flex gap-3 items-center">
            <Show when={isEdit()}>
              <PublishStatusBadge status={publishStatus()} />
            </Show>
            <Show when={props.entryId}>
              <CollaborationPublishControls
                entryId={props.entryId!}
                publishStatus={publishStatus()}
                onUpdated={(row) => {
                  setDraft(collaborationDraftFromAdmin(row));
                  setPublishStatus(row.publishStatus);
                }}
              />
            </Show>
          </div>
        </AdminPageHeader>
        <Show when={formMessage()}>
          <div class="mt-4">
            <FormErrorAlert message={formMessage()!} />
          </div>
        </Show>
        <form class="mt-6 max-w-2xl space-y-4" onSubmit={save}>
          <label class="block text-sm">
            <span class="text-ink-muted">Partner name</span>
            <input
              class="siam-input mt-1 w-full"
              value={draft().partnerName}
              onInput={(e) => patchDraft({ partnerName: e.currentTarget.value })}
            />
            <Show when={fieldErrors().partnerName}>
              <span class="text-sm text-red-600">{fieldErrors().partnerName}</span>
            </Show>
          </label>
          <label class="block text-sm">
            <span class="text-ink-muted">Summary</span>
            <textarea
              class="siam-input mt-1 w-full min-h-[5rem]"
              value={draft().summary}
              onInput={(e) => patchDraft({ summary: e.currentTarget.value })}
            />
          </label>
          <div class="text-sm">
            <button
              type="button"
              class="siam-btn-secondary"
              onClick={() => setPickerOpen(true)}
            >
              Choose logo
            </button>
            <Show when={draft().logoMediaId}>
              <span class="ml-2 text-ink-muted">Logo selected</span>
            </Show>
          </div>
          <MediaPicker
            open={pickerOpen()}
            onClose={() => setPickerOpen(false)}
            imagesOnly
            onSelect={(selection: MediaPickerSelection) => {
              patchDraft({ logoMediaId: selection.id });
              setPickerOpen(false);
            }}
          />
          <div class="flex gap-3 pt-2">
            <button type="submit" class="siam-btn-primary" disabled={pending()}>
              Save
            </button>
            <Show when={isEdit()}>
              <button
                type="button"
                class="siam-btn-ghost text-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </Show>
          </div>
        </form>
      </Show>
    </Show>
  );
}

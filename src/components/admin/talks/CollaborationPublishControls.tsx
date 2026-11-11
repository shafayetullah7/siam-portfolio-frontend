import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import TalkPublishChecklistDialog from "~/components/admin/talks/TalkPublishChecklistDialog";
import { adminCollaborationsApi } from "~/lib/api/endpoints/admin/collaborations.api";
import type { CollaborationAdmin, TalkPublishChecklist } from "~/lib/api/types/talks.types";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicCollaborationsPage } from "~/lib/api/queries/public/collaborations.queries";

export type CollaborationPublishControlsProps = {
  entryId: string;
  publishStatus: string;
  onUpdated?: (row: CollaborationAdmin) => void;
};

export default function CollaborationPublishControls(
  props: CollaborationPublishControlsProps,
) {
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<TalkPublishChecklist | null>(null);

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    try {
      const row = await adminCollaborationsApi.publish(props.entryId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      props.onUpdated?.(row);
      revalidate(getPublicCollaborationsPage.key);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handlePublish() {
    setError(null);
    setPending(true);
    try {
      const check = await adminCollaborationsApi.getPublishCheck(props.entryId);
      if (check.errors.length > 0 || check.warnings.length > 0) {
        setChecklist(check);
        setDialogOpen(true);
        return;
      }
      await runPublish(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
  <>
      <div class="flex gap-2">
        <Show
          when={
            props.publishStatus === "draft" ||
            props.publishStatus === "scheduled"
          }
        >
          <button
            type="button"
            class="siam-btn-primary"
            disabled={pending()}
            onClick={() => void handlePublish()}
          >
            Publish
          </button>
        </Show>
        <Show when={error()}>
          <span class="text-xs text-red-600">{error()}</span>
        </Show>
      </div>
      <TalkPublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}

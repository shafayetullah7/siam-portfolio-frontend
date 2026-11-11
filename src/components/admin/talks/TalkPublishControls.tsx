import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import TalkPublishChecklistDialog from "~/components/admin/talks/TalkPublishChecklistDialog";
import { adminTalksApi } from "~/lib/api/endpoints/admin/talks.api";
import type { TalkAdminDetail } from "~/lib/api/types/talks.types";
import type { TalkPublishChecklist } from "~/lib/api/types/talks.types";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicTalks } from "~/lib/api/queries/public/talks.queries";

export type TalkPublishControlsProps = {
  talkId: string;
  publishStatus: string;
  variant?: "compact" | "bar";
  onUpdated?: (talk: TalkAdminDetail) => void;
};

function revalidatePublicTalks() {
  revalidate(getPublicTalks.key);
}

export default function TalkPublishControls(props: TalkPublishControlsProps) {
  const variant = () => props.variant ?? "bar";
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<TalkPublishChecklist | null>(null);

  const canPublish = () =>
    props.publishStatus === "draft" || props.publishStatus === "scheduled";
  const canUnpublish = () =>
    props.publishStatus === "published" || props.publishStatus === "scheduled";

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    setError(null);
    try {
      const talk = await adminTalksApi.publish(props.talkId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      props.onUpdated?.(talk);
      revalidatePublicTalks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handlePublishClick() {
    setError(null);
    setPending(true);
    try {
      const check = await adminTalksApi.getPublishCheck(props.talkId);
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

  async function handleUnpublish() {
    setPending(true);
    setError(null);
    try {
      const talk = await adminTalksApi.unpublish(props.talkId);
      props.onUpdated?.(talk);
      revalidatePublicTalks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const primaryClass = () =>
    variant() === "compact"
      ? "siam-btn-primary px-2 py-1 text-xs"
      : "siam-btn-primary";
  const secondaryClass = () =>
    variant() === "compact"
      ? "siam-btn-secondary px-2 py-1 text-xs"
      : "siam-btn-secondary";

  return (
    <>
      <div class="flex flex-wrap items-center gap-2">
        <Show when={canPublish()}>
          <button
            type="button"
            class={primaryClass()}
            disabled={pending()}
            onClick={() => void handlePublishClick()}
          >
            Publish
          </button>
        </Show>
        <Show when={canUnpublish()}>
          <button
            type="button"
            class={secondaryClass()}
            disabled={pending()}
            onClick={() => void handleUnpublish()}
          >
            Unpublish
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

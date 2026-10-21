import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import ResearchPublishChecklistDialog from "~/components/admin/research/ResearchPublishChecklistDialog";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicHome, getPublicResearchThemes } from "~/lib/api/queries/public";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type { ResearchPublishChecklist } from "~/lib/api/types/research.types";

export type ResearchThemePublishControlsProps = {
  themeId: string;
  publishStatus: string;
  /** `compact` for table rows; `bar` for view page toolbar */
  variant?: "compact" | "bar";
  onUpdated?: (theme: ResearchThemeAdmin) => void;
};

function revalidatePublicResearch() {
  revalidate(getPublicHome.key);
  revalidate(getPublicResearchThemes.key);
}

export default function ResearchThemePublishControls(
  props: ResearchThemePublishControlsProps,
) {
  const variant = () => props.variant ?? "bar";
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<ResearchPublishChecklist | null>(null);

  const canPublish = () =>
    props.publishStatus === "draft" || props.publishStatus === "scheduled";
  const canUnpublish = () =>
    props.publishStatus === "published" || props.publishStatus === "scheduled";

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    setError(null);
    try {
      const theme = await adminResearchApi.publish(props.themeId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      revalidatePublicResearch();
      props.onUpdated?.(theme);
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
      const check = await adminResearchApi.getPublishCheck(props.themeId);
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

  async function handleUnpublishClick() {
    setPending(true);
    setError(null);
    try {
      const theme = await adminResearchApi.unpublish(props.themeId);
      revalidatePublicResearch();
      props.onUpdated?.(theme);
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
      <div
        classList={{
          "flex flex-wrap items-center gap-2": variant() === "bar",
          "inline-flex items-center gap-1": variant() === "compact",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Show when={canPublish()}>
          <button
            type="button"
            class={primaryClass()}
            disabled={pending()}
            onClick={() => void handlePublishClick()}
          >
            {pending() ? "…" : "Publish"}
          </button>
        </Show>
        <Show when={canUnpublish()}>
          <button
            type="button"
            class={secondaryClass()}
            disabled={pending()}
            onClick={() => void handleUnpublishClick()}
          >
            {pending() ? "…" : "Unpublish"}
          </button>
        </Show>
        <Show when={error()}>
          <span class="text-xs text-red-600" role="alert">{error()}</span>
        </Show>
      </div>
      <ResearchPublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}

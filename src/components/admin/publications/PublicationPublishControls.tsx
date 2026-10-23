import { revalidate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import PublicationPublishChecklistDialog from "~/components/admin/publications/PublicationPublishChecklistDialog";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type { PublicationAdminSummary } from "~/lib/api/endpoints/admin/publications.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import { getPublicHome } from "~/lib/api/queries/public";
import { getPublicPublications } from "~/lib/api/queries/public/publications.queries";
import type { PublicationPublishChecklist } from "~/lib/api/types/publication.types";

export type PublicationPublishControlsProps = {
  publicationId: string;
  publishStatus: string;
  variant?: "compact" | "bar";
  onUpdated?: (publication: PublicationAdminSummary) => void;
};

function revalidatePublicPublications() {
  revalidate(getPublicPublications.key);
  revalidate(getPublicHome.key);
}

export default function PublicationPublishControls(
  props: PublicationPublishControlsProps,
) {
  const variant = () => props.variant ?? "bar";
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [scheduleAt, setScheduleAt] = createSignal("");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<PublicationPublishChecklist | null>(null);

  const canPublish = () =>
    props.publishStatus === "draft" || props.publishStatus === "scheduled";
  const canUnpublish = () =>
    props.publishStatus === "published" || props.publishStatus === "scheduled";
  const canArchive = () => props.publishStatus !== "archived";

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    setError(null);
    try {
      const pub = await adminPublicationsApi.publish(props.publicationId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      revalidatePublicPublications();
      props.onUpdated?.(pub);
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
      const check = await adminPublicationsApi.getPublishCheck(
        props.publicationId,
      );
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
      const pub = await adminPublicationsApi.unpublish(props.publicationId);
      revalidatePublicPublications();
      props.onUpdated?.(pub);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleArchive() {
    setPending(true);
    setError(null);
    try {
      const pub = await adminPublicationsApi.archive(props.publicationId);
      revalidatePublicPublications();
      props.onUpdated?.(pub);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleSchedule() {
    const raw = scheduleAt().trim();
    if (!raw) {
      setError("Pick a date and time to schedule.");
      return;
    }
    const scheduledAt = new Date(raw);
    if (Number.isNaN(scheduledAt.getTime())) {
      setError("Pick a valid schedule date and time.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const pub = await adminPublicationsApi.schedule(props.publicationId, {
        scheduledAt: scheduledAt.toISOString(),
      });
      revalidatePublicPublications();
      props.onUpdated?.(pub);
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
            onClick={() => void handleUnpublish()}
          >
            {pending() ? "…" : "Unpublish"}
          </button>
        </Show>
        <Show when={variant() === "bar" && canArchive()}>
          <button
            type="button"
            class={secondaryClass()}
            disabled={pending()}
            onClick={() => void handleArchive()}
          >
            {pending() ? "…" : "Archive"}
          </button>
        </Show>
        <Show when={variant() === "bar" && canPublish()}>
          <label class="flex items-center gap-2 text-sm">
            <span class="text-ink-muted">Schedule</span>
            <input
              type="datetime-local"
              class="siam-input"
              value={scheduleAt()}
              onInput={(e) => setScheduleAt(e.currentTarget.value)}
            />
            <button
              type="button"
              class={secondaryClass()}
              disabled={pending()}
              onClick={() => void handleSchedule()}
            >
              Set
            </button>
          </label>
        </Show>
        <Show when={error()}>
          <span class="text-xs text-red-600" role="alert">{error()}</span>
        </Show>
      </div>
      <PublicationPublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}

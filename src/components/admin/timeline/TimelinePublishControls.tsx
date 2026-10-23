import { createSignal, Show } from "solid-js";
import TimelinePublishChecklistDialog from "~/components/admin/timeline/TimelinePublishChecklistDialog";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type {
  TimelineAdminDetail,
  TimelinePublishChecklist,
} from "~/lib/api/types/timeline.types";

export type TimelinePublishControlsProps = {
  entryId: string;
  publishStatus: string;
  variant?: "compact" | "bar";
  onUpdated?: (entry: TimelineAdminDetail) => void;
};

export default function TimelinePublishControls(
  props: TimelinePublishControlsProps,
) {
  const variant = () => props.variant ?? "bar";
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [scheduleAt, setScheduleAt] = createSignal("");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [checklist, setChecklist] =
    createSignal<TimelinePublishChecklist | null>(null);

  const canPublish = () =>
    props.publishStatus === "draft" || props.publishStatus === "scheduled";
  const canUnpublish = () =>
    props.publishStatus === "published" || props.publishStatus === "scheduled";
  const canArchive = () => props.publishStatus !== "archived";

  const publishLabel = () =>
    props.publishStatus === "scheduled" ? "Publish now" : "Publish";
  const unpublishLabel = () =>
    props.publishStatus === "scheduled" ? "Cancel schedule" : "Unpublish";

  async function runPublish(confirmWarnings: boolean) {
    setPending(true);
    setError(null);
    try {
      const entry = await adminTimelineApi.publish(props.entryId, {
        confirmWarnings,
      });
      setDialogOpen(false);
      props.onUpdated?.(entry);
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
      const check = await adminTimelineApi.getPublishCheck(props.entryId);
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
      const entry = await adminTimelineApi.unpublish(props.entryId);
      props.onUpdated?.(entry);
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
      const entry = await adminTimelineApi.archive(props.entryId);
      props.onUpdated?.(entry);
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
      const entry = await adminTimelineApi.schedule(props.entryId, {
        scheduledAt: scheduledAt.toISOString(),
      });
      props.onUpdated?.(entry);
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
            {pending() ? "…" : publishLabel()}
          </button>
        </Show>
        <Show when={canUnpublish()}>
          <button
            type="button"
            class={secondaryClass()}
            disabled={pending()}
            onClick={() => void handleUnpublish()}
          >
            {pending() ? "…" : unpublishLabel()}
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
      <TimelinePublishChecklistDialog
        open={dialogOpen()}
        checklist={checklist()}
        pending={pending()}
        onClose={() => setDialogOpen(false)}
        onPublishAnyway={() => void runPublish(true)}
      />
    </>
  );
}

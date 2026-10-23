import { For, Show } from "solid-js";
import AdminDialog from "~/components/admin/AdminDialog";
import type { ProjectPublishChecklist } from "~/lib/api/types/project.types";

export type ProjectPublishChecklistDialogProps = {
  open: boolean;
  checklist: ProjectPublishChecklist | null;
  pending: boolean;
  onClose: () => void;
  onPublishAnyway: () => void;
};

export default function ProjectPublishChecklistDialog(
  props: ProjectPublishChecklistDialogProps,
) {
  const hasErrors = () => (props.checklist?.errors.length ?? 0) > 0;
  const hasWarnings = () => (props.checklist?.warnings.length ?? 0) > 0;

  return (
    <AdminDialog
      open={props.open}
      title="Publish checklist"
      iconClose
      onClose={props.onClose}
      footer={
        <Show when={!hasErrors()}>
          <div class="flex w-full justify-end">
            <button
              type="button"
              class="siam-btn-primary"
              disabled={props.pending}
              onClick={() => props.onPublishAnyway()}
            >
              {props.pending
                ? "Publishing…"
                : hasWarnings()
                  ? "Publish anyway"
                  : "Publish"}
            </button>
          </div>
        </Show>
      }
    >
      <div class="space-y-5">
        <Show when={hasErrors()}>
          <div
            class="rounded-lg border border-error/30 bg-error/5 p-4"
            role="alert"
          >
            <h3 class="text-sm font-semibold text-ink">
              Fix these before you can publish
            </h3>
            <ul class="mt-3 space-y-2">
              <For each={props.checklist!.errors}>
                {(item) => (
                  <li class="text-sm text-ink">{item.message}</li>
                )}
              </For>
            </ul>
          </div>
        </Show>
        <Show when={hasWarnings()}>
          <div
            class="rounded-lg border border-amber-500/35 bg-amber-500/5 p-4"
            role="status"
          >
            <h3 class="text-sm font-semibold text-ink">Review before publishing</h3>
            <ul class="mt-3 space-y-2">
              <For each={props.checklist!.warnings}>
                {(item) => (
                  <li class="text-sm text-ink">{item.message}</li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </AdminDialog>
  );
}

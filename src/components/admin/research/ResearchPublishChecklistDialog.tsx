import { For, Show } from "solid-js";
import AdminDialog from "~/components/admin/AdminDialog";
import type { ResearchPublishChecklist } from "~/lib/api/types/research.types";

export type ResearchPublishChecklistDialogProps = {
  open: boolean;
  checklist: ResearchPublishChecklist | null;
  pending: boolean;
  onClose: () => void;
  onPublishAnyway: () => void;
};

export default function ResearchPublishChecklistDialog(
  props: ResearchPublishChecklistDialogProps,
) {
  const hasErrors = () => (props.checklist?.errors.length ?? 0) > 0;
  const hasWarnings = () => (props.checklist?.warnings.length ?? 0) > 0;

  return (
    <AdminDialog
      open={props.open}
      title="Publish checklist"
      onClose={props.onClose}
      footer={
        <div class="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            class="siam-btn-secondary"
            onClick={props.onClose}
            disabled={props.pending}
          >
            {hasErrors() ? "Close" : "Cancel"}
          </button>
          <Show when={!hasErrors()}>
            <button
              type="button"
              class="siam-btn-primary"
              disabled={props.pending}
              onClick={() => {
                if (hasWarnings()) {
                  props.onPublishAnyway();
                } else {
                  props.onPublishAnyway();
                }
              }}
            >
              {props.pending
                ? "Publishing…"
                : hasWarnings()
                  ? "Publish anyway"
                  : "Publish"}
            </button>
          </Show>
        </div>
      }
    >
      <div class="space-y-4 overflow-y-auto p-4">
        <Show when={hasErrors()}>
          <div>
            <h3 class="text-sm font-semibold text-ink">Must fix before publish</h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
              <For each={props.checklist!.errors}>
                {(item) => <li>{item.message}</li>}
              </For>
            </ul>
          </div>
        </Show>
        <Show when={hasWarnings()}>
          <div>
            <h3 class="text-sm font-semibold text-ink">Warnings</h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              <For each={props.checklist!.warnings}>
                {(item) => <li>{item.message}</li>}
              </For>
            </ul>
          </div>
        </Show>
        <Show when={!hasErrors() && !hasWarnings()}>
          <p class="text-sm text-ink-muted">Ready to publish.</p>
        </Show>
      </div>
    </AdminDialog>
  );
}

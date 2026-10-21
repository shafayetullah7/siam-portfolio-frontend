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
            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-error/15 text-xs font-bold text-error"
                aria-hidden="true"
              >
                !
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-ink">
                  Fix these before you can publish
                </h3>
                <p class="mt-1 text-sm text-ink-muted">
                  Edit the theme and complete the items below, then try Publish
                  again.
                </p>
                <ul class="mt-3 space-y-2">
                  <For each={props.checklist!.errors}>
                    {(item) => (
                      <li
                        class="flex gap-2 rounded-md border border-error/20 bg-surface px-3 py-2 text-sm text-ink"
                      >
                        <span class="font-medium text-error" aria-hidden="true">
                          •
                        </span>
                        <span>{item.message}</span>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
          </div>
        </Show>

        <Show when={hasWarnings()}>
          <div
            class="rounded-lg border border-amber-500/35 bg-amber-500/5 p-4"
            role="status"
          >
            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-800 dark:text-amber-200"
                aria-hidden="true"
              >
                ?
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-ink">
                  {hasErrors() ? "Also review" : "Review before publishing"}
                </h3>
                <p class="mt-1 text-sm text-ink-muted">
                  You can publish with these warnings if you are comfortable with
                  the risk.
                </p>
                <ul class="mt-3 space-y-2">
                  <For each={props.checklist!.warnings}>
                    {(item) => (
                      <li
                        class="flex gap-2 rounded-md border border-amber-500/25 bg-surface px-3 py-2 text-sm text-ink"
                      >
                        <span
                          class="font-medium text-amber-800 dark:text-amber-200"
                          aria-hidden="true"
                        >
                          •
                        </span>
                        <span>{item.message}</span>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
          </div>
        </Show>

        <Show when={!hasErrors() && !hasWarnings()}>
          <p class="rounded-lg border border-border bg-surface-container-lowest p-4 text-sm text-ink-muted">
            Everything looks good. Confirm publish below.
          </p>
        </Show>
      </div>
    </AdminDialog>
  );
}

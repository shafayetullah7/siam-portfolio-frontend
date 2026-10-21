import { createEffect, type JSX, onCleanup, Show } from "solid-js";

export type AdminDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: JSX.Element;
  footer?: JSX.Element;
};

export default function AdminDialog(props: AdminDialogProps) {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") props.onClose();
  }

  createEffect(() => {
    if (!props.open) return;
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          class="absolute inset-0 bg-ink/40"
          aria-label="Close dialog"
          onClick={props.onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-dialog-title"
          class="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-3xl flex-col rounded-lg border border-border bg-surface shadow-lg"
        >
          <header class="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 id="admin-dialog-title" class="text-lg font-semibold text-ink">
              {props.title}
            </h2>
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              onClick={props.onClose}
            >
              Close
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">{props.children}</div>
          <Show when={props.footer}>
            <footer class="flex justify-end gap-2 border-t border-border px-4 py-3">
              {props.footer}
            </footer>
          </Show>
        </div>
      </div>
    </Show>
  );
}

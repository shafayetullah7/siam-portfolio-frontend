import { onMount, type Accessor } from "solid-js";

/** Warn on tab close when the editor has unsaved changes. */
export function useUnsavedChanges(dirty: Accessor<boolean>) {
  onMount(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty()) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  });
}

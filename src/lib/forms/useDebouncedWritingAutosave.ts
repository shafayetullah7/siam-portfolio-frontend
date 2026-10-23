import { createEffect, onCleanup, type Accessor } from "solid-js";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import {
  writingDraftToWriteBody,
  type WritingWriteInput,
} from "~/lib/forms/schemas/writing-write.schema";

export type AutosaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; savedAt: string }
  | { status: "error"; message: string };

const DEBOUNCE_MS = 2500;

export function useDebouncedWritingAutosave(options: {
  articleId: Accessor<string>;
  draft: Accessor<WritingWriteInput>;
  dirty: Accessor<boolean>;
  enabled: Accessor<boolean>;
  saveBlocked: Accessor<boolean>;
  onSaved?: (updatedAt: string) => void;
  setAutosaveState: (state: AutosaveState) => void;
}) {
  createEffect(() => {
    const id = options.articleId();
    const enabled = options.enabled();
    const dirty = options.dirty();
    const blocked = options.saveBlocked();

    if (!enabled || id === "new" || !dirty || blocked) {
      return;
    }

    const snapshot = options.draft();
    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        if (cancelled) return;
        options.setAutosaveState({ status: "saving" });
        try {
          const updated = await adminWritingApi.update(
            id,
            writingDraftToWriteBody(snapshot),
          );
          if (cancelled) return;
          options.setAutosaveState({
            status: "saved",
            savedAt: updated.updatedAt,
          });
          options.onSaved?.(updated.updatedAt);
        } catch (error) {
          if (cancelled) return;
          options.setAutosaveState({
            status: "error",
            message: getApiErrorMessage(error),
          });
        }
      })();
    }, DEBOUNCE_MS);

    onCleanup(() => {
      cancelled = true;
      window.clearTimeout(timer);
    });
  });
}

import { For, Show, createEffect, createSignal } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";
import type {
  ContentRevision,
  ResearchThemeRevisionSnapshot,
} from "~/lib/api/types/content-revision.types";

export type ResearchRevisionsPanelProps = {
  themeId: string;
  reloadKey: number;
  onRestored: (theme: ResearchThemeAdmin) => void;
  onRestoredComplete?: () => void;
};

function formatRevisionTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function ResearchRevisionsPanel(props: ResearchRevisionsPanelProps) {
  const [revisions, setRevisions] = createSignal<
    ContentRevision<ResearchThemeRevisionSnapshot>[]
  >([]);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [restoreError, setRestoreError] = createSignal<string | null>(null);
  const [restoringId, setRestoringId] = createSignal<string | null>(null);

  async function loadRevisions() {
    if (!props.themeId || props.themeId === "new") return;
    setLoadError(null);
    try {
      setRevisions(await adminResearchApi.listRevisions(props.themeId));
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    }
  }

  createEffect(() => {
    void props.themeId;
    void props.reloadKey;
    void loadRevisions();
  });

  async function handleRestore(revisionId: string) {
    const confirmed = window.confirm(
      "Restore this revision? Current content will be replaced. A new revision will be saved so you can undo.",
    );
    if (!confirmed) return;
    setRestoreError(null);
    setRestoringId(revisionId);
    try {
      const theme = await adminResearchApi.restoreRevision(
        props.themeId,
        revisionId,
      );
      props.onRestored(theme);
      props.onRestoredComplete?.();
      await loadRevisions();
    } catch (error) {
      setRestoreError(getApiErrorMessage(error));
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <fieldset class="space-y-3 border-0 p-0">
      <legend class="text-lg font-semibold text-ink">Revision history</legend>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={restoreError()}>
        <FormErrorAlert message={restoreError()} />
      </Show>
      <Show
        when={revisions().length > 0}
        fallback={
          <p class="text-sm text-ink-muted">No revisions yet. Save to create the first snapshot.</p>
        }
      >
        <ul class="divide-y divide-border rounded-lg border border-border">
          <For each={revisions()}>
            {(rev) => (
              <li class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                <div>
                  <span class="font-medium text-ink">
                    {formatRevisionTime(rev.createdAt)}
                  </span>
                  <Show when={rev.snapshot.title || rev.snapshot.publishStatus}>
                    <span class="mt-0.5 block text-ink-muted">
                      {[rev.snapshot.title, rev.snapshot.publishStatus]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </Show>
                </div>
                <button
                  type="button"
                  class="siam-btn-secondary"
                  disabled={restoringId() === rev.id}
                  onClick={() => void handleRestore(rev.id)}
                >
                  {restoringId() === rev.id ? "Restoring…" : "Restore"}
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </fieldset>
  );
}

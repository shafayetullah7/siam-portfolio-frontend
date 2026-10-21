import { For, Show, createEffect, createSignal } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type {
  ContentRevision,
  ResearchThemeRevisionSnapshot,
} from "~/lib/api/types/content-revision.types";
import {
  listRevisionChangeFields,
  summarizeRevisionFieldLabels,
  type RevisionSnapshotField,
} from "~/lib/research/researchRevisionDiff";
import ResearchRevisionChangesDialog from "./ResearchRevisionChangesDialog";

export type ResearchRevisionsPanelProps = {
  themeId: string;
  reloadKey: number;
};

function formatRevisionTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function revisionSummary(snap: ResearchThemeRevisionSnapshot): string {
  return summarizeRevisionFieldLabels(listRevisionChangeFields(snap));
}

export default function ResearchRevisionsPanel(props: ResearchRevisionsPanelProps) {
  const [revisions, setRevisions] = createSignal<
    ContentRevision<ResearchThemeRevisionSnapshot>[]
  >([]);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dialogTime, setDialogTime] = createSignal<string | null>(null);
  const [dialogChanges, setDialogChanges] = createSignal<RevisionSnapshotField[]>(
    [],
  );

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

  function openChanges(rev: ContentRevision<ResearchThemeRevisionSnapshot>) {
    setDialogTime(rev.createdAt);
    setDialogChanges(listRevisionChangeFields(rev.snapshot));
    setDialogOpen(true);
  }

  return (
    <div class="space-y-3">
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show
        when={revisions().length > 0}
        fallback={
          <p class="text-sm text-ink-muted">
            No revisions yet. Save when something changes to record it.
          </p>
        }
      >
        <ul class="divide-y divide-border rounded-lg border border-border">
          <For each={revisions()}>
            {(rev) => (
              <li class="flex flex-wrap items-start justify-between gap-3 px-3 py-3 text-sm">
                <div class="min-w-0 flex-1">
                  <span class="font-medium text-ink">
                    {formatRevisionTime(rev.createdAt)}
                  </span>
                  <Show
                    when={
                      rev.snapshot.title != null ||
                      rev.snapshot.publishStatus != null
                    }
                  >
                    <span class="mt-0.5 block text-ink-muted">
                      {[rev.snapshot.title, rev.snapshot.publishStatus]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </Show>
                  <span class="mt-1 block text-xs text-ink-muted">
                    {revisionSummary(rev.snapshot)}
                  </span>
                </div>
                <button
                  type="button"
                  class="siam-btn-secondary shrink-0 text-sm"
                  onClick={() => openChanges(rev)}
                >
                  View changes
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <ResearchRevisionChangesDialog
        open={dialogOpen()}
        revisionTime={dialogTime()}
        changes={dialogChanges()}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}

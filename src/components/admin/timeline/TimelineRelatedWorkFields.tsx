import { createResource, For, Show } from "solid-js";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type { TimelineEntryWriteInput } from "~/lib/forms/schemas/timeline-entry-write.schema";

export type TimelineRelatedWorkFieldsProps = {
  draft: TimelineEntryWriteInput;
  onChange: (patch: Partial<TimelineEntryWriteInput>) => void;
};

export default function TimelineRelatedWorkFields(
  props: TimelineRelatedWorkFieldsProps,
) {
  const [publications] = createResource(async () => {
    const rows = await adminPublicationsApi.list({ limit: 100 });
    return rows.filter((row) => row.publishStatus === "published");
  });

  const [projects] = createResource(async () => {
    const rows = await adminProjectsApi.list({ limit: 100 });
    return rows.filter((row) => row.publishStatus === "published");
  });

  return (
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Related publication (optional)</span>
        <select
          class="siam-input"
          value={props.draft.publicationId ?? ""}
          onChange={(e) =>
            props.onChange({
              publicationId: e.currentTarget.value || null,
            })
          }
        >
          <option value="">None</option>
          <Show when={!publications.loading} fallback={<option disabled>Loading…</option>}>
            <Show when={publications.error}>
              <option disabled>Could not load publications</option>
            </Show>
            <For each={publications() ?? []}>
              {(row) => (
                <option value={row.id}>
                  {row.title} ({row.year})
                </option>
              )}
            </For>
          </Show>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Related project (optional)</span>
        <select
          class="siam-input"
          value={props.draft.projectId ?? ""}
          onChange={(e) =>
            props.onChange({
              projectId: e.currentTarget.value || null,
            })
          }
        >
          <option value="">None</option>
          <Show when={!projects.loading} fallback={<option disabled>Loading…</option>}>
            <Show when={projects.error}>
              <option disabled>Could not load projects</option>
            </Show>
            <For each={projects() ?? []}>
              {(row) => <option value={row.id}>{row.title}</option>}
            </For>
          </Show>
        </select>
      </label>
    </div>
  );
}

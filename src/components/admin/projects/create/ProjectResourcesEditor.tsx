import { For, Show } from "solid-js";
import FormTextInput from "~/components/forms/FormTextInput";
import type { ProjectResourceType } from "~/lib/api/types/project.types";
import {
  PROJECT_RESOURCE_TYPES,
  PROJECT_RESOURCE_TYPE_LABELS,
} from "~/lib/projects/projectLabels";
import type { ProjectWriteInput } from "~/lib/forms/schemas/project-write.schema";

export type ProjectResourceDraft = NonNullable<
  ProjectWriteInput["resources"]
>[number];

export type ProjectResourcesEditorProps = {
  resources: ProjectResourceDraft[];
  onChange: (resources: ProjectResourceDraft[]) => void;
  onDirty: () => void;
  urlError?: string;
};

export default function ProjectResourcesEditor(
  props: ProjectResourcesEditorProps,
) {
  function updateRow(index: number, patch: Partial<ProjectResourceDraft>) {
    props.onDirty();
    props.onChange(
      props.resources.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    );
  }

  function addRow() {
    props.onDirty();
    props.onChange([
      ...props.resources,
      { label: "", url: "", resourceType: "other" },
    ]);
  }

  function removeRow(index: number) {
    props.onDirty();
    props.onChange(props.resources.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.resources.length) return;
    props.onDirty();
    const rows = [...props.resources];
    const [removed] = rows.splice(index, 1);
    rows.splice(target, 0, removed);
    props.onChange(rows);
  }

  return (
    <div class="space-y-4">
      <Show
        when={props.resources.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">
            No links yet. Add repository, demo, paper, or documentation URLs
            (HTTPS).
          </p>
        }
      >
        <For each={props.resources}>
          {(row, index) => (
            <div
              class="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto_auto]"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
                <span class="text-sm font-medium text-ink">
                  Link {index() + 1}
                </span>
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="siam-btn-secondary px-2 py-1 text-xs"
                    disabled={index() === 0}
                    onClick={() => move(index(), -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    class="siam-btn-secondary px-2 py-1 text-xs"
                    disabled={index() === props.resources.length - 1}
                    onClick={() => move(index(), 1)}
                  >
                    Down
                  </button>
                </div>
              </div>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Type</span>
                <select
                  class="siam-input"
                  value={row.resourceType ?? "other"}
                  onChange={(e) =>
                    updateRow(index(), {
                      resourceType: e.currentTarget
                        .value as ProjectResourceType,
                    })
                  }
                >
                  <For each={PROJECT_RESOURCE_TYPES}>
                    {(type) => (
                      <option value={type}>
                        {PROJECT_RESOURCE_TYPE_LABELS[type]}
                      </option>
                    )}
                  </For>
                </select>
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Label</span>
                <FormTextInput
                  value={row.label}
                  onInput={(e) =>
                    updateRow(index(), { label: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm sm:col-span-2">
                <span class="text-ink-muted">URL (HTTPS)</span>
                <FormTextInput
                  value={row.url}
                  onInput={(e) =>
                    updateRow(index(), { url: e.currentTarget.value })
                  }
                />
              </label>
              <div class="sm:col-span-2">
                <button
                  type="button"
                  class="siam-btn-secondary text-sm"
                  onClick={() => removeRow(index())}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </For>
      </Show>
      <Show when={props.urlError}>
        <p class="text-sm text-error">{props.urlError}</p>
      </Show>
      <button type="button" class="siam-btn-secondary text-sm" onClick={addRow}>
        Add link
      </button>
    </div>
  );
}

export function resourcesHttpsValid(
  resources: ProjectResourceDraft[],
): boolean {
  for (const row of resources) {
    const url = row.url.trim();
    if (!url) continue;
    if (row.label.trim() && !url.startsWith("https://")) {
      return false;
    }
  }
  return true;
}

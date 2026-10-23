import { For, Show } from "solid-js";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import type { ProjectWriteInput } from "~/lib/forms/schemas/project-write.schema";

export type ProjectMetricDraft = NonNullable<
  ProjectWriteInput["metrics"]
>[number];

export type ProjectMetricsEditorProps = {
  metrics: ProjectMetricDraft[];
  onChange: (metrics: ProjectMetricDraft[]) => void;
  onDirty: () => void;
};

export default function ProjectMetricsEditor(props: ProjectMetricsEditorProps) {
  function updateRow(index: number, patch: Partial<ProjectMetricDraft>) {
    props.onDirty();
    props.onChange(
      props.metrics.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function remove(index: number) {
    props.onDirty();
    props.onChange(props.metrics.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.metrics.length) return;
    props.onDirty();
    const rows = [...props.metrics];
    const [removed] = rows.splice(index, 1);
    rows.splice(target, 0, removed);
    props.onChange(rows);
  }

  function addRow() {
    props.onDirty();
    props.onChange([
      ...props.metrics,
      {
        name: "",
        value: "",
        unit: null,
        baseline: null,
        notes: null,
        caption: null,
      },
    ]);
  }

  return (
    <div class="space-y-4">
      <p class="text-sm text-ink-muted">
        Optional evidence metrics (name + value required to save each row).
      </p>
      <Show
        when={props.metrics.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">No metrics yet.</p>
        }
      >
        <For each={props.metrics}>
          {(row, index) => (
            <div
              class="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
                <span class="text-sm font-medium text-ink">
                  Metric {index() + 1}
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
                    disabled={index() === props.metrics.length - 1}
                    onClick={() => move(index(), 1)}
                  >
                    Down
                  </button>
                </div>
              </div>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Name</span>
                <FormTextInput
                  value={row.name}
                  onInput={(e) =>
                    updateRow(index(), { name: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Value</span>
                <FormTextInput
                  value={row.value}
                  onInput={(e) =>
                    updateRow(index(), { value: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Unit</span>
                <FormTextInput
                  value={row.unit ?? ""}
                  onInput={(e) =>
                    updateRow(index(), { unit: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Baseline</span>
                <FormTextInput
                  value={row.baseline ?? ""}
                  onInput={(e) =>
                    updateRow(index(), { baseline: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm sm:col-span-2">
                <span class="text-ink-muted">Caption</span>
                <FormTextInput
                  value={row.caption ?? ""}
                  onInput={(e) =>
                    updateRow(index(), { caption: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm sm:col-span-2">
                <span class="text-ink-muted">Notes</span>
                <FormTextarea
                  rows={2}
                  value={row.notes ?? ""}
                  onInput={(e) =>
                    updateRow(index(), { notes: e.currentTarget.value })
                  }
                />
              </label>
              <div class="sm:col-span-2">
                <button
                  type="button"
                  class="siam-btn-secondary text-sm"
                  onClick={() => remove(index())}
                >
                  Remove metric
                </button>
              </div>
            </div>
          )}
        </For>
      </Show>
      <button type="button" class="siam-btn-secondary text-sm" onClick={addRow}>
        Add metric
      </button>
    </div>
  );
}

import { For, Show } from "solid-js";

export type ThemeResourceRow = {
  label: string;
  url: string;
  resourceType: "code" | "data" | "demo" | "paper" | "other";
};

type ThemeResourcesEditorProps = {
  rows: ThemeResourceRow[];
  onChange: (rows: ThemeResourceRow[]) => void;
  onDirty: () => void;
};

const RESOURCE_TYPES: ThemeResourceRow["resourceType"][] = [
  "code",
  "data",
  "demo",
  "paper",
  "other",
];

export default function ThemeResourcesEditor(props: ThemeResourcesEditorProps) {
  function updateRow(index: number, patch: Partial<ThemeResourceRow>) {
    const next = props.rows.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    props.onChange(next);
    props.onDirty();
  }

  function removeRow(index: number) {
    props.onChange(props.rows.filter((_, i) => i !== index));
    props.onDirty();
  }

  function addRow() {
    if (props.rows.length >= 20) return;
    props.onChange([
      ...props.rows,
      { label: "", url: "", resourceType: "other" },
    ]);
    props.onDirty();
  }

  return (
    <div class="space-y-3">
      <For each={props.rows}>
        {(row, index) => (
          <div class="flex flex-col gap-2 rounded-lg border border-border p-3">
            <input
              type="text"
              class="siam-input w-full"
              placeholder="Label"
              value={row.label}
              onInput={(e) =>
                updateRow(index(), { label: e.currentTarget.value })
              }
            />
            <input
              type="url"
              class="siam-input w-full"
              placeholder="https://…"
              value={row.url}
              onInput={(e) =>
                updateRow(index(), { url: e.currentTarget.value })
              }
            />
            <select
              class="siam-input w-full"
              value={row.resourceType}
              onChange={(e) =>
                updateRow(index(), {
                  resourceType: e.currentTarget
                    .value as ThemeResourceRow["resourceType"],
                })
              }
            >
              <For each={RESOURCE_TYPES}>
                {(type) => <option value={type}>{type}</option>}
              </For>
            </select>
            <button
              type="button"
              class="siam-btn-secondary self-start text-sm"
              onClick={() => removeRow(index())}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <Show when={props.rows.length === 0}>
        <p class="text-sm text-ink-muted">No resource links yet.</p>
      </Show>
      <button
        type="button"
        class="siam-btn-secondary w-full text-sm sm:w-auto"
        onClick={addRow}
        disabled={props.rows.length >= 20}
      >
        Add resource
      </button>
    </div>
  );
}

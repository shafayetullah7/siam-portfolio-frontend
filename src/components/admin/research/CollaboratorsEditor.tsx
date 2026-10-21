import { For } from "solid-js";

export type CollaboratorRow = {
  name: string;
  role: string;
  url: string;
};

type CollaboratorsEditorProps = {
  rows: CollaboratorRow[];
  onChange: (rows: CollaboratorRow[]) => void;
  onDirty: () => void;
};

export default function CollaboratorsEditor(props: CollaboratorsEditorProps) {
  function updateRow(index: number, patch: Partial<CollaboratorRow>) {
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
    props.onChange([...props.rows, { name: "", role: "", url: "" }]);
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
              placeholder="Name"
              value={row.name}
              onInput={(e) =>
                updateRow(index(), { name: e.currentTarget.value })
              }
            />
            <input
              type="text"
              class="siam-input w-full"
              placeholder="Role (optional)"
              value={row.role}
              onInput={(e) =>
                updateRow(index(), { role: e.currentTarget.value })
              }
            />
            <input
              type="url"
              class="siam-input w-full"
              placeholder="https://… (optional)"
              value={row.url}
              onInput={(e) =>
                updateRow(index(), { url: e.currentTarget.value })
              }
            />
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
      <button
        type="button"
        class="siam-btn-secondary text-sm"
        onClick={addRow}
      >
        Add collaborator
      </button>
    </div>
  );
}

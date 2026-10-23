import { For, Show } from "solid-js";
import FormTextInput from "~/components/forms/FormTextInput";
import { SUPPLEMENT_KINDS } from "~/lib/forms/schemas/publication-write.schema";

export type PublicationSupplementDraft = {
  label: string;
  url: string;
  kind?: (typeof SUPPLEMENT_KINDS)[number];
};

export type PublicationSupplementsEditorProps = {
  supplements: PublicationSupplementDraft[];
  onChange: (supplements: PublicationSupplementDraft[]) => void;
  onDirty: () => void;
};

export default function PublicationSupplementsEditor(
  props: PublicationSupplementsEditorProps,
) {
  function updateRow(
    index: number,
    patch: Partial<PublicationSupplementDraft>,
  ) {
    props.onDirty();
    props.onChange(
      props.supplements.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    );
  }

  function addRow() {
    props.onDirty();
    props.onChange([
      ...props.supplements,
      { label: "", url: "", kind: "other" },
    ]);
  }

  function removeRow(index: number) {
    props.onDirty();
    props.onChange(props.supplements.filter((_, i) => i !== index));
  }

  return (
    <div class="space-y-4">
      <Show
        when={props.supplements.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">
            No supplementary links yet. Add code, data, slides, or repository URLs.
          </p>
        }
      >
        <For each={props.supplements}>
          {(row, index) => (
            <div
              class="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto_auto]"
            >
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Kind</span>
                <select
                  class="siam-input"
                  value={row.kind ?? "other"}
                  onChange={(e) =>
                    updateRow(index(), {
                      kind: e.currentTarget
                        .value as PublicationSupplementDraft["kind"],
                    })
                  }
                >
                  <For each={SUPPLEMENT_KINDS}>
                    {(kind) => (
                      <option value={kind}>
                        {kind.charAt(0).toUpperCase() + kind.slice(1)}
                      </option>
                    )}
                  </For>
                </select>
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Label</span>
                <FormTextInput
                  name={`supplement-label-${index()}`}
                  value={row.label}
                  onInput={(e) =>
                    updateRow(index(), { label: e.currentTarget.value })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">URL (https)</span>
                <FormTextInput
                  name={`supplement-url-${index()}`}
                  value={row.url}
                  onInput={(e) =>
                    updateRow(index(), { url: e.currentTarget.value })
                  }
                />
              </label>
              <div class="flex items-end">
                <button
                  type="button"
                  class="siam-btn-secondary"
                  onClick={() => removeRow(index())}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </For>
      </Show>
      <button type="button" class="siam-btn-secondary" onClick={addRow}>
        Add supplement
      </button>
    </div>
  );
}

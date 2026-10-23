import { createSignal, For, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import FormTextarea from "~/components/forms/FormTextarea";
import FormTextInput from "~/components/forms/FormTextInput";
import type { ProjectSectionKind } from "~/lib/api/types/project.types";
import {
  PROJECT_SECTION_KINDS,
  PROJECT_SECTION_KIND_LABELS,
} from "~/lib/projects/projectLabels";
import type { ProjectWriteInput } from "~/lib/forms/schemas/project-write.schema";

export type ProjectSectionDraft = NonNullable<
  ProjectWriteInput["sections"]
>[number];

export type ProjectSectionsEditorProps = {
  sections: ProjectSectionDraft[];
  onChange: (sections: ProjectSectionDraft[]) => void;
  onDirty: () => void;
};

export default function ProjectSectionsEditor(props: ProjectSectionsEditorProps) {
  const [figurePickerIndex, setFigurePickerIndex] = createSignal<number | null>(
    null,
  );

  function updateRow(index: number, patch: Partial<ProjectSectionDraft>) {
    props.onDirty();
    props.onChange(
      props.sections.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.sections.length) return;
    props.onDirty();
    const rows = [...props.sections];
    const [removed] = rows.splice(index, 1);
    rows.splice(target, 0, removed);
    props.onChange(rows);
  }

  function remove(index: number) {
    props.onDirty();
    props.onChange(props.sections.filter((_, i) => i !== index));
  }

  function addSection(kind: ProjectSectionKind = "custom") {
    props.onDirty();
    props.onChange([
      ...props.sections,
      {
        kind,
        title: kind === "custom" ? "" : null,
        body: "",
      },
    ]);
  }

  const SECTION_PRESETS: ProjectSectionKind[] = [
    "problem",
    "responsibilities",
    "evaluation",
    "results",
    "limitations",
    "future_work",
  ];

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={SECTION_PRESETS}>
          {(kind) => (
            <button
              type="button"
              class="siam-btn-secondary px-2 py-1 text-xs"
              onClick={() => addSection(kind)}
            >
              + {PROJECT_SECTION_KIND_LABELS[kind]}
            </button>
          )}
        </For>
      </div>
      <Show
        when={props.sections.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">
            No case study sections yet. Add problem, methods, results, and
            other narrative blocks.
          </p>
        }
      >
        <For each={props.sections}>
          {(row, index) => (
            <div class="space-y-3 rounded-lg border border-border p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-sm font-medium text-ink">
                  Section {index() + 1}
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
                    disabled={index() === props.sections.length - 1}
                    onClick={() => move(index(), 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    class="siam-btn-secondary px-2 py-1 text-xs"
                    onClick={() => remove(index())}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Kind</span>
                <select
                  class="siam-input"
                  value={row.kind ?? "problem"}
                  onChange={(e) =>
                    updateRow(index(), {
                      kind: e.currentTarget.value as ProjectSectionKind,
                    })
                  }
                >
                  <For each={PROJECT_SECTION_KINDS}>
                    {(kind) => (
                      <option value={kind}>
                        {PROJECT_SECTION_KIND_LABELS[kind]}
                      </option>
                    )}
                  </For>
                </select>
              </label>
              <Show when={(row.kind ?? "problem") === "custom"}>
                <label class="flex flex-col gap-1 text-sm">
                  <span class="text-ink-muted">Custom title *</span>
                  <FormTextInput
                    value={row.title ?? ""}
                    onInput={(e) =>
                      updateRow(index(), { title: e.currentTarget.value })
                    }
                  />
                </label>
              </Show>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Body</span>
                <FormTextarea
                  rows={5}
                  value={row.body}
                  onInput={(e) =>
                    updateRow(index(), { body: e.currentTarget.value })
                  }
                />
              </label>
              <div class="sm:col-span-2">
                <p class="text-sm font-medium text-ink">Figures (optional)</p>
                <p class="text-xs text-ink-muted">
                  Images need alt text in the media library to display on the
                  public site.
                </p>
                <Show when={(row.mediaIds ?? []).length > 0}>
                  <ul class="mt-2 list-none space-y-1 pl-0 font-mono text-xs text-ink-muted">
                    <For each={row.mediaIds ?? []}>
                      {(mediaId, figIndex) => (
                        <li class="flex items-center justify-between gap-2">
                          <span>{mediaId}</span>
                          <button
                            type="button"
                            class="siam-btn-secondary px-2 py-0.5 text-xs"
                            onClick={() => {
                              const next = (row.mediaIds ?? []).filter(
                                (_, i) => i !== figIndex(),
                              );
                              updateRow(index(), {
                                mediaIds: next.length ? next : undefined,
                              });
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
                <button
                  type="button"
                  class="siam-btn-secondary mt-2 text-xs"
                  disabled={(row.mediaIds ?? []).length >= 5}
                  onClick={() => setFigurePickerIndex(index())}
                >
                  Add figure
                </button>
              </div>
            </div>
          )}
        </For>
      </Show>
      <button
        type="button"
        class="siam-btn-secondary text-sm"
        onClick={() => addSection("custom")}
      >
        Add custom section
      </button>
      <MediaPicker
        open={figurePickerIndex() != null}
        imagesOnly
        onClose={() => setFigurePickerIndex(null)}
        onSelect={(selection: MediaPickerSelection) => {
          const idx = figurePickerIndex();
          if (idx == null) return;
          const row = props.sections[idx];
          const mediaIds = [...(row.mediaIds ?? [])];
          if (mediaIds.length < 5 && !mediaIds.includes(selection.id)) {
            mediaIds.push(selection.id);
            updateRow(idx, { mediaIds });
          }
          setFigurePickerIndex(null);
        }}
      />
    </div>
  );
}

import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";
import {
  reindexGalleryRows,
  type TimelineGalleryRow,
} from "~/lib/timeline/timeline-gallery";
import { isAchievementKind } from "~/lib/timeline/timeline-kind-groups";
import {
  MAX_TIMELINE_ENTRY_MEDIA,
  TIMELINE_IMAGE_ROLES,
  timelineImageRoleLabel,
} from "~/lib/timeline/timeline-media.constants";

export type TimelineEntryMediaGalleryProps = {
  rows: TimelineGalleryRow[];
  onChange: (rows: TimelineGalleryRow[]) => void;
  onDirty: () => void;
  kind: TimelineEntryKind;
  maxImages?: number;
};

export function rowsNeedAltWarning(rows: TimelineGalleryRow[]): boolean {
  return rows.some((row) => !row.alt?.trim());
}

export default function TimelineEntryMediaGallery(
  props: TimelineEntryMediaGalleryProps,
) {
  const maxImages = () => props.maxImages ?? MAX_TIMELINE_ENTRY_MEDIA;
  const [pickerOpen, setPickerOpen] = createSignal(false);

  const linkedIds = () => new Set(props.rows.map((r) => r.mediaId));

  function updateRows(next: TimelineGalleryRow[]) {
    props.onChange(reindexGalleryRows(next));
    props.onDirty();
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= props.rows.length) return;
    const rows = [...props.rows];
    const [removed] = rows.splice(index, 1);
    rows.splice(next, 0, removed);
    updateRows(rows);
  }

  function remove(index: number) {
    updateRows(props.rows.filter((_, i) => i !== index));
  }

  function patchRow(index: number, patch: Partial<TimelineGalleryRow>) {
    const rows = props.rows.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    props.onChange(rows);
    props.onDirty();
  }

  function addSelection(selection: MediaPickerSelection) {
    if (linkedIds().has(selection.id) || props.rows.length >= maxImages()) {
      setPickerOpen(false);
      return;
    }
    updateRows([
      ...props.rows,
      {
        mediaId: selection.id,
        sortOrder: props.rows.length,
        caption: null,
        imageRole: null,
        url: selection.url,
        alt: selection.alt,
      },
    ]);
    setPickerOpen(false);
  }

  return (
    <div class="space-y-3">
      <p class="text-sm text-ink-muted">
        {isAchievementKind(props.kind)
          ? "Add certificate, photo, or badge scans."
          : "Optional images for this entry."}
        {" "}
        Images need alt text in the{" "}
        <A href="/admin/media" class="text-link">media library</A> to display on
        the public site.
      </p>

      <For each={props.rows}>
        {(row, index) => (
          <div
            class="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row"
          >
            <Show when={row.url}>
              <img
                src={row.url}
                alt=""
                class="h-20 w-20 shrink-0 rounded-md border border-border object-cover"
              />
            </Show>
            <div class="min-w-0 flex-1 space-y-2">
              <p class="font-mono text-xs text-ink-muted truncate">
                {row.mediaId}
              </p>
              <Show when={!row.alt?.trim()}>
                <p class="text-xs text-warning">
                  Missing alt text — add it in the{" "}
                  <A href="/admin/media" class="text-link">media library</A>.
                </p>
              </Show>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Caption (optional)</span>
                <input
                  type="text"
                  class="siam-input"
                  value={row.caption ?? ""}
                  onInput={(e) =>
                    patchRow(index(), { caption: e.currentTarget.value || null })
                  }
                />
              </label>
              <label class="flex flex-col gap-1 text-sm">
                <span class="text-ink-muted">Image role (optional)</span>
                <select
                  class="siam-input max-w-xs"
                  value={row.imageRole ?? ""}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    patchRow(index(), {
                      imageRole: value ? (value as TimelineGalleryRow["imageRole"]) : null,
                    });
                  }}
                >
                  <option value="">—</option>
                  <For each={[...TIMELINE_IMAGE_ROLES]}>
                    {(role) => (
                      <option value={role}>{timelineImageRoleLabel(role)}</option>
                    )}
                  </For>
                </select>
              </label>
            </div>
            <div class="flex shrink-0 flex-col gap-1 sm:items-end">
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                disabled={index() === 0}
                onClick={() => move(index(), -1)}
              >
                Up
              </button>
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                disabled={index() === props.rows.length - 1}
                onClick={() => move(index(), 1)}
              >
                Down
              </button>
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                onClick={() => remove(index())}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </For>

      <button
        type="button"
        class="siam-btn-secondary text-sm"
        disabled={props.rows.length >= maxImages()}
        onClick={() => setPickerOpen(true)}
      >
        Add image
      </button>

      <MediaPicker
        open={pickerOpen()}
        imagesOnly
        onClose={() => setPickerOpen(false)}
        onSelect={addSelection}
      />
    </div>
  );
}

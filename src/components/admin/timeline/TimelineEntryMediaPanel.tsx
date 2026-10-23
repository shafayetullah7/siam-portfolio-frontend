import { createSignal, onMount, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";
import {
  galleryRowsFromMediaLinks,
  galleryRowsToReplaceItems,
  type TimelineGalleryRow,
} from "~/lib/timeline/timeline-gallery";
import { MAX_TIMELINE_ENTRY_MEDIA } from "~/lib/timeline/timeline-media.constants";
import TimelineEntryMediaGallery from "./TimelineEntryMediaGallery";

export type TimelineEntryMediaPanelProps = {
  entryId: string;
  kind: TimelineEntryKind;
};

export default function TimelineEntryMediaPanel(
  props: TimelineEntryMediaPanelProps,
) {
  const [rows, setRows] = createSignal<TimelineGalleryRow[]>([]);
  const [dirty, setDirty] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string | null>(null);
  const [saveError, setSaveError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const entry = await adminTimelineApi.get(props.entryId);
      setRows(galleryRowsFromMediaLinks(entry.mediaLinks));
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  });

  async function save() {
    setPending(true);
    setSaveError(null);
    setMessage(null);
    try {
      const updated = await adminTimelineApi.replaceMedia(props.entryId, {
        items: galleryRowsToReplaceItems(rows()),
      });
      setRows(galleryRowsFromMediaLinks(updated.mediaLinks));
      setDirty(false);
      setMessage("Gallery saved.");
    } catch (error) {
      setSaveError(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <section class="mt-10 min-w-0 max-w-3xl border-t border-border pt-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="text-lg font-semibold text-ink">
          Image gallery ({rows().length}/{MAX_TIMELINE_ENTRY_MEDIA})
        </h2>
      </div>

      <Show when={loadError()}>
        <div class="mt-4">
          <FormErrorAlert message={loadError()!} />
        </div>
      </Show>
      <Show when={saveError()}>
        <div class="mt-4">
          <FormErrorAlert message={saveError()!} />
        </div>
      </Show>
      <Show when={message()}>
        <div class="mt-4">
          <FormSuccessNotice message={message()} />
        </div>
      </Show>

      <Show when={!loading()} fallback={<p class="mt-4 text-ink-muted">Loading gallery…</p>}>
        <div class="mt-4">
          <TimelineEntryMediaGallery
            rows={rows()}
            kind={props.kind}
            onChange={setRows}
            onDirty={() => {
              setDirty(true);
              setMessage(null);
            }}
          />
        </div>
        <div class="mt-6">
          <button
            type="button"
            class="siam-btn-primary"
            disabled={!dirty() || pending()}
            onClick={() => void save()}
          >
            {pending() ? "Saving…" : "Save gallery"}
          </button>
        </div>
      </Show>
    </section>
  );
}

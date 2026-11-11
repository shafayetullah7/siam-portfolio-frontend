import { createEffect, createSignal, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";

export type AdminHomeMediaFieldProps = {
  label: string;
  helperText?: string;
  mediaId: string | null;
  onDirty: () => void;
  onChange: (mediaId: string | null) => void;
};

export default function AdminHomeMediaField(props: AdminHomeMediaFieldProps) {
  const [pickerOpen, setPickerOpen] = createSignal(false);
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
  const [previewAlt, setPreviewAlt] = createSignal<string | null>(null);

  createEffect(() => {
    const id = props.mediaId;
    if (!id) {
      setPreviewUrl(null);
      setPreviewAlt(null);
      return;
    }
    void adminMediaApi.get(id).then(
      (media) => {
        setPreviewUrl(media.url);
        setPreviewAlt(media.alt);
      },
      () => {
        setPreviewUrl(null);
        setPreviewAlt(null);
      },
    );
  });

  return (
    <div class="block text-sm font-medium">
      <span class="text-ink">{props.label}</span>
      <div class="mt-1 font-normal">
      {props.helperText ? (
        <p class="mb-2 text-sm text-ink-muted">{props.helperText}</p>
      ) : null}
      <p class="mb-2 text-xs text-ink-muted">
        Alt text in the media library is required to publish when an image is selected.
      </p>
      <Show when={previewUrl()}>
        <img
          src={previewUrl()!}
          alt={previewAlt()?.trim() ? previewAlt()! : ""}
          class="mb-3 aspect-[4/5] max-h-64 w-auto rounded-lg border border-border object-cover"
        />
      </Show>
      <Show when={props.mediaId}>
        <p class="mb-2 text-sm text-ink-muted">
          Alt:{" "}
          {previewAlt()?.trim()
            ? previewAlt()
            : "Missing — add alt text in Media library before publish"}
        </p>
      </Show>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          aria-label="Choose image from library"
          onClick={() => setPickerOpen(true)}
        >
          Choose from library
        </button>
        <Show when={props.mediaId}>
          <button
            type="button"
            class="siam-btn-secondary text-sm"
            onClick={() => {
              props.onDirty();
              props.onChange(null);
            }}
          >
            Clear image
          </button>
        </Show>
      </div>
      <MediaPicker
        open={pickerOpen()}
        imagesOnly
        onClose={() => setPickerOpen(false)}
        onSelect={(selection: MediaPickerSelection) => {
          props.onDirty();
          props.onChange(selection.id);
          setPickerOpen(false);
        }}
      />
      </div>
    </div>
  );
}

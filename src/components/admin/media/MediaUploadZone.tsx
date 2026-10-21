import { createSignal, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { MediaAdmin } from "~/lib/api/types/admin.types";
import { MEDIA_ACCEPT, uploadMediaFile } from "./media-upload";

export type MediaUploadZoneProps = {
  onUploaded: (item: MediaAdmin) => void;
  disabled?: boolean;
};

export default function MediaUploadZone(props: MediaUploadZoneProps) {
  const [uploading, setUploading] = createSignal(false);
  const [dragOver, setDragOver] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length || props.disabled || uploading()) return;
    const file = files[0];
    setError(null);
    setUploading(true);
    try {
      const item = await uploadMediaFile(file);
      props.onUploaded(item);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer?.files ?? null);
  }

  return (
    <div class="space-y-2">
      <div
        class="rounded-lg border-2 border-dashed p-6 text-center transition-colors"
        classList={{
          "border-primary bg-primary/5": dragOver(),
          "border-border": !dragOver(),
          "opacity-60 pointer-events-none": props.disabled || uploading(),
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <p class="text-sm text-ink">
          <Show when={uploading()} fallback="Drag an image or PDF here, or choose a file.">
            Uploading…
          </Show>
        </p>
        <p class="mt-1 text-xs text-ink-muted">
          Images up to 3 MB · Images or PDF up to 10 MB
        </p>
        <label class="mt-4 inline-block">
          <span class="siam-btn-secondary cursor-pointer text-sm">Choose file</span>
          <input
            type="file"
            class="sr-only"
            accept={MEDIA_ACCEPT}
            disabled={props.disabled || uploading()}
            onChange={(e) => {
              handleFiles(e.currentTarget.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <FormErrorAlert message={error()} />
    </div>
  );
}

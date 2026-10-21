import { createEffect, createSignal, Show } from "solid-js";
import AdminDialog from "~/components/admin/AdminDialog";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import type { MediaListResponse } from "~/lib/api/types/admin.types";
import MediaLibraryBrowser, { findMediaInList } from "./MediaLibraryBrowser";
import type { MediaPickerSelection } from "./media-picker.types";
import MediaUploadZone from "./MediaUploadZone";

export type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (selection: MediaPickerSelection) => void;
  imagesOnly?: boolean;
  allowUpload?: boolean;
  title?: string;
};

export default function MediaPicker(props: MediaPickerProps) {
  const imagesOnly = () => props.imagesOnly ?? true;
  const allowUpload = () => props.allowUpload ?? true;

  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [listSnapshot, setListSnapshot] = createSignal<MediaListResponse | null>(
    null,
  );
  const [confirming, setConfirming] = createSignal(false);

  createEffect(() => {
    if (!props.open) {
      setSelectedId(null);
      setListSnapshot(null);
    }
  });

  async function confirmSelection() {
    const id = selectedId();
    if (!id || confirming()) return;
    setConfirming(true);
    try {
      const fromList = findMediaInList(listSnapshot(), id);
      const item = fromList ?? await adminMediaApi.get(id);
      props.onSelect({
        id: item.id,
        url: item.url,
        alt: item.alt ?? "",
      });
      props.onClose();
    } finally {
      setConfirming(false);
    }
  }

  function onUploaded(item: { id: string }) {
    setSelectedId(item.id);
  }

  return (
    <AdminDialog
      open={props.open}
      title={props.title ?? "Choose from library"}
      onClose={props.onClose}
      footer={
        <>
          <button type="button" class="siam-btn-secondary" onClick={props.onClose}>
            Cancel
          </button>
          <button
            type="button"
            class="siam-btn-primary"
            disabled={!selectedId() || confirming()}
            onClick={confirmSelection}
          >
            {confirming() ? "Applying…" : "Use selected"}
          </button>
        </>
      }
    >
      <div class="space-y-4">
        <Show when={allowUpload()}>
          <MediaUploadZone
            imageOnly={imagesOnly()}
            onUploaded={onUploaded}
            disabled={confirming()}
          />
        </Show>
        <MediaLibraryBrowser
          compact
          imagesOnly={imagesOnly()}
          selectedId={selectedId()}
          onSelect={setSelectedId}
          onListLoaded={setListSnapshot}
        />
      </div>
    </AdminDialog>
  );
}

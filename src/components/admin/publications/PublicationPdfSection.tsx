import { createSignal, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import type { PublicationPdfMediaSummary } from "~/lib/api/types/publication.types";

export type PublicationPdfSectionProps = {
  pdfMediaId: string | null;
  pdfMedia?: PublicationPdfMediaSummary | null;
  pdfRightsGranted: boolean;
  openAccess: boolean;
  onDirty: () => void;
  onChange: (patch: {
    pdfMediaId?: string | null;
    pdfMedia?: PublicationPdfMediaSummary | null;
    pdfRightsGranted?: boolean;
    openAccess?: boolean;
  }) => void;
};

export default function PublicationPdfSection(props: PublicationPdfSectionProps) {
  const [pickerOpen, setPickerOpen] = createSignal(false);

  function handleSelect(selection: MediaPickerSelection) {
    props.onDirty();
    props.onChange({
      pdfMediaId: selection.id,
      pdfMedia: {
        id: selection.id,
        fileName: selection.alt?.trim() || "Publication PDF",
        url: selection.url,
      },
    });
    setPickerOpen(false);
  }

  return (
    <div class="space-y-4">
      <p class="text-sm text-ink-muted">
        Host a PDF only when{" "}
        <a
          href="/docs/content-permissions.md"
          class="text-link underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          content permissions
        </a>{" "}
        are granted. Publisher and DOI links work without a hosted file.
      </p>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.openAccess}
          onChange={(e) => {
            props.onDirty();
            props.onChange({ openAccess: e.currentTarget.checked });
          }}
        />
        Mark as open access (publisher or hosted)
      </label>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.pdfRightsGranted}
          onChange={(e) => {
            props.onDirty();
            props.onChange({ pdfRightsGranted: e.currentTarget.checked });
          }}
        />
        Rights granted to host PDF on this site
      </label>

      <Show when={props.pdfRightsGranted}>
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="siam-btn-secondary"
            onClick={() => setPickerOpen(true)}
          >
            {props.pdfMediaId ? "Change PDF" : "Choose PDF from media"}
          </button>
          <Show when={props.pdfMedia}>
            {(media) => (
              <span class="text-sm text-ink">
                {media().fileName}
              </span>
            )}
          </Show>
          <Show when={props.pdfMediaId}>
            <button
              type="button"
              class="siam-btn-secondary"
              onClick={() => {
                props.onDirty();
                props.onChange({ pdfMediaId: null, pdfMedia: null });
              }}
            >
              Remove PDF
            </button>
          </Show>
        </div>
      </Show>

      <MediaPicker
        open={pickerOpen()}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        imagesOnly={false}
        title="Choose publication PDF"
      />
    </div>
  );
}

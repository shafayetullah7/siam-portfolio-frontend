import { Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import {
  parseTagsFromInput,
  tagsToInput,
} from "~/lib/projects/projectLabels";
import type { WritingWriteInput } from "~/lib/forms/schemas/writing-write.schema";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";

export type WritingMetadataFormProps = {
  draft: WritingWriteInput;
  slugManual: boolean;
  coverPickerOpen: boolean;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<WritingWriteInput>) => void;
  onSlugManualChange: (manual: boolean) => void;
  onCoverPickerOpen: (open: boolean) => void;
  onDirty: () => void;
};

export default function WritingMetadataForm(props: WritingMetadataFormProps) {
  const d = () => props.draft;

  function updateTitle(value: string) {
    props.onDirty();
    const patch: Partial<WritingWriteInput> = { title: value };
    if (!props.slugManual) {
      patch.slug = slugFromTitle(value);
    }
    props.onDraftChange(patch);
  }

  return (
    <div class="siam-card space-y-4 p-5">
      <h2 class="text-sm font-semibold text-ink">Metadata</h2>

      <FormField label="Title" name="title" required error={props.fieldErrors.title}>
        <FormTextInput
          name="title"
          value={d().title}
          onInput={(e) => updateTitle(e.currentTarget.value)}
          error={props.fieldErrors.title}
        />
      </FormField>

      <FormField label="Slug" name="slug" required error={props.fieldErrors.slug}>
        <FormTextInput
          name="slug"
          value={d().slug}
          onInput={(e) => {
            props.onSlugManualChange(true);
            props.onDirty();
            props.onDraftChange({ slug: e.currentTarget.value });
          }}
          error={props.fieldErrors.slug}
        />
        <p class="mt-1 text-xs text-ink-muted">
          Public URL:{" "}
          <span class="font-mono">/writing/{d().slug.trim() || "your-slug"}</span>
        </p>
      </FormField>

      <FormField label="Summary" name="summary" required error={props.fieldErrors.summary}>
        <FormTextarea
          name="summary"
          rows={3}
          value={d().summary}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ summary: e.currentTarget.value });
          }}
          error={props.fieldErrors.summary}
        />
      </FormField>

      <FormField label="Subtitle" name="subtitle" error={props.fieldErrors.subtitle}>
        <FormTextInput
          name="subtitle"
          value={d().subtitle ?? ""}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ subtitle: e.currentTarget.value });
          }}
        />
      </FormField>

      <FormField label="Tags" name="tags">
        <FormTextInput
          name="tags"
          value={tagsToInput(d().tags)}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({
              tags: parseTagsFromInput(e.currentTarget.value),
            });
          }}
        />
        <p class="mt-1 text-xs text-ink-muted">Comma-separated</p>
      </FormField>

      <FormField label="Byline" name="byline">
        <FormTextInput
          name="byline"
          value={d().byline ?? ""}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ byline: e.currentTarget.value });
          }}
        />
      </FormField>

      <FormField label="SEO title" name="seoTitle">
        <FormTextInput
          name="seoTitle"
          value={d().seoTitle ?? ""}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ seoTitle: e.currentTarget.value });
          }}
        />
      </FormField>

      <FormField label="SEO description" name="seoDescription">
        <FormTextarea
          name="seoDescription"
          rows={2}
          value={d().seoDescription ?? ""}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ seoDescription: e.currentTarget.value });
          }}
        />
      </FormField>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={d().hideFromSearch ?? false}
          onChange={(e) => {
            props.onDirty();
            props.onDraftChange({ hideFromSearch: e.currentTarget.checked });
          }}
        />
        Hide from site search
      </label>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={d().featuredOnHub ?? false}
          onChange={(e) => {
            props.onDirty();
            props.onDraftChange({ featuredOnHub: e.currentTarget.checked });
          }}
        />
        Featured on writing hub
      </label>

      <div>
        <p class="text-sm font-medium text-ink">Cover image</p>
        <Show
          when={d().coverMediaId}
          fallback={
            <button
              type="button"
              class="siam-btn-secondary mt-2"
              onClick={() => props.onCoverPickerOpen(true)}
            >
              Choose cover
            </button>
          }
        >
          <p class="mt-1 font-mono text-xs text-ink-muted">{d().coverMediaId}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="siam-btn-secondary"
              onClick={() => props.onCoverPickerOpen(true)}
            >
              Change cover
            </button>
            <button
              type="button"
              class="siam-btn-secondary"
              onClick={() => {
                props.onDirty();
                props.onDraftChange({ coverMediaId: null });
              }}
            >
              Remove
            </button>
          </div>
        </Show>
      </div>

      <MediaPicker
        open={props.coverPickerOpen}
        onClose={() => props.onCoverPickerOpen(false)}
        imagesOnly
        onSelect={(selection: MediaPickerSelection) => {
          props.onDirty();
          props.onDraftChange({ coverMediaId: selection.id });
          props.onCoverPickerOpen(false);
        }}
      />
    </div>
  );
}

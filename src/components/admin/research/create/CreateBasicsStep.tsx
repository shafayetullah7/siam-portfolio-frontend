import { A } from "@solidjs/router";
import { Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";
import type { ResearchThemeCreateDraft } from "./createWizard.types";
import ThemeStatusChoice from "./ThemeStatusChoice";

export type CreateBasicsStepProps = {
  draft: ResearchThemeCreateDraft;
  slugManual: boolean;
  coverPickerOpen: boolean;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<ResearchThemeCreateDraft>) => void;
  onSlugManualChange: (manual: boolean) => void;
  onCoverPickerOpen: (open: boolean) => void;
  onDirty: () => void;
};

export default function CreateBasicsStep(props: CreateBasicsStepProps) {
  const d = () => props.draft;

  function updateTitle(value: string) {
    props.onDirty();
    const patch: Partial<ResearchThemeCreateDraft> = { title: value };
    if (!props.slugManual) {
      patch.slug = slugFromTitle(value);
    }
    props.onDraftChange(patch);
  }

  return (
    <div class="siam-card space-y-5 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 1</p>
        <h2 class="text-lg font-semibold text-ink">Basics</h2>
        <p class="mt-1 text-sm text-ink-muted">
          What visitors see on the research hub card. You can add relations and
          publish after saving.
        </p>
      </div>

      <FormField label="Title" name="title" error={props.fieldErrors.title}>
        <FormTextInput
          name="title"
          value={d().title}
          onInput={(e) => updateTitle(e.currentTarget.value)}
          error={props.fieldErrors.title}
        />
      </FormField>

      <FormField label="Summary" name="summary" error={props.fieldErrors.summary}>
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
        <p class="mt-1 text-xs text-ink-muted">
          Used on the hub card and as the default SEO description.
        </p>
      </FormField>

      <FormField label="Slug" name="slug" error={props.fieldErrors.slug}>
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
          <span class="font-mono">
            /research/{d().slug.trim() || "your-slug"}
          </span>
          {" · "}
          <button
            type="button"
            class="text-link text-xs"
            onClick={() => {
              props.onSlugManualChange(false);
              props.onDraftChange({ slug: slugFromTitle(d().title) });
            }}
          >
            Reset from title
          </button>
        </p>
      </FormField>

      <FormField label="Theme status" name="themeStatus">
        <ThemeStatusChoice
          value={d().themeStatus}
          onChange={(value) => {
            props.onDirty();
            props.onDraftChange({ themeStatus: value });
          }}
        />
      </FormField>

      <FormField label="Methods / domains" name="tags">
        <FormTextInput
          name="tags"
          value={d().tagsInput}
          placeholder="e.g. Interpretability, Safety"
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ tagsInput: e.currentTarget.value });
          }}
        />
      </FormField>

      <div>
        <p class="mb-2 text-sm font-medium text-ink">Cover image (optional)</p>
        <Show when={d().coverPreviewUrl}>
          <img
            src={d().coverPreviewUrl!}
            alt={d().coverPreviewAlt ?? ""}
            class="mb-3 max-h-40 w-full max-w-md rounded-lg object-cover"
          />
        </Show>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="siam-btn-secondary text-sm"
            onClick={() => props.onCoverPickerOpen(true)}
          >
            Choose from library
          </button>
          <Show when={d().coverMediaId}>
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              onClick={() => {
                props.onDirty();
                props.onDraftChange({
                  coverMediaId: null,
                  coverPreviewUrl: null,
                  coverPreviewAlt: null,
                });
              }}
            >
              Clear cover
            </button>
          </Show>
        </div>
        <Show when={d().coverMediaId && !d().coverPreviewAlt?.trim()}>
          <p class="mt-2 text-sm text-ink-muted">
            Add alt text in the{" "}
            <A href="/admin/media" class="text-link">Media library</A>.
          </p>
        </Show>
      </div>

      <MediaPicker
        open={props.coverPickerOpen}
        imagesOnly
        onClose={() => props.onCoverPickerOpen(false)}
        onSelect={(selection: MediaPickerSelection) => {
          props.onDirty();
          props.onDraftChange({
            coverMediaId: selection.id,
            coverPreviewUrl: selection.url,
            coverPreviewAlt: selection.alt ?? null,
          });
          props.onCoverPickerOpen(false);
        }}
      />
    </div>
  );
}

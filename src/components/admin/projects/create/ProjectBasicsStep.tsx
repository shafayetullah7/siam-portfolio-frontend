import { createEffect, createSignal, For, Show } from "solid-js";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import type { EvaluationMaturity, ProjectStatus } from "~/lib/api/types/project.types";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { PROJECT_TYPES } from "~/lib/forms/schemas/project-write.schema";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";
import {
  EVALUATION_MATURITY_LABELS,
  parseTagsFromInput,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
  tagsToInput,
} from "~/lib/projects/projectLabels";
import type { ProjectWizardDraft } from "./projectWizard.types";

export type ProjectBasicsStepProps = {
  draft: ProjectWizardDraft;
  slugManual: boolean;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<ProjectWizardDraft>) => void;
  onSlugManualChange: (manual: boolean) => void;
  onDirty: () => void;
};

export default function ProjectBasicsStep(props: ProjectBasicsStepProps) {
  const d = () => props.draft;
  const [coverPickerOpen, setCoverPickerOpen] = createSignal(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = createSignal<string | null>(
    null,
  );
  const [coverPreviewAlt, setCoverPreviewAlt] = createSignal<string | null>(
    null,
  );

  createEffect(() => {
    const mediaId = d().coverMediaId;
    if (!mediaId) {
      setCoverPreviewUrl(null);
      setCoverPreviewAlt(null);
      return;
    }
    void adminMediaApi.get(mediaId).then(
      (media) => {
        setCoverPreviewUrl(media.url);
        setCoverPreviewAlt(media.alt);
      },
      () => {
        setCoverPreviewUrl(null);
        setCoverPreviewAlt(null);
      },
    );
  });

  function updateTitle(value: string) {
    props.onDirty();
    const patch: Partial<ProjectWizardDraft> = { title: value };
    if (!props.slugManual) {
      patch.slug = slugFromTitle(value);
    }
    props.onDraftChange(patch);
  }

  function nullableField(
    key: keyof ProjectWizardDraft,
    value: string,
  ) {
    props.onDirty();
    const normalized = value.trim() === "" ? null : value;
    props.onDraftChange({ [key]: normalized } as Partial<ProjectWizardDraft>);
  }

  return (
    <div class="siam-card space-y-5 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 1</p>
        <h2 class="text-lg font-semibold text-ink">Basics</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Title, summary, and classification. Slug drives the public URL under{" "}
          <span class="font-mono">/projects/…</span> when published.
        </p>
      </div>

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
          <span class="font-mono">
            /projects/{d().slug.trim() || "your-slug"}
          </span>
          {" · "}
          <button
            type="button"
            class="text-link text-xs"
            onClick={() => {
              props.onSlugManualChange(false);
              props.onDraftChange({ slug: slugFromTitle(d().title) });
              props.onDirty();
            }}
          >
            Reset from title
          </button>
        </p>
      </FormField>

      <FormField
        label="Summary"
        name="summary"
        required
        error={props.fieldErrors.summary}
      >
        <FormTextarea
          name="summary"
          rows={4}
          value={d().summary}
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({ summary: e.currentTarget.value });
          }}
          error={props.fieldErrors.summary}
        />
      </FormField>

      <div class="grid gap-5 sm:grid-cols-2">
        <FormField label="Project type" name="projectType">
          <select
            class="siam-input"
            name="projectType"
            value={d().projectType ?? "other"}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({
                projectType: e.currentTarget.value as ProjectWizardDraft["projectType"],
              });
            }}
          >
            <For each={PROJECT_TYPES}>
              {(type) => (
                <option value={type}>{PROJECT_TYPE_LABELS[type]}</option>
              )}
            </For>
          </select>
        </FormField>
        <FormField label="Project status" name="projectStatus">
          <select
            class="siam-input"
            name="projectStatus"
            value={d().projectStatus ?? "completed"}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({
                projectStatus: e.currentTarget
                  .value as ProjectWizardDraft["projectStatus"],
              });
            }}
          >
            <For each={Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]}>
              {(status) => (
                <option value={status}>{PROJECT_STATUS_LABELS[status]}</option>
              )}
            </For>
          </select>
        </FormField>
      </div>

      <FormField label="Evaluation maturity" name="evaluationMaturity">
        <select
          class="siam-input"
          value={d().evaluationMaturity ?? "provisional"}
          onChange={(e) => {
            props.onDirty();
            props.onDraftChange({
              evaluationMaturity: e.currentTarget
                .value as ProjectWizardDraft["evaluationMaturity"],
            });
          }}
        >
          <For each={Object.keys(EVALUATION_MATURITY_LABELS) as EvaluationMaturity[]}>
            {(m) => (
              <option value={m}>{EVALUATION_MATURITY_LABELS[m]}</option>
            )}
          </For>
        </select>
      </FormField>

      <FormField label="Tags" name="tags">
        <FormTextInput
          name="tags"
          value={tagsToInput(d().tags)}
          placeholder="e.g. NLP, PyTorch"
          onInput={(e) => {
            props.onDirty();
            props.onDraftChange({
              tags: parseTagsFromInput(e.currentTarget.value),
            });
          }}
        />
      </FormField>

      <div class="grid gap-5 sm:grid-cols-2">
        <FormField label="Period start" name="periodStart">
          <FormTextInput
            name="periodStart"
            placeholder="YYYY-MM"
            value={d().periodStart ?? ""}
            onInput={(e) => nullableField("periodStart", e.currentTarget.value)}
          />
        </FormField>
        <FormField label="Period end" name="periodEnd">
          <FormTextInput
            name="periodEnd"
            placeholder="YYYY-MM"
            value={d().periodEnd ?? ""}
            onInput={(e) => nullableField("periodEnd", e.currentTarget.value)}
          />
        </FormField>
      </div>

      <FormField label="Owner role" name="ownerRole">
        <FormTextInput
          name="ownerRole"
          value={d().ownerRole ?? ""}
          onInput={(e) => nullableField("ownerRole", e.currentTarget.value)}
        />
      </FormField>

      <FormField label="Your contribution" name="ownerContribution">
        <FormTextarea
          name="ownerContribution"
          rows={3}
          value={d().ownerContribution ?? ""}
          onInput={(e) =>
            nullableField("ownerContribution", e.currentTarget.value)
          }
        />
      </FormField>

      <FormField label="Result teaser" name="resultTeaser">
        <FormTextarea
          name="resultTeaser"
          rows={2}
          value={d().resultTeaser ?? ""}
          onInput={(e) => nullableField("resultTeaser", e.currentTarget.value)}
        />
      </FormField>

      <div>
        <p class="mb-2 text-sm font-medium text-ink">Cover image (optional)</p>
        <p class="mb-2 text-xs text-ink-muted">
          Alt text in the media library is required to publish when a cover is set.
        </p>
        <Show when={coverPreviewUrl()}>
          <img
            src={coverPreviewUrl()!}
            alt={coverPreviewAlt()?.trim() ? coverPreviewAlt()! : ""}
            class="mb-3 max-h-40 rounded-lg border border-border object-cover"
          />
        </Show>
        <Show when={d().coverMediaId}>
          <p class="mb-2 text-sm text-ink-muted">
            Alt:{" "}
            {coverPreviewAlt()?.trim()
              ? coverPreviewAlt()
              : "Missing — add alt text in Media library before publish"}
          </p>
        </Show>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="siam-btn-secondary text-sm"
            onClick={() => setCoverPickerOpen(true)}
          >
            Choose from library
          </button>
          <Show when={d().coverMediaId}>
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              onClick={() => {
                props.onDirty();
                props.onDraftChange({ coverMediaId: null });
              }}
            >
              Clear cover
            </button>
          </Show>
        </div>
      </div>

      <MediaPicker
        open={coverPickerOpen()}
        imagesOnly
        onClose={() => setCoverPickerOpen(false)}
        onSelect={(selection: MediaPickerSelection) => {
          props.onDirty();
          props.onDraftChange({ coverMediaId: selection.id });
          setCoverPickerOpen(false);
        }}
      />
    </div>
  );
}

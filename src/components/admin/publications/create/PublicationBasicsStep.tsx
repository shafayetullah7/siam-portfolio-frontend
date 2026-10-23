import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PublicationAuthorsEditor from "~/components/admin/publications/PublicationAuthorsEditor";
import { slugFromTitle } from "~/lib/slug/slugFromTitle";
import type { PublicationWizardDraft } from "./publicationWizard.types";

export type PublicationBasicsStepProps = {
  draft: PublicationWizardDraft;
  slugManual: boolean;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<PublicationWizardDraft>) => void;
  onSlugManualChange: (manual: boolean) => void;
  onDirty: () => void;
};

export default function PublicationBasicsStep(props: PublicationBasicsStepProps) {
  const d = () => props.draft;

  function updateTitle(value: string) {
    props.onDirty();
    const patch: Partial<PublicationWizardDraft> = { title: value };
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
          Title, authors, and venue. Slug drives the public URL under{" "}
          <span class="font-mono">/publications/…</span>.
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
            /publications/{d().slug.trim() || "your-slug"}
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
        label="Authors"
        name="authors"
        required
        error={props.fieldErrors.authors}
      >
        <PublicationAuthorsEditor
          authors={d().authors}
          nameError={props.fieldErrors.authors}
          onDirty={props.onDirty}
          onChange={(authors) => props.onDraftChange({ authors })}
        />
      </FormField>

      <div class="grid gap-5 sm:grid-cols-2">
        <FormField label="Year" name="year" required error={props.fieldErrors.year}>
          <FormTextInput
            name="year"
            type="number"
            min={1900}
            max={2100}
            value={String(d().year)}
            onInput={(e) => {
              props.onDirty();
              const n = Number.parseInt(e.currentTarget.value, 10);
              props.onDraftChange({
                year: Number.isNaN(n) ? d().year : n,
              });
            }}
            error={props.fieldErrors.year}
          />
        </FormField>

        <FormField label="Venue" name="venue" required error={props.fieldErrors.venue}>
          <FormTextInput
            name="venue"
            value={d().venue}
            onInput={(e) => {
              props.onDirty();
              props.onDraftChange({ venue: e.currentTarget.value });
            }}
            error={props.fieldErrors.venue}
          />
        </FormField>
      </div>
    </div>
  );
}

import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import type { PublicationWriteInput } from "~/lib/forms/schemas/publication-write.schema";
import type { PublicationWizardDraft } from "./publicationWizard.types";

export type PublicationStoryDisplayStepProps = {
  draft: PublicationWizardDraft;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<PublicationWizardDraft>) => void;
  onDirty: () => void;
};

export default function PublicationStoryDisplayStep(
  props: PublicationStoryDisplayStepProps,
) {
  const d = () => props.draft;

  function nullableField(key: keyof PublicationWriteInput, value: string) {
    props.onDirty();
    const normalized = value.trim() === "" ? null : value;
    props.onDraftChange({ [key]: normalized } as Partial<PublicationWizardDraft>);
  }

  return (
    <div class="space-y-6">
      <div class="siam-card space-y-5 p-6">
        <div>
          <p class="siam-eyebrow text-secondary">Step 3</p>
          <h2 class="text-lg font-semibold text-ink">Story</h2>
          <p class="mt-1 text-sm text-ink-muted">
            Optional narrative for the publication detail page.
          </p>
        </div>

        <FormField
          label="Significance"
          name="significance"
          error={props.fieldErrors.significance}
        >
          <FormTextarea
            name="significance"
            rows={3}
            value={d().significance ?? ""}
            onInput={(e) =>
              nullableField("significance", e.currentTarget.value)
            }
            error={props.fieldErrors.significance}
          />
        </FormField>

        <FormField
          label="Your contribution"
          name="ownerContribution"
          error={props.fieldErrors.ownerContribution}
        >
          <FormTextarea
            name="ownerContribution"
            rows={3}
            value={d().ownerContribution ?? ""}
            onInput={(e) =>
              nullableField("ownerContribution", e.currentTarget.value)
            }
            error={props.fieldErrors.ownerContribution}
          />
        </FormField>

        <FormField
          label="Correction notice"
          name="correctionNotice"
          error={props.fieldErrors.correctionNotice}
        >
          <FormTextarea
            name="correctionNotice"
            rows={2}
            value={d().correctionNotice ?? ""}
            onInput={(e) =>
              nullableField("correctionNotice", e.currentTarget.value)
            }
            error={props.fieldErrors.correctionNotice}
          />
        </FormField>
      </div>

      <div class="siam-card space-y-5 p-6">
        <h3 class="text-base font-semibold text-ink">SEO &amp; visibility</h3>

        <FormField label="SEO title" name="seoTitle" error={props.fieldErrors.seoTitle}>
          <FormTextInput
            name="seoTitle"
            value={d().seoTitle ?? ""}
            onInput={(e) => nullableField("seoTitle", e.currentTarget.value)}
            error={props.fieldErrors.seoTitle}
          />
        </FormField>

        <FormField
          label="SEO description"
          name="seoDescription"
          error={props.fieldErrors.seoDescription}
        >
          <FormTextarea
            name="seoDescription"
            rows={3}
            value={d().seoDescription ?? ""}
            onInput={(e) =>
              nullableField("seoDescription", e.currentTarget.value)
            }
            error={props.fieldErrors.seoDescription}
          />
        </FormField>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().hideFromSearch}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({ hideFromSearch: e.currentTarget.checked });
            }}
          />
          Hide from site search
        </label>
      </div>

      <div class="siam-card space-y-5 p-6">
        <h3 class="text-base font-semibold text-ink">Featured</h3>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featured}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({ featured: e.currentTarget.checked });
            }}
          />
          Featured publication
        </label>

        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featuredOnHome}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({ featuredOnHome: e.currentTarget.checked });
            }}
          />
          Featured on home
        </label>
      </div>
    </div>
  );
}

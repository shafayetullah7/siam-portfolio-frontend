import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import type { ProjectWizardDraft } from "./projectWizard.types";

export type ProjectDisplaySeoStepProps = {
  draft: ProjectWizardDraft;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<ProjectWizardDraft>) => void;
  onDirty: () => void;
};

export default function ProjectDisplaySeoStep(
  props: ProjectDisplaySeoStepProps,
) {
  const d = () => props.draft;

  function nullableField(key: keyof ProjectWizardDraft, value: string) {
    props.onDirty();
    const normalized = value.trim() === "" ? null : value;
    props.onDraftChange({ [key]: normalized } as Partial<ProjectWizardDraft>);
  }

  return (
    <div class="siam-card space-y-5 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 4</p>
        <h2 class="text-lg font-semibold text-ink">Display & SEO</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Featured flags, sort order, and search metadata.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featured ?? false}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({ featured: e.currentTarget.checked });
            }}
          />
          Featured on projects listing
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d().featuredOnHome ?? false}
            onChange={(e) => {
              props.onDirty();
              props.onDraftChange({ featuredOnHome: e.currentTarget.checked });
            }}
          />
          Featured on home (max 3 published)
        </label>
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
      </div>

      <FormField label="Sort order" name="sortOrder">
        <FormTextInput
          name="sortOrder"
          type="number"
          min={0}
          value={String(d().sortOrder ?? 0)}
          onInput={(e) => {
            props.onDirty();
            const n = Number.parseInt(e.currentTarget.value, 10);
            props.onDraftChange({
              sortOrder: Number.isNaN(n) ? 0 : n,
            });
          }}
        />
      </FormField>

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
    </div>
  );
}

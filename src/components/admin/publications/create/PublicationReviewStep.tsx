import { For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import type { PublicationWizardDraft } from "./publicationWizard.types";

export type PublicationReviewStepProps = {
  draft: PublicationWizardDraft;
  formMessage: string | null;
  isEdit: boolean;
  canSave: boolean;
  stepNumber: number;
};

function reviewChecklist(draft: PublicationWizardDraft): string[] {
  const items: string[] = [];
  if (draft.title.trim()) items.push(`Title: ${draft.title.trim()}`);
  if (draft.slug.trim()) items.push(`Slug: ${draft.slug.trim()}`);
  const authorNames = draft.authors
    .map((a) => a.name.trim())
    .filter(Boolean);
  if (authorNames.length > 0) {
    items.push(`Authors: ${authorNames.join(", ")}`);
  }
  if (draft.venue.trim()) {
    items.push(`${draft.year} · ${draft.venue.trim()}`);
  }
  if (draft.abstract?.trim()) items.push("Abstract set");
  if (draft.doi?.trim()) items.push(`DOI: ${draft.doi.trim()}`);
  if (draft.supplements.length > 0) {
    items.push(`${draft.supplements.length} supplement(s)`);
  }
  if (draft.pdfMediaId) items.push("PDF attached");
  if (draft.featured) items.push("Featured");
  if (draft.featuredOnHome) items.push("Featured on home");
  return items;
}

export default function PublicationReviewStep(props: PublicationReviewStepProps) {
  const checks = () => reviewChecklist(props.draft);

  return (
    <div class="siam-card min-w-0 space-y-4 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step {props.stepNumber}</p>
        <h2 class="text-lg font-semibold text-ink">
          {props.isEdit ? "Review & save" : "Review & save"}
        </h2>
        <p class="mt-1 text-sm text-ink-muted">
          {props.isEdit
            ? "Confirm basics and scholarly metadata, then save. Publish from the publication view when ready."
            : "Saving creates a draft. You can add story, SEO, and publish from the publication view."}
        </p>
      </div>
      <FormErrorAlert message={props.formMessage} />
      <Show when={!props.canSave}>
        <p
          class="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-ink"
          role="status"
        >
          Complete all required fields on <strong>Basics</strong> (marked with{" "}
          <span class="text-error">*</span>) before saving.
        </p>
      </Show>
      <ul class="list-disc space-y-1 pl-5 text-sm text-ink-muted">
        <For each={checks()}>{(line) => <li>{line}</li>}</For>
      </ul>
    </div>
  );
}

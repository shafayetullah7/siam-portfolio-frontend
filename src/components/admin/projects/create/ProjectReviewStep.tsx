import { For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { PROJECT_TYPE_LABELS } from "~/lib/projects/projectLabels";
import type { ProjectWizardDraft } from "./projectWizard.types";

export type ProjectReviewStepProps = {
  draft: ProjectWizardDraft;
  formMessage: string | null;
  isEdit: boolean;
  canSave: boolean;
  stepNumber: number;
};

function reviewChecklist(draft: ProjectWizardDraft): string[] {
  const items: string[] = [];
  if (draft.title.trim()) items.push(`Title: ${draft.title.trim()}`);
  if (draft.slug.trim()) items.push(`Slug: ${draft.slug.trim()}`);
  if (draft.summary.trim()) items.push("Summary set");
  if (draft.projectType) {
    items.push(`Type: ${PROJECT_TYPE_LABELS[draft.projectType]}`);
  }
  const sections = draft.sections ?? [];
  if (sections.length > 0) {
    items.push(`${sections.length} case study section(s)`);
  }
  const metrics = draft.metrics ?? [];
  if (metrics.length > 0) {
    items.push(`${metrics.length} metric row(s)`);
  }
  const resources = draft.resources ?? [];
  if (resources.length > 0) {
    items.push(`${resources.length} resource link(s)`);
  }
  if (draft.featured) items.push("Featured");
  if (draft.featuredOnHome) items.push("Featured on home");
  return items;
}

export default function ProjectReviewStep(props: ProjectReviewStepProps) {
  const checks = () => reviewChecklist(props.draft);

  return (
    <div class="siam-card min-w-0 space-y-4 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step {props.stepNumber}</p>
        <h2 class="text-lg font-semibold text-ink">Review & save</h2>
        <p class="mt-1 text-sm text-ink-muted">
          {props.isEdit
            ? "Confirm your changes, then save. Publish controls arrive in a later release."
            : "Saving creates a draft. Open the project overview to continue editing."}
        </p>
      </div>
      <FormErrorAlert message={props.formMessage} />
      <Show when={!props.canSave}>
        <p
          class="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-ink"
          role="status"
        >
          Complete all required fields on <strong>Basics</strong> (marked with{" "}
          <span class="text-error">*</span>) and custom section titles before
          saving.
        </p>
      </Show>
      <ul class="list-disc space-y-1 pl-5 text-sm text-ink-muted">
        <For each={checks()}>{(line) => <li>{line}</li>}</For>
      </ul>
    </div>
  );
}

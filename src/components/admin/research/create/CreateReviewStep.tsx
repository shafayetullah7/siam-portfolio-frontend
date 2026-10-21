import { For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import type { ResearchThemeCreateDraft } from "./createWizard.types";
import ResearchThemeCardPreview from "./ResearchThemeCardPreview";

export type CreateReviewStepProps = {
  draft: ResearchThemeCreateDraft;
  formMessage: string | null;
  isEdit?: boolean;
  canSave?: boolean;
};

function reviewChecklist(draft: ResearchThemeCreateDraft): string[] {
  const items: string[] = [];
  if (draft.title.trim()) items.push("Title set");
  if (draft.summary.trim()) items.push("Summary set");
  if (draft.slug.trim()) items.push(`Slug: ${draft.slug.trim()}`);
  if (draft.problem.trim()) items.push("Problem statement set");
  if (draft.themeStatus === "ongoing" && !draft.objectives.trim()) {
    items.push("Tip: add objectives before publish (ongoing theme)");
  }
  if (draft.themeStatus === "completed" && !draft.findings.trim()) {
    items.push("Tip: add findings before publish (completed theme)");
  }
  return items;
}

export default function CreateReviewStep(props: CreateReviewStepProps) {
  const checks = () => reviewChecklist(props.draft);

  return (
    <div class="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start">
      <div class="siam-card min-w-0 space-y-4 p-6">
        <div>
          <p class="siam-eyebrow text-secondary">Step 3</p>
          <h2 class="text-lg font-semibold text-ink">
            {props.isEdit ? "Review" : "Review & save"}
          </h2>
          <p class="mt-1 text-sm text-ink-muted">
            {props.isEdit
              ? "Check the hub card preview, then continue to More for links and display settings. Save on the last step."
              : "Saving creates a draft theme. You can attach publications, publish, and preview on the next screen."}
          </p>
        </div>
        <FormErrorAlert message={props.formMessage} />
        <Show when={props.canSave === false}>
          <p class="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-ink" role="status">
            Complete all required fields on <strong>Basics</strong> and{" "}
            <strong>Story</strong> (marked with <span class="text-error">*</span>
            ) before saving.
          </p>
        </Show>
        <ul class="list-disc space-y-1 pl-5 text-sm text-ink-muted">
          <For each={checks()}>{(line) => <li>{line}</li>}</For>
        </ul>
      </div>
      <ResearchThemeCardPreview draft={props.draft} />
    </div>
  );
}

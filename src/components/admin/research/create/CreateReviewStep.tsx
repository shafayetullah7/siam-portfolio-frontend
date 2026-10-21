import { For } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import type { ResearchThemeCreateDraft } from "./createWizard.types";
import ResearchThemeCardPreview from "./ResearchThemeCardPreview";

export type CreateReviewStepProps = {
  draft: ResearchThemeCreateDraft;
  formMessage: string | null;
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
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="siam-card space-y-4 p-6">
        <div>
          <p class="siam-eyebrow text-secondary">Step 3</p>
          <h2 class="text-lg font-semibold text-ink">Review & save</h2>
          <p class="mt-1 text-sm text-ink-muted">
            Saving creates a draft theme. You can attach publications, publish,
            and preview on the next screen.
          </p>
        </div>
        <FormErrorAlert message={props.formMessage} />
        <ul class="list-disc space-y-1 pl-5 text-sm text-ink-muted">
          <For each={checks()}>{(line) => <li>{line}</li>}</For>
        </ul>
      </div>
      <ResearchThemeCardPreview draft={props.draft} />
    </div>
  );
}

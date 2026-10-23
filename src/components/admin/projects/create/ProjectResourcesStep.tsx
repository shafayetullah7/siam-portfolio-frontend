import ProjectResourcesEditor from "./ProjectResourcesEditor";
import type { ProjectWizardDraft } from "./projectWizard.types";

export type ProjectResourcesStepProps = {
  draft: ProjectWizardDraft;
  fieldErrors: Record<string, string>;
  onDraftChange: (patch: Partial<ProjectWizardDraft>) => void;
  onDirty: () => void;
};

export default function ProjectResourcesStep(props: ProjectResourcesStepProps) {
  const d = () => props.draft;

  return (
    <div class="siam-card space-y-5 p-6">
      <div>
        <p class="siam-eyebrow text-secondary">Step 3</p>
        <h2 class="text-lg font-semibold text-ink">Resources</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Repository, demo, paper, and other HTTPS links shown on the project
          page.
        </p>
      </div>
      <ProjectResourcesEditor
        resources={d().resources ?? []}
        onDirty={props.onDirty}
        onChange={(resources) => props.onDraftChange({ resources })}
        urlError={props.fieldErrors.resources}
      />
    </div>
  );
}

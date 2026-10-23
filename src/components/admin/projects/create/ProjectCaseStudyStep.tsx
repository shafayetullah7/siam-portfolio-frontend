import ProjectMetricsEditor from "./ProjectMetricsEditor";
import ProjectSectionsEditor from "./ProjectSectionsEditor";
import type { ProjectWizardDraft } from "./projectWizard.types";

export type ProjectCaseStudyStepProps = {
  draft: ProjectWizardDraft;
  onDraftChange: (patch: Partial<ProjectWizardDraft>) => void;
  onDirty: () => void;
};

export default function ProjectCaseStudyStep(props: ProjectCaseStudyStepProps) {
  const d = () => props.draft;

  return (
    <div class="space-y-6">
      <div class="siam-card space-y-5 p-6">
        <div>
          <p class="siam-eyebrow text-secondary">Step 2</p>
          <h2 class="text-lg font-semibold text-ink">Case study sections</h2>
          <p class="mt-1 text-sm text-ink-muted">
            Ordered narrative blocks for the project detail page.
          </p>
        </div>
        <ProjectSectionsEditor
          sections={d().sections ?? []}
          onDirty={props.onDirty}
          onChange={(sections) => props.onDraftChange({ sections })}
        />
      </div>
      <div class="siam-card space-y-5 p-6">
        <h3 class="text-base font-semibold text-ink">Evidence metrics</h3>
        <ProjectMetricsEditor
          metrics={d().metrics ?? []}
          onDirty={props.onDirty}
          onChange={(metrics) => props.onDraftChange({ metrics })}
        />
      </div>
    </div>
  );
}

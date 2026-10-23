import type { ProjectWriteInput } from "~/lib/forms/schemas/project-write.schema";
import { emptyProjectDraft } from "~/lib/forms/schemas/project-write.schema";

export type ProjectWizardDraft = ProjectWriteInput;

export function emptyWizardDraft(): ProjectWizardDraft {
  return emptyProjectDraft();
}

export function isProjectDraftDirty(draft: ProjectWizardDraft): boolean {
  const empty = emptyProjectDraft();
  return (Object.keys(empty) as (keyof ProjectWizardDraft)[]).some(
    (key) => JSON.stringify(draft[key]) !== JSON.stringify(empty[key]),
  );
}

const STEP1_FIELDS = new Set([
  "slug",
  "title",
  "summary",
  "tags",
  "projectType",
  "projectStatus",
  "evaluationMaturity",
  "ownerRole",
  "ownerContribution",
  "resultTeaser",
  "periodStart",
  "periodEnd",
  "coverMediaId",
]);

const STEP2_FIELDS = new Set(["sections", "metrics"]);
const STEP3_FIELDS = new Set(["resources"]);
const STEP4_FIELDS = new Set([
  "featured",
  "featuredOnHome",
  "sortOrder",
  "seoTitle",
  "seoDescription",
  "hideFromSearch",
]);

export const WIZARD_STEPS_CREATE = [
  "Basics",
  "Case study",
  "Resources",
  "Review",
] as const;

export const WIZARD_STEPS_EDIT = [
  "Basics",
  "Case study",
  "Resources",
  "Display & SEO",
  "Review",
] as const;

export function maxWizardStep(isEdit: boolean): number {
  return isEdit ? 5 : 4;
}

export function wizardSteps(isEdit: boolean): readonly string[] {
  return isEdit ? WIZARD_STEPS_EDIT : WIZARD_STEPS_CREATE;
}

export function formStartsAtStep(isEdit: boolean): number {
  return isEdit ? 4 : 4;
}

export function reviewStepNumber(isEdit: boolean): number {
  return isEdit ? 5 : 4;
}

export function wizardStepForField(field: string, isEdit: boolean): number {
  const root = field.split(".")[0];
  if (STEP1_FIELDS.has(root)) return 1;
  if (STEP2_FIELDS.has(root)) return 2;
  if (STEP3_FIELDS.has(root)) return 3;
  if (STEP4_FIELDS.has(root)) return 4;
  return reviewStepNumber(isEdit);
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isStep1Valid(draft: ProjectWizardDraft): boolean {
  return (
    draft.title.trim().length > 0 &&
    draft.slug.trim().length > 0 &&
    SLUG_PATTERN.test(draft.slug.trim()) &&
    draft.summary.trim().length > 0
  );
}

export function customSectionsValid(draft: ProjectWizardDraft): boolean {
  for (const section of draft.sections ?? []) {
    if (section.kind === "custom" && !section.title?.trim()) {
      return false;
    }
  }
  return true;
}

export function isDraftSubmittable(draft: ProjectWizardDraft): boolean {
  return isStep1Valid(draft) && customSectionsValid(draft);
}

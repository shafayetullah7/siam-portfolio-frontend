export type ResearchThemeCreateDraft = {
  title: string;
  slug: string;
  summary: string;
  themeStatus: "ongoing" | "completed";
  tagsInput: string;
  problem: string;
  significance: string;
  objectives: string;
  approach: string;
  findings: string;
  limitations: string;
  futureWork: string;
  coverMediaId: string | null;
  coverPreviewUrl: string | null;
  coverPreviewAlt: string | null;
};

export function emptyCreateDraft(): ResearchThemeCreateDraft {
  return {
    title: "",
    slug: "",
    summary: "",
    themeStatus: "ongoing",
    tagsInput: "",
    problem: "",
    significance: "",
    objectives: "",
    approach: "",
    findings: "",
    limitations: "",
    futureWork: "",
    coverMediaId: null,
    coverPreviewUrl: null,
    coverPreviewAlt: null,
  };
}

export function isCreateDraftDirty(draft: ResearchThemeCreateDraft): boolean {
  const d = emptyCreateDraft();
  return (Object.keys(d) as (keyof ResearchThemeCreateDraft)[]).some(
    (key) => draft[key] !== d[key],
  );
}

const STEP1_FIELDS = new Set([
  "title",
  "slug",
  "summary",
  "themeStatus",
  "tags",
  "coverMediaId",
]);

const STEP2_FIELDS = new Set([
  "problem",
  "significance",
  "objectives",
  "approach",
  "findings",
  "limitations",
  "futureWork",
]);

const STEP4_FIELDS = new Set([
  "acknowledgments",
  "funding",
  "seoTitle",
  "seoDescription",
  "sortOrder",
  "linkLabel",
  "featuredOnHome",
  "collaborators",
  "collaboratorsJson",
  "resources",
  "resourcesJson",
]);

export const WIZARD_STEPS_CREATE = ["Basics", "Story", "Review"] as const;
export const WIZARD_STEPS_EDIT = [
  "Basics",
  "Story",
  "Review",
  "More",
] as const;

export function maxWizardStep(isEdit: boolean): number {
  return isEdit ? 4 : 3;
}

export function wizardSteps(isEdit: boolean): readonly string[] {
  return isEdit ? WIZARD_STEPS_EDIT : WIZARD_STEPS_CREATE;
}

/** Map server fieldErrors to wizard step (1–4 on edit). */
export function wizardStepForField(field: string): number {
  if (STEP1_FIELDS.has(field)) return 1;
  if (STEP2_FIELDS.has(field)) return 2;
  if (STEP4_FIELDS.has(field)) return 4;
  return 3;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isStep1Valid(draft: ResearchThemeCreateDraft): boolean {
  return (
    draft.title.trim().length > 0 &&
    draft.summary.trim().length > 0 &&
    draft.slug.trim().length > 0 &&
    SLUG_PATTERN.test(draft.slug.trim())
  );
}

export function isStep2Valid(draft: ResearchThemeCreateDraft): boolean {
  if (draft.problem.trim().length === 0) return false;
  if (draft.themeStatus === "ongoing" && draft.objectives.trim().length === 0) {
    return false;
  }
  return true;
}

/** All required fields for saving a draft (matches wizard required labels). */
export function isDraftSubmittable(draft: ResearchThemeCreateDraft): boolean {
  return isStep1Valid(draft) && isStep2Valid(draft);
}

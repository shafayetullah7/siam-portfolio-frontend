import type { PublicationWriteInput } from "~/lib/forms/schemas/publication-write.schema";
import { emptyPublicationDraft } from "~/lib/forms/schemas/publication-write.schema";

export type PublicationWizardDraft = PublicationWriteInput;

export function emptyWizardDraft(): PublicationWizardDraft {
  return emptyPublicationDraft();
}

export function isPublicationDraftDirty(
  draft: PublicationWizardDraft,
): boolean {
  const empty = emptyPublicationDraft();
  return (Object.keys(empty) as (keyof PublicationWizardDraft)[]).some(
    (key) => JSON.stringify(draft[key]) !== JSON.stringify(empty[key]),
  );
}

const STEP1_FIELDS = new Set([
  "title",
  "slug",
  "authors",
  "year",
  "venue",
]);

const STEP2_FIELDS = new Set([
  "publicationType",
  "peerReviewed",
  "abstract",
  "doi",
  "publisherUrl",
  "supplements",
  "pdfMediaId",
  "openAccess",
  "pdfRightsGranted",
]);

const STEP3_FIELDS = new Set([
  "significance",
  "ownerContribution",
  "correctionNotice",
  "seoTitle",
  "seoDescription",
  "hideFromSearch",
  "featured",
  "featuredOnHome",
]);

export const WIZARD_STEPS_CREATE = ["Basics", "Scholarly", "Review"] as const;
export const WIZARD_STEPS_EDIT = [
  "Basics",
  "Scholarly",
  "Story & display",
  "Review",
] as const;

export function maxWizardStep(isEdit: boolean): number {
  return isEdit ? 4 : 3;
}

export function wizardSteps(isEdit: boolean): readonly string[] {
  return isEdit ? WIZARD_STEPS_EDIT : WIZARD_STEPS_CREATE;
}

export function wizardStepForField(field: string): number {
  if (STEP1_FIELDS.has(field)) return 1;
  if (STEP2_FIELDS.has(field)) return 2;
  if (STEP3_FIELDS.has(field)) return 3;
  return maxWizardStep(true);
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isStep1Valid(draft: PublicationWizardDraft): boolean {
  const hasAuthor = draft.authors.some((a) => a.name.trim().length > 0);
  return (
    draft.title.trim().length > 0 &&
    draft.slug.trim().length > 0 &&
    SLUG_PATTERN.test(draft.slug.trim()) &&
    hasAuthor &&
    draft.year >= 1900 &&
    draft.year <= 2100 &&
    draft.venue.trim().length > 0
  );
}

export function isDraftSubmittable(draft: PublicationWizardDraft): boolean {
  return isStep1Valid(draft);
}

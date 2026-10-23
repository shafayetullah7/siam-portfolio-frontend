import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";

export const TIMELINE_KIND_LABELS: Record<TimelineEntryKind, string> = {
  award: "Award",
  competition: "Competition",
  scholarship_fellowship_grant: "Scholarship / fellowship / grant",
  certification: "Certification",
  recognition_service: "Recognition & service",
  education: "Education",
  research_experience: "Research experience",
  industry_experience: "Industry experience",
  teaching_mentoring: "Teaching & mentoring",
  affiliation: "Affiliation",
};

export function timelineKindLabel(kind: TimelineEntryKind): string {
  return TIMELINE_KIND_LABELS[kind] ?? kind;
}

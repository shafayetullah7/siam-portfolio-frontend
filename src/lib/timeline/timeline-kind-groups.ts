import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";

export const ACHIEVEMENT_KINDS: readonly TimelineEntryKind[] = [
  "award",
  "competition",
  "scholarship_fellowship_grant",
  "certification",
  "recognition_service",
];

export const EXPERIENCE_KINDS: readonly TimelineEntryKind[] = [
  "education",
  "research_experience",
  "industry_experience",
  "teaching_mentoring",
  "affiliation",
];

export const ALL_TIMELINE_KINDS: readonly TimelineEntryKind[] = [
  ...ACHIEVEMENT_KINDS,
  ...EXPERIENCE_KINDS,
];

export function isAchievementKind(kind: TimelineEntryKind): boolean {
  return (ACHIEVEMENT_KINDS as readonly string[]).includes(kind);
}

import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";
import { isAchievementKind } from "./timeline-kind-groups";

export type TimelineFieldFlags = {
  showProofUrl: boolean;
  showRankOrPlacement: boolean;
  showEventName: boolean;
  showCredentialId: boolean;
  showExpiresAt: boolean;
  showIsCurrent: boolean;
  proofUrlHint: string | null;
};

export function fieldFlagsForKind(kind: TimelineEntryKind): TimelineFieldFlags {
  const p09 = isAchievementKind(kind);
  return {
    showProofUrl: p09,
    showRankOrPlacement: kind === "award" || kind === "competition",
    showEventName: kind === "competition",
    showCredentialId: kind === "certification",
    showExpiresAt: kind === "certification",
    showIsCurrent:
      kind === "education" ||
      kind === "research_experience" ||
      kind === "industry_experience" ||
      kind === "teaching_mentoring" ||
      kind === "affiliation",
    proofUrlHint: p09
      ? "Link to issuer page, certificate verification, or official announcement."
      : null,
  };
}

/** Clear fields that do not apply after a kind change. */
export function clearIncompatibleTimelineFields(
  draft: Record<string, unknown>,
  kind: TimelineEntryKind,
): Record<string, unknown> {
  const flags = fieldFlagsForKind(kind);
  const next = { ...draft, kind };
  if (!flags.showProofUrl) next.proofUrl = null;
  if (!flags.showRankOrPlacement) next.rankOrPlacement = null;
  if (!flags.showEventName) next.eventName = null;
  if (!flags.showCredentialId) next.credentialId = null;
  if (!flags.showExpiresAt) next.expiresAt = null;
  if (!flags.showIsCurrent) next.isCurrent = null;
  return next;
}

import type { TimelineImageRole } from "~/lib/api/types/timeline.types";

export const MAX_TIMELINE_ENTRY_MEDIA = 10;

const ROLE_LABELS: Record<TimelineImageRole, string> = {
  certificate: "Certificate",
  photo: "Photo",
  badge: "Badge",
  logo: "Logo",
};

export const TIMELINE_IMAGE_ROLES: readonly TimelineImageRole[] = [
  "certificate",
  "photo",
  "badge",
  "logo",
];

export function timelineImageRoleLabel(role: TimelineImageRole): string {
  return ROLE_LABELS[role];
}

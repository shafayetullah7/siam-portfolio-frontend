import type { HomeAffiliation } from "~/content";

export function formatAffiliationLine(affiliation: HomeAffiliation): string {
  const parts = [affiliation.role.trim(), affiliation.organization.trim()];
  const location = affiliation.location?.trim();
  if (location) {
    parts.push(location);
  }
  return parts.filter(Boolean).join(" · ");
}

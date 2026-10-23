import type {
  TimelinePublicCard,
  TimelinePublicSection,
} from "~/lib/api/types/timeline.types";

export const MAX_FEATURED_ACHIEVEMENTS_DISPLAY = 3;

export function flattenSections(
  sections: TimelinePublicSection[],
): TimelinePublicCard[] {
  return sections.flatMap((section) => section.items);
}

export function countAchievementItems(sections: TimelinePublicSection[]): number {
  return flattenSections(sections).length;
}

export function sectionsWithoutFeaturedIds(
  sections: TimelinePublicSection[],
  featuredIds: Set<string>,
): TimelinePublicSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !featuredIds.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);
}

export function isCertificationExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt?.trim()) return false;
  const normalized = expiresAt.length === 7 ? `${expiresAt}-01` : expiresAt;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

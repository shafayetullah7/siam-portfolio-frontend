import type { HomeResearchFocusItem } from "~/content/home.types";
import type { ResearchThemeCardPublic } from "~/lib/api/types/research.types";

/** Maps public API card DTO to home grid item (R9 listing). */
export function researchCardPublicToHomeItem(
  card: ResearchThemeCardPublic,
): HomeResearchFocusItem {
  return {
    title: card.title,
    description: card.summary,
    href: card.href,
    tags: card.tags ?? undefined,
    coverUrl: card.coverUrl ?? null,
    coverAlt: card.coverAlt ?? null,
    ...(card.relatedCounts && card.relatedCounts.publications > 0
      ? { relatedPublicationCount: card.relatedCounts.publications }
      : {}),
    ...(card.relatedCounts && card.relatedCounts.projects > 0
      ? { relatedProjectCount: card.relatedCounts.projects }
      : {}),
  };
}

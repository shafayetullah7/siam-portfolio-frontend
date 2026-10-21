import type { ResearchThemeCardPublic } from "~/lib/api/types/research.types";

export const STATUS_FILTER_MIN_THEMES = 4;
export const TAG_FILTER_MIN_THEMES = 6;
export const TAG_FILTER_MIN_UNIQUE = 2;

export type ThemeStatusFilter = "all" | "ongoing" | "completed";

export function hasBothThemeStatuses(
  cards: readonly ResearchThemeCardPublic[],
): boolean {
  const ongoing = cards.some((c) => c.themeStatus === "ongoing");
  const completed = cards.some((c) => c.themeStatus === "completed");
  return ongoing && completed;
}

export function shouldShowStatusFilters(
  cards: readonly ResearchThemeCardPublic[],
): boolean {
  return cards.length >= STATUS_FILTER_MIN_THEMES && hasBothThemeStatuses(cards);
}

export function collectDistinctTags(
  cards: readonly ResearchThemeCardPublic[],
): string[] {
  const set = new Set<string>();
  for (const card of cards) {
    for (const tag of card.tags ?? []) {
      set.add(tag);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function shouldShowTagFilters(
  cards: readonly ResearchThemeCardPublic[],
): boolean {
  return (
    cards.length >= TAG_FILTER_MIN_THEMES &&
    collectDistinctTags(cards).length >= TAG_FILTER_MIN_UNIQUE
  );
}

export function filterByStatus(
  cards: readonly ResearchThemeCardPublic[],
  status: ThemeStatusFilter,
): ResearchThemeCardPublic[] {
  if (status === "all") return [...cards];
  return cards.filter((c) => c.themeStatus === status);
}

export function filterByTag(
  cards: readonly ResearchThemeCardPublic[],
  tag: string | null,
): ResearchThemeCardPublic[] {
  if (!tag) return [...cards];
  return cards.filter((c) => c.tags?.includes(tag));
}

export function applyResearchListFilters(
  cards: readonly ResearchThemeCardPublic[],
  status: ThemeStatusFilter,
  tag: string | null,
): ResearchThemeCardPublic[] {
  return filterByTag(filterByStatus(cards, status), tag);
}

export function groupByThemeStatus(cards: readonly ResearchThemeCardPublic[]) {
  const ongoing = cards.filter((c) => c.themeStatus === "ongoing");
  const completed = cards.filter((c) => c.themeStatus === "completed");
  return { ongoing, completed };
}

export function shouldGroupByStatus(
  cards: readonly ResearchThemeCardPublic[],
): boolean {
  return hasBothThemeStatuses(cards);
}

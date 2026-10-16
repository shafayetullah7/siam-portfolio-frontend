import { validateCatalogFeaturedBounds } from "./catalog";
import type {
  HomeHighlight,
  HomePageContent,
  HomeSectionId,
} from "./home.types";

const METRIC_PATTERN =
  /\b\d[\d,]*\s*(citations?|h-?index|papers?|publications?)\b/i;

export function isNonEmptySection<T>(
  items?: readonly T[],
): items is readonly T[] {
  return Array.isArray(items) && items.length > 0;
}

export function hasValidMetricClaim(highlight: HomeHighlight): boolean {
  if (!METRIC_PATTERN.test(highlight.text)) {
    return true;
  }
  return Boolean(highlight.sourceUrl?.trim() && highlight.asOfDate?.trim());
}

export function validateHomeContentBounds(
  content: HomePageContent,
): string[] {
  const errors: string[] = [];

  const focusLen = content.researchFocus?.length ?? 0;
  if (focusLen > 0 && (focusLen < 3 || focusLen > 6)) {
    errors.push(
      `researchFocus must have 0 or 3–6 items (got ${focusLen})`,
    );
  }

  const pubLen = content.selectedPublications?.length ?? 0;
  if (pubLen > 0 && (pubLen < 2 || pubLen > 4)) {
    errors.push(
      `selectedPublications must have 0 or 2–4 items (got ${pubLen})`,
    );
  }

  const projLen = content.featuredProjects?.length ?? 0;
  if (projLen > 0 && (projLen < 2 || projLen > 3)) {
    errors.push(
      `featuredProjects must have 0 or 2–3 items (got ${projLen})`,
    );
  }

  for (const h of content.highlights ?? []) {
    if (!hasValidMetricClaim(h)) {
      errors.push(
        `highlight "${h.text.slice(0, 40)}${h.text.length > 40 ? "…" : ""}" looks like a metric claim but lacks sourceUrl and asOfDate`,
      );
    }
  }

  errors.push(...validateCatalogFeaturedBounds());

  return errors;
}

export function assertHomeContentBounds(content: HomePageContent): void {
  const errors = validateHomeContentBounds(content);
  if (errors.length > 0) {
    throw new Error(`HomePageContent bounds: ${errors.join("; ")}`);
  }
}

const SECTION_ORDER: HomeSectionId[] = [
  "hero",
  "affiliation",
  "researchFocus",
  "selectedPublications",
  "featuredProjects",
  "highlights",
  "currentlyWorkingOn",
  "profiles",
  "collaborationCta",
];

export function listVisibleSectionIds(content: HomePageContent): HomeSectionId[] {
  const visible: HomeSectionId[] = ["hero"];

  if (content.affiliation?.role && content.affiliation.organization) {
    visible.push("affiliation");
  }
  if (isNonEmptySection(content.researchFocus)) {
    visible.push("researchFocus");
  }
  if (isNonEmptySection(content.selectedPublications)) {
    visible.push("selectedPublications");
  }
  if (isNonEmptySection(content.featuredProjects)) {
    visible.push("featuredProjects");
  }
  if (isNonEmptySection(content.highlights)) {
    visible.push("highlights");
  }
  if (content.currentlyWorkingOn?.text?.trim()) {
    visible.push("currentlyWorkingOn");
  }
  if (isNonEmptySection(content.profiles)) {
    visible.push("profiles");
  }
  if (content.collaborationCta?.headline?.trim()) {
    visible.push("collaborationCta");
  }

  return SECTION_ORDER.filter((id) => visible.includes(id));
}

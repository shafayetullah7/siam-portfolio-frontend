import {
  HOME_SECTION_LABELS,
} from "~/components/landing/homeSectionLabels";
import type { HomeSectionConfig, HomeSectionId } from "~/lib/api/types/home.types";

export const HOME_SECTION_IDS: HomeSectionId[] = [
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

export function defaultHomeSections(): HomeSectionConfig[] {
  return HOME_SECTION_IDS.map((id) => ({ id, visible: true }));
}

/** Merge stored config with known ids; fill missing ids using default order. */
export function coerceEditorSections(
  stored: HomeSectionConfig[] | null | undefined,
): HomeSectionConfig[] {
  if (!stored?.length) {
    return defaultHomeSections();
  }

  const byId = new Map(stored.map((s) => [s.id, s.visible]));
  const ordered: HomeSectionConfig[] = [];

  for (const row of stored) {
    if ((HOME_SECTION_IDS as readonly string[]).includes(row.id)) {
      ordered.push({
        id: row.id,
        visible: row.id === "hero" ? true : row.visible,
      });
    }
  }

  for (const id of HOME_SECTION_IDS) {
    if (!ordered.some((s) => s.id === id)) {
      ordered.push({
        id,
        visible: byId.get(id) ?? true,
      });
    }
  }

  const hero = ordered.find((s) => s.id === "hero");
  if (hero) {
    hero.visible = true;
  }

  return ordered;
}

export function sectionAdminLabel(id: HomeSectionId): string {
  if (id === "hero") return "Hero";
  return HOME_SECTION_LABELS[id]?.title ?? id;
}

const MODULE_EDITOR_HREF: Partial<Record<HomeSectionId, string>> = {
  researchFocus: "/admin/research",
  selectedPublications: "/admin/publications",
  featuredProjects: "/admin/projects",
  highlights: "/admin/achievements",
  currentlyWorkingOn: "/admin/achievements",
};

export function moduleEditorHref(id: HomeSectionId): string | undefined {
  return MODULE_EDITOR_HREF[id];
}

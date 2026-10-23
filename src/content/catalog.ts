import type {
  HomeProjectHighlight,
  HomePublicationHighlight,
  HomeResearchFocusItem,
} from "./home.types";
import type { ProjectRecord, PublicationRecord, ResearchTheme } from "./catalog.types";
import { projectsCatalog } from "./projects.catalog";
import { publicationsCatalog } from "./publications.catalog";
import { researchThemesCatalog } from "./research.catalog";

export function listResearchThemes(): readonly ResearchTheme[] {
  return researchThemesCatalog;
}

export function getResearchTheme(slug: string): ResearchTheme | undefined {
  return researchThemesCatalog.find((t) => t.slug === slug);
}

export function listPublications(): readonly PublicationRecord[] {
  return publicationsCatalog;
}

export function getPublication(slug: string): PublicationRecord | undefined {
  return publicationsCatalog.find((p) => p.slug === slug);
}

export function listProjects(): readonly ProjectRecord[] {
  return projectsCatalog;
}

export function getProject(slug: string): ProjectRecord | undefined {
  return projectsCatalog.find((p) => p.slug === slug);
}

export function researchThemeToHomeItem(theme: ResearchTheme): HomeResearchFocusItem {
  return {
    title: theme.title,
    description: theme.description,
    href: `/research/${theme.slug}`,
    tags: theme.tags,
    linkLabel: theme.linkLabel,
  };
}

export function publicationToHomeItem(pub: PublicationRecord): HomePublicationHighlight {
  return {
    title: pub.title,
    authorsShort: pub.authorsShort,
    year: pub.year,
    venue: pub.venue,
    significance: pub.significance,
    href: `/publications/${pub.slug}`,
  };
}

export function projectToHomeItem(project: ProjectRecord): HomeProjectHighlight {
  return {
    title: project.title,
    summary: project.summary,
    href: `/projects/${project.slug}`,
    tags: project.tags,
  };
}

export function listFeaturedResearchForHome(): HomeResearchFocusItem[] {
  return researchThemesCatalog
    .filter((t) => t.featuredOnHome)
    .map(researchThemeToHomeItem);
}

export function listFeaturedPublicationsForHome(): HomePublicationHighlight[] {
  return publicationsCatalog
    .filter((p) => p.featuredOnHome)
    .map(publicationToHomeItem);
}

export function listFeaturedProjectsForHome(): HomeProjectHighlight[] {
  return projectsCatalog.filter((p) => p.featuredOnHome).map(projectToHomeItem);
}

/** Static hub paths for sitemap.xml fallback; detail URLs come from API (see sitemap.xml.ts). */
export function listCatalogSitemapPaths(): string[] {
  return ["/research", "/publications", "/projects"];
}

export function validateCatalogFeaturedBounds(): string[] {
  const errors: string[] = [];
  const focus = listFeaturedResearchForHome().length;
  if (focus > 0 && (focus < 3 || focus > 6)) {
    errors.push(`featured research themes for home must be 0 or 3–6 (got ${focus})`);
  }
  const pubs = listFeaturedPublicationsForHome().length;
  if (pubs > 0 && (pubs < 2 || pubs > 4)) {
    errors.push(`featured publications for home must be 0 or 2–4 (got ${pubs})`);
  }
  const proj = listFeaturedProjectsForHome().length;
  if (proj > 0 && (proj < 2 || proj > 3)) {
    errors.push(`featured projects for home must be 0 or 2–3 (got ${proj})`);
  }
  return errors;
}

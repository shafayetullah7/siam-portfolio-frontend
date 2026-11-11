import type { HomePageContent, HomeProjectHighlight } from "~/content/home.types";
import type {
  PublicHomePayload,
  PublicHomeProjectHighlight,
} from "../endpoints/public/site.api";

export type MapPublicHomeOptions = {
  treatAsPublished?: boolean;
};

function mapProjectHighlight(
  item: PublicHomeProjectHighlight,
): HomeProjectHighlight {
  const alt = item.coverAlt?.trim() ?? "";
  return {
    title: item.title,
    summary: item.summary,
    href: item.href,
    ...(item.tags?.length ? { tags: item.tags } : {}),
    ...(item.coverUrl && alt ? { image: { src: item.coverUrl, alt } } : {}),
  };
}

const DEFAULT_PRIMARY_CTA = {
  label: "Explore research",
  href: "/research",
} as const;

const DEFAULT_SECONDARY_CTA = {
  label: "Get in touch",
  href: "/contact",
} as const;

export function mapPublicHomeToContent(
  api: PublicHomePayload | undefined,
  fallback: HomePageContent,
  options?: MapPublicHomeOptions,
): HomePageContent {
  const useApi = Boolean(api && (api.published || options?.treatAsPublished));
  if (!useApi || !api) {
    return fallback;
  }

  const heroSource = api.hero;
  const heroName =
    heroSource?.name?.trim() || api.heroTitle?.trim() || "";
  const descriptor = heroSource?.descriptor?.trim() || "";
  const positioning =
    heroSource?.positioning?.trim() || api.heroSubtitle?.trim() || "";

  const portraitUrl = heroSource?.portrait?.url?.trim() ?? "";
  const portraitAlt = heroSource?.portrait?.alt?.trim() ?? "";
  const portrait =
    portraitUrl && portraitAlt
      ? { src: portraitUrl, alt: portraitAlt }
      : null;

  const content: HomePageContent = {
    cmsSectionIds: api.visibleSectionIds,
    hero: {
      name: heroName,
      descriptor,
      positioning,
      portrait,
      primaryCta: heroSource?.primaryCta ?? DEFAULT_PRIMARY_CTA,
      secondaryCta: heroSource?.secondaryCta ?? DEFAULT_SECONDARY_CTA,
      ...(heroSource?.statusBadge
        ? { statusBadge: heroSource.statusBadge }
        : {}),
    },
  };

  if (api.affiliation) {
    content.affiliation = {
      role: api.affiliation.role,
      organization: api.affiliation.organization,
      ...(api.affiliation.location ? { location: api.affiliation.location } : {}),
    };
  }
  if (api.researchFocus.length) {
    content.researchFocus = api.researchFocus;
  }
  if (api.selectedPublications?.length) {
    content.selectedPublications = api.selectedPublications;
  }
  if (api.selectedProjects?.length) {
    content.featuredProjects = api.selectedProjects.map(mapProjectHighlight);
  }
  if (api.highlights?.length) {
    content.highlights = api.highlights;
  }
  if (api.currentlyWorkingOn) {
    content.currentlyWorkingOn = api.currentlyWorkingOn;
  }
  if (api.profiles?.length) {
    content.profiles = api.profiles;
  }
  if (api.collaborationCta) {
    content.collaborationCta = api.collaborationCta;
  }
  if (api.seo?.title || api.seo?.description) {
    content.seo = {
      ...(api.seo.title ? { title: api.seo.title } : {}),
      ...(api.seo.description ? { description: api.seo.description } : {}),
    };
  }

  return content;
}

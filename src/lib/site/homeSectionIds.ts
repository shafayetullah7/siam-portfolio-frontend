/** DOM ids for home hash links and section anchors — shared by nav, landing, and routes. */
export const HOME_SECTION_DOM_IDS = {
  affiliation: "affiliation",
  researchFocus: "research-focus",
  selectedPublications: "selected-publications",
  featuredProjects: "featured-projects",
  highlights: "highlights",
  currentlyWorkingOn: "currently-working-on",
  profiles: "profiles",
  collaborationCta: "collaboration",
} as const;

/** About page contact block (nav CTA target). */
export const ABOUT_CONTACT_SECTION_ID = "contact";

/** Clears fixed public header when scrolling to hash targets. */
export const SCROLL_MT_BELOW_PUBLIC_HEADER =
  "scroll-mt-[var(--siam-public-header-height)]";

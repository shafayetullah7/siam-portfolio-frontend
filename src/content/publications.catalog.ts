import type { PublicationRecord } from "./catalog.types";

/** PLACEHOLDER — replace from publications.bib / CMS */
export const publicationsCatalog: readonly PublicationRecord[] = [
  {
    slug: "example-publication-neurips-2025",
    title: "Example publication title (placeholder)",
    authorsShort: "[Author A], [Author B], …",
    year: 2025,
    venue: "NeurIPS",
    significance:
      "One sentence on why this work matters—replace with verified copy from the content packet.",
    href: "/publications/example-publication-neurips-2025",
    abstract:
      "Extended abstract placeholder for the publication detail stub. Replace with approved abstract or omit.",
    featuredOnHome: true,
  },
  {
    slug: "second-example-icml-2024",
    title: "Second example publication (placeholder)",
    authorsShort: "[Author A] et al.",
    year: 2024,
    venue: "ICML",
    significance: "Significance line for layout testing only.",
    href: "/publications/second-example-icml-2024",
    featuredOnHome: true,
  },
  {
    slug: "workshop-paper-facct-2024",
    title: "Workshop paper (not on home)",
    authorsShort: "[Author A], [Collaborator B]",
    year: 2024,
    venue: "FAccT Workshop",
    significance: "Additional catalog entry for full publications index.",
    href: "/publications/workshop-paper-facct-2024",
    featuredOnHome: false,
  },
];

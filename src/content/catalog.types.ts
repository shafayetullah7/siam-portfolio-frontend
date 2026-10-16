/** Static catalog types — map to future public API aggregates (P03/P05/P07). */

export type ResearchThemeStatus = "ongoing" | "completed";

export type ResearchTheme = {
  slug: string;
  title: string;
  description: string;
  tags?: readonly string[];
  status?: ResearchThemeStatus;
  featuredOnHome?: boolean;
  linkLabel?: string;
  problem?: string;
  approach?: string;
};

export type PublicationRecord = {
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  significance: string;
  href: string;
  abstract?: string;
  featuredOnHome?: boolean;
};

export type ProjectRecord = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags?: readonly string[];
  featuredOnHome?: boolean;
  body?: string;
};

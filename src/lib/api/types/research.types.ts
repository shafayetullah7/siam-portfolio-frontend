export type PublishChecklistItem = {
  code: string;
  message: string;
};

export type ResearchPublishChecklist = {
  errors: PublishChecklistItem[];
  warnings: PublishChecklistItem[];
};

/** Public research hub list (GET /public/research-themes). */
export interface ResearchThemeListPublic {
  intro: string | null;
  items: ResearchThemeCardPublic[];
}

/** Public research theme card. */
export interface ResearchThemeCardPublic {
  slug: string;
  title: string;
  summary: string;
  themeStatus: 'ongoing' | 'completed';
  tags: string[] | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  href: string;
  relatedCounts?: { publications: number; projects: number };
}

export type ResearchPublicationCardPublic = {
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  significance?: string;
  href: string;
};

export type ResearchProjectCardPublic = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  href: string;
};

export type ResearchThemeProjectLink = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[] | null;
  publishStatus: 'draft' | 'scheduled' | 'published' | 'archived';
  sortOrder: number;
};

export type ResearchThemePublicationLink = {
  id: string;
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  publishStatus: 'draft' | 'scheduled' | 'published' | 'archived';
  sortOrder: number;
};

/** Public research theme detail (GET /public/research-themes/:slug). */
export interface ResearchThemeDetailPublic {
  slug: string;
  title: string;
  summary: string;
  themeStatus: 'ongoing' | 'completed';
  tags: string[] | null;
  linkLabel?: string | null;
  problem: string;
  significance?: string | null;
  objectives?: string | null;
  approach?: string | null;
  findings?: string | null;
  limitations?: string | null;
  futureWork?: string | null;
  collaborators?: Array<{
    name: string;
    role?: string | null;
    url?: string | null;
  }> | null;
  acknowledgments?: string | null;
  funding?: string | null;
  resources?: Array<{
    label: string;
    url: string;
    resourceType: 'code' | 'data' | 'demo' | 'paper' | 'other';
  }>;
  cover?: { url: string; alt: string | null };
  related?: {
    publications: ResearchPublicationCardPublic[];
    projects: ResearchProjectCardPublic[];
    talks: { slug: string }[];
  };
  seo: { title: string; description: string };
  updatedAt?: string;
  prevSlug?: string;
  nextSlug?: string;
}

/** Admin create/update body (matches R2 Zod DTO). */
export type ResearchThemeWriteBody = {
  slug: string;
  title: string;
  summary: string;
  themeStatus?: 'ongoing' | 'completed';
  problem?: string;
  significance?: string | null;
  objectives?: string | null;
  approach?: string | null;
  findings?: string | null;
  limitations?: string | null;
  futureWork?: string | null;
  tags?: string[] | null;
  linkLabel?: string | null;
  coverMediaId?: string | null;
  sortOrder?: number;
  featuredOnHome?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  collaborators?: Array<{
    name: string;
    role?: string | null;
    url?: string | null;
  }> | null;
  acknowledgments?: string | null;
  funding?: string | null;
  resources?: Array<{
    label: string;
    url: string;
    resourceType: 'code' | 'data' | 'demo' | 'paper' | 'other';
    sortOrder?: number;
  }> | null;
};

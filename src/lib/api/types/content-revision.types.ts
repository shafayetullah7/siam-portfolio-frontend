export interface ContentRevision<T = Record<string, unknown>> {
  id: string;
  entityType: string;
  entityId: string;
  snapshot: T;
  createdAt: string;
}

/**
 * Per-save change payload from GET /admin/research/:id/revisions.
 * Only fields that changed in that save (values are after the save).
 */
export type ResearchThemeRevisionSnapshot = {
  slug?: string;
  title?: string;
  summary?: string;
  themeStatus?: "ongoing" | "completed";
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
    resourceType: string;
    sortOrder?: number;
  }>;
  publicationIds?: string[];
  projectIds?: string[];
  publishStatus?: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  archivedAt?: string | null;
};

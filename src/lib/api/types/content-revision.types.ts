export interface ContentRevision<T = Record<string, unknown>> {
  id: string;
  entityType: string;
  entityId: string;
  snapshot: T;
  createdAt: string;
}

export type ResearchThemeRevisionSnapshot = {
  title?: string;
  publishStatus?: string;
  slug?: string;
  publicationIds?: string[];
  projectIds?: string[];
};

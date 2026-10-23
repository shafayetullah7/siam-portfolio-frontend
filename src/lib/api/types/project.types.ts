import type { Paginated } from "./index";

export type ProjectType =
  | "research_prototype"
  | "production"
  | "open_source"
  | "coursework"
  | "competition"
  | "other";

export type ProjectStatus =
  | "ongoing"
  | "completed"
  | "maintained"
  | "archived";

export type EvaluationMaturity = "verified" | "provisional" | "experimental";

export type ProjectResourceType =
  | "repo"
  | "demo"
  | "paper"
  | "dataset"
  | "model_card"
  | "documentation"
  | "video"
  | "other";

export type ProjectSectionKind =
  | "problem"
  | "context"
  | "responsibilities"
  | "solution"
  | "data_methods"
  | "evaluation"
  | "results"
  | "limitations"
  | "future_work"
  | "custom";

export type ProjectSectionAdmin = {
  sortOrder: number;
  kind: ProjectSectionKind;
  title: string | null;
  body: string;
  mediaIds?: string[];
};

export type ProjectResourceAdmin = {
  sortOrder: number;
  resourceType: ProjectResourceType;
  label: string;
  url: string;
};

export type ProjectMetricAdmin = {
  sortOrder: number;
  name: string;
  value: string;
  unit: string | null;
  baseline: string | null;
  notes: string | null;
  caption: string | null;
};

export type ProjectSectionWrite = {
  kind?: ProjectSectionKind;
  title?: string | null;
  body: string;
};

export type ProjectResourceWrite = {
  resourceType?: ProjectResourceType;
  label: string;
  url: string;
};

export type ProjectMetricWrite = {
  name: string;
  value: string;
  unit?: string | null;
  baseline?: string | null;
  notes?: string | null;
  caption?: string | null;
};

export type ProjectWriteBody = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[] | null;
  projectType?: ProjectType;
  projectStatus?: ProjectStatus;
  evaluationMaturity?: EvaluationMaturity;
  ownerRole?: string | null;
  ownerContribution?: string | null;
  resultTeaser?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  coverMediaId?: string | null;
  featured?: boolean;
  featuredOnHome?: boolean;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  hideFromSearch?: boolean;
  sections?: ProjectSectionWrite[];
  resources?: ProjectResourceWrite[];
  metrics?: ProjectMetricWrite[];
};

export type ProjectAdminSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[] | null;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  evaluationMaturity: EvaluationMaturity;
  ownerRole: string | null;
  ownerContribution: string | null;
  resultTeaser: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  coverMediaId: string | null;
  featured: boolean;
  featuredOnHome: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  hideFromSearch: boolean;
  sections: ProjectSectionAdmin[];
  resources: ProjectResourceAdmin[];
  metrics: ProjectMetricAdmin[];
  publishStatus: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  scheduledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPrimaryResource = {
  label: string;
  url: string;
  resourceType: ProjectResourceType;
};

export type ProjectPublicCard = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  href: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  ownerContribution?: string;
  resultTeaser?: string;
  featured?: boolean;
  primaryResource?: ProjectPrimaryResource;
  coverUrl?: string | null;
  coverAlt?: string | null;
};

export type ProjectPublicList = Paginated<ProjectPublicCard> & {
  intro: string | null;
};

export type ProjectPublicSectionFigure = {
  url: string;
  alt: string | null;
  caption?: string | null;
};

export type ProjectPublicSection = {
  kind: ProjectSectionKind;
  title?: string;
  body: string;
  sortOrder: number;
  figures?: ProjectPublicSectionFigure[];
};

export type ProjectRelatedThemeCard = {
  slug: string;
  title: string;
  summary: string;
  href: string;
};

export type ProjectRelatedPublicationCard = {
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  href: string;
  significance?: string;
};

export type ProjectPublicResource = {
  resourceType: ProjectResourceType;
  label: string;
  url: string;
  sortOrder: number;
};

export type ProjectPublicMetric = {
  name: string;
  value: string;
  unit?: string;
  baseline?: string;
  notes?: string;
  caption?: string;
  sortOrder: number;
};

export type ProjectPublishChecklist = {
  errors: { code: string; message: string }[];
  warnings: { code: string; message: string }[];
};

export type ProjectPublicDetail = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags?: string[];
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  evaluationMaturity: EvaluationMaturity;
  ownerRole?: string;
  ownerContribution?: string;
  resultTeaser?: string;
  periodStart?: string;
  periodEnd?: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  cover?: { url: string; alt: string | null };
  prevSlug?: string;
  nextSlug?: string;
  sections: ProjectPublicSection[];
  resources: ProjectPublicResource[];
  metrics: ProjectPublicMetric[];
  related?: {
    themes: ProjectRelatedThemeCard[];
    publications: ProjectRelatedPublicationCard[];
  };
};

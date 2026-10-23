import type { Paginated } from "./index";
import type { PublishChecklistItem } from "./research.types";

export type PublicationPublishChecklist = {
  errors: PublishChecklistItem[];
  warnings: PublishChecklistItem[];
};

export type PublicationAuthor = {
  sortOrder: number;
  name: string;
  affiliation?: string;
  orcid?: string;
};

export type PublicationAuthorPublic = {
  name: string;
  affiliation?: string;
  orcid?: string;
};

export type PublicationType =
  | "journal"
  | "conference"
  | "preprint"
  | "workshop"
  | "thesis"
  | "other";

export type PublicationAuthorWrite = {
  name: string;
  affiliation?: string | null;
  orcid?: string | null;
};

export type PublicationSupplementKind =
  | "code"
  | "data"
  | "slides"
  | "poster"
  | "demo"
  | "repository"
  | "other";

export type PublicationSupplementWrite = {
  label: string;
  url: string;
  kind?: PublicationSupplementKind;
};

export type PublicationSupplement = PublicationSupplementWrite & {
  sortOrder: number;
  kind: PublicationSupplementKind;
};

export type PublicationSupplementPublic = {
  label: string;
  url: string;
  kind: PublicationSupplementKind;
};

export type PublicationPdfMediaSummary = {
  id: string;
  fileName: string;
  url: string;
};

export type PublicationAvailabilityLabel =
  | "open_access"
  | "publisher_link"
  | "no_pdf";

export type PublicationWriteBody = {
  slug: string;
  title: string;
  authors: PublicationAuthorWrite[];
  year: number;
  venue: string;
  significance?: string | null;
  abstract?: string | null;
  publicationType?: PublicationType;
  peerReviewed?: boolean;
  doi?: string | null;
  publisherUrl?: string | null;
  featured?: boolean;
  featuredOnHome?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ownerContribution?: string | null;
  correctionNotice?: string | null;
  hideFromSearch?: boolean;
  supplements?: PublicationSupplementWrite[];
  pdfMediaId?: string | null;
  openAccess?: boolean;
  pdfRightsGranted?: boolean;
};

export type PublicationPublicCard = {
  slug: string;
  title: string;
  authorsShort: string;
  year: number;
  venue: string;
  publicationType: PublicationType;
  featured: boolean;
  significance?: string;
  doi?: string;
  href: string;
  availability: PublicationAvailabilityLabel;
};

export type PublicationListPublic = Paginated<PublicationPublicCard>;

export type PublicationCitation = {
  citeKey: string;
  bibtex: string;
  formatted: string;
};

export type PublicationImportSource = "bibtex" | "doi";

export type PublicationImportProposed = {
  slug: string;
  title: string;
  authors: PublicationAuthorWrite[];
  year: number;
  venue: string;
  significance?: string | null;
  abstract?: string | null;
  publicationType: PublicationType;
  peerReviewed?: boolean;
  doi?: string | null;
  publisherUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type PublicationImportDuplicate = {
  id: string;
  slug: string;
  title: string;
  year: number;
  doi: string | null;
  matchReason: "doi" | "title_year";
};

export type PublicationImportPreview = {
  source: PublicationImportSource;
  proposed: PublicationImportProposed;
  duplicates: PublicationImportDuplicate[];
  parseWarnings: string[];
  lowConfidenceFields: string[];
};

export type PublicationImportMergeField =
  | "title"
  | "authors"
  | "year"
  | "venue"
  | "abstract"
  | "significance"
  | "publicationType"
  | "peerReviewed"
  | "doi"
  | "publisherUrl"
  | "seoTitle"
  | "seoDescription";

export type PublicationImportPreviewBody = {
  source: PublicationImportSource;
  bibtex?: string;
  doi?: string;
};

export type PublicationImportConfirmBody = PublicationImportPreviewBody & {
  action: "create" | "merge";
  mergePublicationId?: string;
  mergeFields?: PublicationImportMergeField[];
  overrides?: Partial<PublicationImportProposed>;
};

export type PublicationPublicDetail = PublicationPublicCard & {
  abstract?: string;
  peerReviewed: boolean;
  doi?: string;
  publisherUrl?: string;
  ownerContribution?: string;
  correctionNotice?: string;
  seoTitle?: string;
  seoDescription?: string;
  authors?: PublicationAuthorPublic[];
  supplements?: PublicationSupplementPublic[];
  pdfHref?: string;
};

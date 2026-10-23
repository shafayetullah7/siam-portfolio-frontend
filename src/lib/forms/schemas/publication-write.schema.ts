import { z } from "zod";
import type { PublicationType } from "~/lib/api/types/publication.types";

export const PUBLICATION_TYPES: PublicationType[] = [
  "journal",
  "conference",
  "preprint",
  "workshop",
  "thesis",
  "other",
];

const longText = z.string().max(100_000).optional().nullable();

export const SUPPLEMENT_KINDS = [
  "code",
  "data",
  "slides",
  "poster",
  "demo",
  "repository",
  "other",
] as const;

export const publicationSupplementDraftSchema = z.object({
  label: z.string().max(200),
  url: z.string().max(2000),
  kind: z.enum(SUPPLEMENT_KINDS).optional(),
});

export const publicationAuthorDraftSchema = z.object({
  name: z.string().max(200),
  affiliation: z.string().max(500).optional().nullable(),
  orcid: z.string().max(50).optional().nullable(),
});

export const publicationWriteSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens",
    ),
  title: z.string().min(1, "Title is required").max(500),
  authors: z
    .array(publicationAuthorDraftSchema)
    .min(1, "Add at least one author")
    .superRefine((authors, ctx) => {
      const hasName = authors.some((a) => a.name.trim().length > 0);
      if (!hasName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one author name is required",
          path: ["0", "name"],
        });
      }
    }),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier"),
  venue: z.string().min(1, "Venue is required").max(300),
  significance: longText,
  abstract: longText,
  publicationType: z.enum([
    "journal",
    "conference",
    "preprint",
    "workshop",
    "thesis",
    "other",
  ]),
  peerReviewed: z.boolean(),
  doi: z.string().max(200).optional().nullable(),
  publisherUrl: z.string().max(2000).optional().nullable(),
  featured: z.boolean(),
  featuredOnHome: z.boolean(),
  seoTitle: z.string().max(500).optional().nullable(),
  seoDescription: longText,
  ownerContribution: longText,
  correctionNotice: longText,
  hideFromSearch: z.boolean(),
  supplements: z.array(publicationSupplementDraftSchema).max(20),
  pdfMediaId: z.string().uuid().nullable().optional(),
  openAccess: z.boolean(),
  pdfRightsGranted: z.boolean(),
});

export type PublicationWriteInput = z.infer<typeof publicationWriteSchema>;

export function emptyPublicationDraft(): PublicationWriteInput {
  return {
    slug: "",
    title: "",
    authors: [{ name: "", affiliation: null, orcid: null }],
    year: new Date().getFullYear(),
    venue: "",
    significance: null,
    abstract: null,
    publicationType: "other",
    peerReviewed: false,
    doi: null,
    publisherUrl: null,
    featured: false,
    featuredOnHome: false,
    seoTitle: null,
    seoDescription: null,
    ownerContribution: null,
    correctionNotice: null,
    hideFromSearch: false,
    supplements: [],
    pdfMediaId: null,
    openAccess: false,
    pdfRightsGranted: false,
  };
}

export function publicationDraftFromAdmin(
  row: import("~/lib/api/endpoints/admin/publications.api").PublicationAdminSummary,
): PublicationWriteInput {
  return {
    slug: row.slug,
    title: row.title,
    authors:
      row.authors.length > 0
        ? row.authors.map((a) => ({
            name: a.name,
            affiliation: a.affiliation ?? null,
            orcid: a.orcid ?? null,
          }))
        : [{ name: row.authorsShort, affiliation: null, orcid: null }],
    year: row.year,
    venue: row.venue,
    significance: row.significance,
    abstract: row.abstract,
    publicationType: row.publicationType,
    peerReviewed: row.peerReviewed,
    doi: row.doi,
    publisherUrl: row.publisherUrl,
    featured: row.featured,
    featuredOnHome: row.featuredOnHome,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ownerContribution: row.ownerContribution,
    correctionNotice: row.correctionNotice,
    hideFromSearch: row.hideFromSearch,
    supplements: row.supplements.map((s) => ({
      label: s.label,
      url: s.url,
      kind: s.kind,
    })),
    pdfMediaId: row.pdfMediaId,
    openAccess: row.openAccess,
    pdfRightsGranted: row.pdfRightsGranted,
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function publicationDraftToWriteBody(
  draft: PublicationWriteInput,
): import("~/lib/api/types/publication.types").PublicationWriteBody {
  const authors = draft.authors
    .map((a) => ({
      name: a.name.trim(),
      affiliation: emptyToNull(a.affiliation),
      orcid: emptyToNull(a.orcid),
    }))
    .filter((a) => a.name.length > 0);

  return {
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    authors,
    year: draft.year,
    venue: draft.venue.trim(),
    significance: emptyToNull(draft.significance),
    abstract: emptyToNull(draft.abstract),
    publicationType: draft.publicationType,
    peerReviewed: draft.peerReviewed,
    doi: emptyToNull(draft.doi),
    publisherUrl: emptyToNull(draft.publisherUrl),
    featured: draft.featured,
    featuredOnHome: draft.featuredOnHome,
    seoTitle: emptyToNull(draft.seoTitle),
    seoDescription: emptyToNull(draft.seoDescription),
    ownerContribution: emptyToNull(draft.ownerContribution),
    correctionNotice: emptyToNull(draft.correctionNotice),
    hideFromSearch: draft.hideFromSearch,
    supplements: draft.supplements
      .map((s) => ({
        label: s.label.trim(),
        url: s.url.trim(),
        kind: s.kind ?? "other",
      }))
      .filter((s) => s.label.length > 0 && s.url.length > 0),
    pdfMediaId: draft.pdfMediaId,
    openAccess: draft.openAccess,
    pdfRightsGranted: draft.pdfRightsGranted,
  };
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
    if (issue.path[0] === "authors") {
      out.authors = issue.message;
    }
  }
  return out;
}

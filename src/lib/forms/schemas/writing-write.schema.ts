import { z } from "zod";
import type { WritingWriteBody } from "~/lib/api/types/writing.types";

const longText = z.string().max(100_000).optional().nullable();

export const writingWriteSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens",
    ),
  title: z.string().min(1, "Title is required").max(500),
  summary: z.string().min(1, "Summary is required").max(100_000),
  subtitle: longText,
  body: z.string().max(500_000).optional(),
  tags: z.array(z.string().max(100)).max(30).optional().nullable(),
  seriesId: z.string().uuid().nullable().optional(),
  seriesSortOrder: z.coerce.number().int().min(0).max(10_000).optional().nullable(),
  coverMediaId: z.string().uuid().nullable().optional(),
  byline: longText,
  featuredOnHub: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
  seoTitle: z.string().max(500).optional().nullable(),
  seoDescription: longText,
  hideFromSearch: z.boolean().optional(),
});

export type WritingWriteInput = z.infer<typeof writingWriteSchema>;

export function writingDraftFromAdmin(
  row: import("~/lib/api/types/writing.types").WritingAdminDetail,
): WritingWriteInput {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    subtitle: row.subtitle,
    body: row.body,
    tags: row.tags ?? [],
    seriesId: row.seriesId,
    seriesSortOrder: row.seriesSortOrder,
    coverMediaId: row.coverMediaId,
    byline: row.byline,
    featuredOnHub: row.featuredOnHub,
    featured: row.featured,
    sortOrder: row.sortOrder,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    hideFromSearch: row.hideFromSearch,
  };
}

export function emptyWritingDraft(): WritingWriteInput {
  return {
    slug: "",
    title: "",
    summary: "",
    subtitle: null,
    body: "",
    tags: [],
    seriesId: null,
    seriesSortOrder: null,
    coverMediaId: null,
    byline: null,
    featuredOnHub: false,
    featured: false,
    sortOrder: 0,
    seoTitle: null,
    seoDescription: null,
    hideFromSearch: false,
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function writingDraftToWriteBody(draft: WritingWriteInput): WritingWriteBody {
  const tags = draft.tags
    ?.map((t) => t.trim())
    .filter((t) => t.length > 0);

  return {
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    subtitle: emptyToNull(draft.subtitle),
    body: draft.body ?? "",
    tags: tags && tags.length > 0 ? tags : null,
    seriesId: draft.seriesId ?? null,
    seriesSortOrder: draft.seriesSortOrder ?? null,
    coverMediaId: draft.coverMediaId ?? null,
    byline: emptyToNull(draft.byline),
    featuredOnHub: draft.featuredOnHub ?? false,
    featured: draft.featured ?? false,
    sortOrder: draft.sortOrder ?? 0,
    seoTitle: emptyToNull(draft.seoTitle),
    seoDescription: emptyToNull(draft.seoDescription),
    hideFromSearch: draft.hideFromSearch ?? false,
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
  }
  return out;
}

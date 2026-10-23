import { z } from "zod";
import type {
  TimelineAdminDetail,
  TimelineEntryKind,
  TimelineWriteBody,
} from "~/lib/api/types/timeline.types";

const timelineKinds = [
  "award",
  "competition",
  "scholarship_fellowship_grant",
  "certification",
  "recognition_service",
  "education",
  "research_experience",
  "industry_experience",
  "teaching_mentoring",
  "affiliation",
] as const;

const longText = z.string().max(100_000).optional().nullable();
const dateString = z.string().max(20).optional().nullable();

const optionalSlug = z
  .union([
    z.literal(""),
    z
      .string()
      .min(1)
      .max(200)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens",
      ),
  ])
  .optional()
  .nullable();

export const timelineEntryWriteSchema = z
  .object({
    kind: z.enum(timelineKinds),
    title: z.string().min(1, "Title is required").max(500),
    slug: optionalSlug,
    subtitle: longText,
    summary: longText,
    organization: z.string().max(500).optional().nullable(),
    location: z.string().max(300).optional().nullable(),
    startDate: dateString,
    endDate: dateString,
    isOngoing: z.boolean().optional(),
    isCurrent: z.boolean().nullable().optional(),
    proofUrl: z.string().max(2000).optional().nullable(),
    rankOrPlacement: z.string().max(200).optional().nullable(),
    eventName: z.string().max(500).optional().nullable(),
    credentialId: z.string().max(200).optional().nullable(),
    expiresAt: dateString,
    featured: z.boolean().optional(),
    sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
    publicationId: z.string().uuid().nullable().optional(),
    projectId: z.string().uuid().nullable().optional(),
    seoTitle: z.string().max(500).optional().nullable(),
    seoDescription: longText,
    hideFromSearch: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const endDate =
      data.endDate && data.endDate.trim() !== "" ? data.endDate : null;
    const startDate =
      data.startDate && data.startDate.trim() !== ""
        ? data.startDate
        : null;

    if (data.isOngoing && endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Clear end date when the entry is ongoing",
        path: ["endDate"],
      });
    }

    if (startDate && endDate && startDate > endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be on or before end date",
        path: ["endDate"],
      });
    }
  });

export type TimelineEntryWriteInput = z.infer<typeof timelineEntryWriteSchema>;

export function emptyTimelineDraft(): TimelineEntryWriteInput {
  return {
    kind: "award",
    title: "",
    slug: null,
    subtitle: null,
    summary: null,
    organization: null,
    location: null,
    startDate: null,
    endDate: null,
    isOngoing: false,
    isCurrent: null,
    proofUrl: null,
    rankOrPlacement: null,
    eventName: null,
    credentialId: null,
    expiresAt: null,
    featured: false,
    sortOrder: 0,
    publicationId: null,
    projectId: null,
    seoTitle: null,
    seoDescription: null,
    hideFromSearch: false,
    metadata: null,
  };
}

export function timelineDraftFromAdmin(
  row: TimelineAdminDetail,
): TimelineEntryWriteInput {
  return {
    kind: row.kind,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    summary: row.summary,
    organization: row.organization,
    location: row.location,
    startDate: row.startDate,
    endDate: row.endDate,
    isOngoing: row.isOngoing,
    isCurrent: row.isCurrent,
    proofUrl: row.proofUrl,
    rankOrPlacement: row.rankOrPlacement,
    eventName: row.eventName,
    credentialId: row.credentialId,
    expiresAt: row.expiresAt,
    featured: row.featured,
    sortOrder: row.sortOrder,
    publicationId: row.publicationId,
    projectId: row.projectId,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    hideFromSearch: row.hideFromSearch,
    metadata: row.metadata ?? null,
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function timelineDraftToWriteBody(
  draft: TimelineEntryWriteInput,
): TimelineWriteBody {
  const slug =
    draft.slug == null || draft.slug === ""
      ? null
      : String(draft.slug).trim();

  return {
    kind: draft.kind as TimelineEntryKind,
    title: draft.title.trim(),
    slug,
    subtitle: emptyToNull(draft.subtitle),
    summary: emptyToNull(draft.summary),
    organization: emptyToNull(draft.organization),
    location: emptyToNull(draft.location),
    startDate: emptyToNull(draft.startDate),
    endDate: emptyToNull(draft.endDate),
    isOngoing: draft.isOngoing ?? false,
    isCurrent: draft.isCurrent ?? null,
    proofUrl: emptyToNull(draft.proofUrl),
    rankOrPlacement: emptyToNull(draft.rankOrPlacement),
    eventName: emptyToNull(draft.eventName),
    credentialId: emptyToNull(draft.credentialId),
    expiresAt: emptyToNull(draft.expiresAt),
    featured: draft.featured ?? false,
    sortOrder: draft.sortOrder ?? 0,
    publicationId: draft.publicationId ?? null,
    projectId: draft.projectId ?? null,
    seoTitle: emptyToNull(draft.seoTitle),
    seoDescription: emptyToNull(draft.seoDescription),
    hideFromSearch: draft.hideFromSearch ?? false,
    metadata: draft.metadata ?? null,
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

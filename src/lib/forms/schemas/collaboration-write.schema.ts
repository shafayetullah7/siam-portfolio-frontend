import { z } from "zod";
import type { CollaborationAdmin } from "~/lib/api/types/talks.types";

export const collaborationWriteSchema = z.object({
  partnerName: z.string().min(1, "Partner name is required").max(500),
  summary: z.string().min(1, "Summary is required").max(10_000),
  institution: z.string().max(500).nullable().optional(),
  logoMediaId: z.string().uuid().nullable().optional(),
  role: z.string().max(500).nullable().optional(),
  period: z.string().max(200).nullable().optional(),
  outcomes: z.string().max(10_000).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
});

export type CollaborationWriteInput = z.infer<typeof collaborationWriteSchema>;

export function emptyCollaborationDraft(): CollaborationWriteInput {
  return {
    partnerName: "",
    summary: "",
    institution: null,
    logoMediaId: null,
    role: null,
    period: null,
    outcomes: null,
    sortOrder: 0,
  };
}

export function collaborationDraftFromAdmin(
  row: CollaborationAdmin,
): CollaborationWriteInput {
  return {
    partnerName: row.partnerName,
    summary: row.summary,
    institution: row.institution,
    logoMediaId: row.logoMediaId,
    role: row.role,
    period: row.period,
    outcomes: row.outcomes,
    sortOrder: row.sortOrder,
  };
}

export function collaborationFieldErrorsFromZod(
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

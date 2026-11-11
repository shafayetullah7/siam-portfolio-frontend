import { z } from "zod";
import type { AcademicServiceAdmin } from "~/lib/api/types/talks.types";
import { ACADEMIC_SERVICE_TYPES } from "~/lib/talks/talkLabels";

const httpsUrl = z
  .string()
  .regex(/^https:\/\/.+/, "URL must start with https://")
  .max(2000)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const academicServiceWriteSchema = z.object({
  organization: z.string().min(1, "Organization is required").max(500),
  roleTitle: z.string().min(1, "Role title is required").max(500),
  serviceType: z.enum(ACADEMIC_SERVICE_TYPES as [string, ...string[]]).optional(),
  startYear: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  endYear: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  proofUrl: httpsUrl,
  summary: z.string().max(10_000).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
});

export type AcademicServiceWriteInput = z.infer<typeof academicServiceWriteSchema>;

export function emptyAcademicServiceDraft(): AcademicServiceWriteInput {
  return {
    organization: "",
    roleTitle: "",
    serviceType: "other",
    startYear: null,
    endYear: null,
    proofUrl: null,
    summary: null,
    sortOrder: 0,
  };
}

export function academicServiceDraftFromAdmin(
  row: AcademicServiceAdmin,
): AcademicServiceWriteInput {
  return {
    organization: row.organization,
    roleTitle: row.roleTitle,
    serviceType: row.serviceType,
    startYear: row.startYear,
    endYear: row.endYear,
    proofUrl: row.proofUrl,
    summary: row.summary,
    sortOrder: row.sortOrder,
  };
}

export function academicServiceFieldErrorsFromZod(
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

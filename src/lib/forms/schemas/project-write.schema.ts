import { z } from "zod";
import type { ProjectAdminSummary } from "~/lib/api/types/project.types";
import type { ProjectType } from "~/lib/api/types/project.types";

export const PROJECT_TYPES: ProjectType[] = [
  "research_prototype",
  "production",
  "open_source",
  "coursework",
  "competition",
  "other",
];

const longText = z.string().max(100_000).optional().nullable();

export const projectSectionDraftSchema = z.object({
  kind: z
    .enum([
      "problem",
      "context",
      "responsibilities",
      "solution",
      "data_methods",
      "evaluation",
      "results",
      "limitations",
      "future_work",
      "custom",
    ])
    .optional(),
  title: z.string().max(300).optional().nullable(),
  body: z.string().max(100_000),
  mediaIds: z.array(z.string().uuid()).max(5).optional(),
});

export const projectResourceDraftSchema = z.object({
  resourceType: z
    .enum([
      "repo",
      "demo",
      "paper",
      "dataset",
      "model_card",
      "documentation",
      "video",
      "other",
    ])
    .optional(),
  label: z.string().max(200),
  url: z.string().max(2000),
});

export const projectMetricDraftSchema = z.object({
  name: z.string().max(300),
  value: z.string().max(200),
  unit: z.string().max(100).optional().nullable(),
  baseline: z.string().max(200).optional().nullable(),
  notes: longText,
  caption: longText,
});

export const projectWriteSchema = z.object({
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
  tags: z.array(z.string().max(100)).max(30).optional(),
  projectType: z.enum(PROJECT_TYPES as [ProjectType, ...ProjectType[]]).optional(),
  projectStatus: z
    .enum(["ongoing", "completed", "maintained", "archived"])
    .optional(),
  evaluationMaturity: z
    .enum(["verified", "provisional", "experimental"])
    .optional(),
  ownerRole: longText,
  ownerContribution: longText,
  resultTeaser: longText,
  periodStart: z.string().max(20).optional().nullable(),
  periodEnd: z.string().max(20).optional().nullable(),
  coverMediaId: z.string().uuid().nullable().optional(),
  featured: z.boolean().optional(),
  featuredOnHome: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  seoTitle: z.string().max(500).optional().nullable(),
  seoDescription: longText,
  hideFromSearch: z.boolean().optional(),
  sections: z.array(projectSectionDraftSchema).max(40).optional(),
  resources: z.array(projectResourceDraftSchema).max(20).optional(),
  metrics: z.array(projectMetricDraftSchema).max(30).optional(),
});

export type ProjectWriteInput = z.infer<typeof projectWriteSchema>;

export function emptyProjectDraft(): ProjectWriteInput {
  return {
    slug: "",
    title: "",
    summary: "",
    tags: [],
    projectType: "other",
    projectStatus: "completed",
    evaluationMaturity: "provisional",
    ownerRole: null,
    ownerContribution: null,
    resultTeaser: null,
    periodStart: null,
    periodEnd: null,
    coverMediaId: null,
    featured: false,
    featuredOnHome: false,
    sortOrder: 0,
    seoTitle: null,
    seoDescription: null,
    hideFromSearch: false,
    sections: [],
    resources: [],
    metrics: [],
  };
}

export function projectDraftFromAdmin(row: ProjectAdminSummary): ProjectWriteInput {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    tags: row.tags ?? [],
    projectType: row.projectType,
    projectStatus: row.projectStatus,
    evaluationMaturity: row.evaluationMaturity,
    ownerRole: row.ownerRole,
    ownerContribution: row.ownerContribution,
    resultTeaser: row.resultTeaser,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    coverMediaId: row.coverMediaId,
    featured: row.featured,
    featuredOnHome: row.featuredOnHome,
    sortOrder: row.sortOrder,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    hideFromSearch: row.hideFromSearch,
    sections: row.sections.map((s) => ({
      kind: s.kind,
      title: s.title,
      body: s.body,
      ...(s.mediaIds?.length ? { mediaIds: s.mediaIds } : {}),
    })),
    resources: row.resources.map((r) => ({
      resourceType: r.resourceType,
      label: r.label,
      url: r.url,
    })),
    metrics: row.metrics.map((m) => ({
      name: m.name,
      value: m.value,
      unit: m.unit,
      baseline: m.baseline,
      notes: m.notes,
      caption: m.caption,
    })),
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function projectDraftToWriteBody(
  draft: ProjectWriteInput,
): import("~/lib/api/types/project.types").ProjectWriteBody {
  return {
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    tags: draft.tags?.length ? draft.tags : null,
    projectType: draft.projectType,
    projectStatus: draft.projectStatus,
    evaluationMaturity: draft.evaluationMaturity,
    ownerRole: emptyToNull(draft.ownerRole),
    ownerContribution: emptyToNull(draft.ownerContribution),
    resultTeaser: emptyToNull(draft.resultTeaser),
    periodStart: emptyToNull(draft.periodStart),
    periodEnd: emptyToNull(draft.periodEnd),
    coverMediaId: draft.coverMediaId ?? null,
    featured: draft.featured,
    featuredOnHome: draft.featuredOnHome,
    sortOrder: draft.sortOrder,
    seoTitle: emptyToNull(draft.seoTitle),
    seoDescription: emptyToNull(draft.seoDescription),
    hideFromSearch: draft.hideFromSearch,
    sections: (draft.sections ?? []).map((s) => ({
      kind: s.kind,
      title: emptyToNull(s.title),
      body: s.body,
      ...(s.mediaIds?.length ? { mediaIds: s.mediaIds } : {}),
    })),
    resources: (draft.resources ?? [])
      .map((r) => ({
        resourceType: r.resourceType ?? "other",
        label: r.label.trim(),
        url: r.url.trim(),
      }))
      .filter((r) => r.label.length > 0 && r.url.length > 0),
    metrics: (draft.metrics ?? [])
      .map((m) => ({
        name: m.name.trim(),
        value: m.value.trim(),
        unit: emptyToNull(m.unit),
        baseline: emptyToNull(m.baseline),
        notes: emptyToNull(m.notes),
        caption: emptyToNull(m.caption),
      }))
      .filter((m) => m.name.length > 0 && m.value.length > 0),
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

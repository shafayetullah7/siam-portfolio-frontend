import { z } from "zod";

const longText = z.string().max(100_000).optional().default("");

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens",
  );

const tagItemSchema = z.string().min(1).max(80);

const httpsUrl = z
  .string()
  .url("Enter a valid URL")
  .max(500)
  .refine((u) => u.startsWith("https://"), "URL must use HTTPS");

const optionalHttpsUrl = z
  .string()
  .max(500)
  .optional()
  .transform((v) => v?.trim() ?? "")
  .refine((v) => v === "" || v.startsWith("https://"), "URL must use HTTPS");

const collaboratorSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().max(200).optional(),
  url: optionalHttpsUrl.optional(),
});

const themeResourceSchema = z.object({
  label: z.string().min(1).max(200),
  url: httpsUrl,
  resourceType: z.enum(["code", "data", "demo", "paper", "other"]),
});

/** Parsed from hidden `collaboratorsJson` / `resourcesJson` on submit. */
export function parseCollaboratorsJson(raw: string | undefined) {
  if (!raw?.trim()) return [];
  const items = JSON.parse(raw) as unknown[];
  const withNames = items.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      "name" in item &&
      String((item as { name: string }).name).trim(),
  );
  return z.array(collaboratorSchema).max(50).parse(withNames);
}

export function parseResourcesJson(raw: string | undefined) {
  if (!raw?.trim()) return [];
  const items = JSON.parse(raw) as unknown[];
  const complete = items.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      "label" in item &&
      "url" in item &&
      String((item as { label: string }).label).trim() &&
      String((item as { url: string }).url).trim(),
  );
  return z.array(themeResourceSchema).max(20).parse(complete);
}

export function parseTagsFromInput(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export const adminResearchThemeSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: slugSchema,
  summary: z.string().min(1, "Summary is required").max(10_000),
  themeStatus: z.enum(["ongoing", "completed"]).default("ongoing"),
  problem: longText,
  significance: longText,
  objectives: longText,
  approach: longText,
  findings: longText,
  limitations: longText,
  futureWork: longText,
  tags: z.array(tagItemSchema).max(50).default([]),
  seoTitle: z.string().max(120).nullable().optional(),
  seoDescription: z.string().max(320).nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  featuredOnHome: z.boolean().default(false),
  linkLabel: z.string().max(120).nullable().optional(),
  coverMediaId: z.string().uuid().nullable().optional(),
  acknowledgments: longText,
  funding: longText,
  collaborators: z.array(collaboratorSchema).max(50).default([]),
  resources: z.array(themeResourceSchema).max(20).default([]),
});

export type AdminResearchThemeInput = z.infer<typeof adminResearchThemeSchema>;

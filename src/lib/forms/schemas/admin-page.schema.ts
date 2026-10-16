import { z } from "zod";

export const adminPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  body: z.string().default(""),
  seoTitle: z.string().max(120).nullable().optional(),
  seoDescription: z.string().max(320).nullable().optional(),
});

export type AdminPageInput = z.infer<typeof adminPageSchema>;

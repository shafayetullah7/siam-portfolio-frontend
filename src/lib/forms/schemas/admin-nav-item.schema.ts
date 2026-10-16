import { z } from "zod";

export const adminNavItemSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, "Label is required").max(100),
  path: z.string().min(1, "Path is required").max(300),
  sortOrder: z.coerce.number().int().min(0).default(0),
  visible: z.boolean().default(true),
});

export type AdminNavItemInput = z.infer<typeof adminNavItemSchema>;

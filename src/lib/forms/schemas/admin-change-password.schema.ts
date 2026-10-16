import { z } from "zod";
import { adminPasswordSchema } from "~/lib/auth/adminPasswordPolicy";

export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: adminPasswordSchema,
});

export type AdminChangePasswordInput = z.infer<typeof adminChangePasswordSchema>;

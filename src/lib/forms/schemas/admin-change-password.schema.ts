import { z } from "zod";

export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type AdminChangePasswordInput = z.infer<typeof adminChangePasswordSchema>;

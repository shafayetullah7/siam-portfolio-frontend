import { z } from "zod";
import { adminPasswordSchema } from "~/lib/auth/adminPasswordPolicy";

export const adminResetPasswordSchema = z.object({
  token: z.string().min(20, "Reset link is invalid or incomplete"),
  password: adminPasswordSchema,
});

export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;

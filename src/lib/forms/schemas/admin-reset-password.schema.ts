import { z } from "zod";

export const adminResetPasswordSchema = z.object({
  token: z.string().min(20, "Reset link is invalid or incomplete"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;

import { z } from "zod";

export const adminForgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export type AdminForgotPasswordInput = z.infer<typeof adminForgotPasswordSchema>;

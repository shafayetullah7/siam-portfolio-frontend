import { z } from "zod";

export const adminVerifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type AdminVerifyOtpInput = z.infer<typeof adminVerifyOtpSchema>;

import { z } from "zod";

/** Public contact form (P16) — validate before POST when API ships. */
export const contactInquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.email("Enter a valid email"),
  category: z.string().max(100).optional(),
  message: z.string().min(10, "Message is too short").max(5000),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

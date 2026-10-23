import { z } from "zod";

/** Public contact form (P16) — validate before POST when API ships. */
export const contactInquirySchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.email("Enter a valid email"),
    category: z.string().max(100).optional(),
    affiliation: z.string().max(200).optional(),
    message: z.string().min(10, "Message is too short").max(5000),
    consent: z.boolean(),
    /** Honeypot — must stay empty. */
    website: z.string().optional(),
    turnstileToken: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid submission",
        path: ["website"],
      });
    }
  });

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

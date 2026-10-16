import { z } from "zod";

export const adminRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  userName: z
    .string()
    .regex(
      /^[a-zA-Z0-9_-]{3,50}$/,
      "Username: 3–50 letters, numbers, _ or -",
    ),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;

import { describe, expect, it } from "vitest";
import { contactInquirySchema } from "./contact-inquiry.schema";

describe("contactInquirySchema", () => {
  it("rejects messages that are too short", () => {
    const result = contactInquirySchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "short",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-empty honeypot", () => {
    const result = contactInquirySchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello world!",
      consent: true,
      website: "spam",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid inquiry", () => {
    const result = contactInquirySchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello world!",
      consent: true,
    });
    expect(result.success).toBe(true);
  });
});

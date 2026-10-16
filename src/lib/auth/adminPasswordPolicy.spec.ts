import { describe, expect, it } from "vitest";
import {
  adminPasswordSchema,
  isAdminPasswordValid,
} from "./adminPasswordPolicy";

const VALID = "Testpass1.";

describe("adminPasswordPolicy", () => {
  it("accepts a compliant password", () => {
    expect(isAdminPasswordValid(VALID)).toBe(true);
    expect(adminPasswordSchema.safeParse(VALID).success).toBe(true);
  });

  it("rejects password12 (no special)", () => {
    expect(isAdminPasswordValid("password12")).toBe(false);
    expect(adminPasswordSchema.safeParse("password12").success).toBe(false);
  });

  it("rejects too short", () => {
    expect(isAdminPasswordValid("Ab1.")).toBe(false);
  });

  it("rejects too long", () => {
    const long = `A1.${"a".repeat(126)}`;
    expect(long.length).toBe(129);
    expect(isAdminPasswordValid(long)).toBe(false);
  });

  it("rejects spaces", () => {
    expect(isAdminPasswordValid("Test pass1.")).toBe(false);
  });

  it("accepts exactly 8 characters when rules met", () => {
    expect(isAdminPasswordValid("Test1.aa")).toBe(true);
  });
});

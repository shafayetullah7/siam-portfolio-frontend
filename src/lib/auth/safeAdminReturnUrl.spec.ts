import { describe, expect, it } from "vitest";
import { safeAdminReturnUrl } from "./safeAdminReturnUrl";

describe("safeAdminReturnUrl", () => {
  it("defaults when missing or empty", () => {
    expect(safeAdminReturnUrl(undefined)).toBe("/admin");
    expect(safeAdminReturnUrl("")).toBe("/admin");
  });

  it("allows admin paths", () => {
    expect(safeAdminReturnUrl("/admin")).toBe("/admin");
    expect(safeAdminReturnUrl("/admin/site")).toBe("/admin/site");
    expect(safeAdminReturnUrl("/admin/pages?x=1")).toBe("/admin/pages?x=1");
  });

  it("rejects open redirects", () => {
    expect(safeAdminReturnUrl("https://evil.example/admin")).toBe("/admin");
    expect(safeAdminReturnUrl("//evil.example/admin")).toBe("/admin");
    expect(safeAdminReturnUrl("/public")).toBe("/admin");
    expect(safeAdminReturnUrl("/admin/../../../etc")).toBe("/admin/../../../etc");
  });
});

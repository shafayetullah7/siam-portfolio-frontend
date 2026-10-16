import { describe, expect, it } from "vitest";
import { isPublicAdminAuthPath } from "./publicAdminAuthPaths";

describe("isPublicAdminAuthPath", () => {
  it("matches login and register flows", () => {
    expect(isPublicAdminAuthPath("/admin/login")).toBe(true);
    expect(isPublicAdminAuthPath("/admin/register/verify")).toBe(true);
    expect(isPublicAdminAuthPath("/admin/pages")).toBe(false);
  });
});

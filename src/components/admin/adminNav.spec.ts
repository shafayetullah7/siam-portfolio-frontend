import { describe, expect, it } from "vitest";
import { ADMIN_NAV_ITEMS, isAdminNavActive } from "./adminNav";

describe("isAdminNavActive", () => {
  it("matches dashboard only on exact /admin", () => {
    const dashboard = ADMIN_NAV_ITEMS[0];
    expect(isAdminNavActive("/admin", dashboard)).toBe(true);
    expect(isAdminNavActive("/admin/", dashboard)).toBe(true);
    expect(isAdminNavActive("/admin/pages", dashboard)).toBe(false);
  });

  it("matches pages section and nested editor routes", () => {
    const pages = ADMIN_NAV_ITEMS[1];
    expect(isAdminNavActive("/admin/pages", pages)).toBe(true);
    expect(isAdminNavActive("/admin/pages/abc", pages)).toBe(true);
    expect(isAdminNavActive("/admin/site", pages)).toBe(false);
  });
});

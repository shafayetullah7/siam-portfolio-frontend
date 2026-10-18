import { describe, expect, it } from "vitest";
import {
  ADMIN_NAV_SECTIONS,
  getActiveAdminNavItems,
  isAdminNavActive,
} from "./adminNav";

function itemById(id: string) {
  for (const section of ADMIN_NAV_SECTIONS) {
    const found = section.items.find((i) => i.id === id);
    if (found) return found;
  }
  throw new Error(`missing nav item ${id}`);
}

describe("isAdminNavActive", () => {
  it("matches dashboard only on exact /admin", () => {
    const dashboard = itemById("dashboard");
    expect(isAdminNavActive("/admin", dashboard)).toBe(true);
    expect(isAdminNavActive("/admin/", dashboard)).toBe(true);
    expect(isAdminNavActive("/admin/pages", dashboard)).toBe(false);
  });

  it("matches pages section and nested editor routes", () => {
    const pages = itemById("pages");
    expect(isAdminNavActive("/admin/pages", pages)).toBe(true);
    expect(isAdminNavActive("/admin/pages/abc", pages)).toBe(true);
    expect(isAdminNavActive("/admin/site", pages)).toBe(false);
  });

  it("does not match comingSoon items", () => {
    const home = itemById("home");
    expect(isAdminNavActive("/admin/home", home)).toBe(false);
  });
});

describe("ADMIN_NAV_SECTIONS", () => {
  it("has unique item ids and active hrefs", () => {
    const ids = new Set<string>();
    const activeHrefs = new Set<string>();
    for (const section of ADMIN_NAV_SECTIONS) {
      for (const item of section.items) {
        expect(ids.has(item.id)).toBe(false);
        ids.add(item.id);
        if (item.status === "active") {
          expect(activeHrefs.has(item.href)).toBe(false);
          activeHrefs.add(item.href);
        }
      }
    }
  });

  it("exposes three active routes", () => {
    const active = getActiveAdminNavItems();
    expect(active.map((i) => i.id).sort()).toEqual(["dashboard", "pages", "site-settings"]);
  });
});

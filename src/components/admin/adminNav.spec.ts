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

  it("matches research section and nested editor routes", () => {
    const research = itemById("research");
    expect(isAdminNavActive("/admin/research", research)).toBe(true);
    expect(isAdminNavActive("/admin/research/abc", research)).toBe(true);
    expect(isAdminNavActive("/admin/pages", research)).toBe(false);
  });

  it("matches publications section and nested editor routes", () => {
    const publications = itemById("publications");
    expect(isAdminNavActive("/admin/publications", publications)).toBe(true);
    expect(isAdminNavActive("/admin/publications/abc", publications)).toBe(true);
    expect(isAdminNavActive("/admin/publications/abc/edit", publications)).toBe(
      true,
    );
    expect(isAdminNavActive("/admin/research", publications)).toBe(false);
  });

  it("matches writing section and nested editor routes", () => {
    const writing = itemById("writing");
    expect(isAdminNavActive("/admin/writing", writing)).toBe(true);
    expect(isAdminNavActive("/admin/writing/abc", writing)).toBe(true);
    expect(isAdminNavActive("/admin/writing/abc/edit", writing)).toBe(true);
    expect(isAdminNavActive("/admin/projects", writing)).toBe(false);
  });

  it("matches achievements section and nested editor routes", () => {
    const achievements = itemById("achievements");
    expect(isAdminNavActive("/admin/achievements", achievements)).toBe(true);
    expect(isAdminNavActive("/admin/achievements/abc", achievements)).toBe(true);
    expect(isAdminNavActive("/admin/achievements/abc/edit", achievements)).toBe(
      true,
    );
    expect(isAdminNavActive("/admin/writing", achievements)).toBe(false);
  });

  it("does not match comingSoon items", () => {
    const home = itemById("home");
    expect(isAdminNavActive("/admin/home", home)).toBe(false);
  });

  it("matches media library route", () => {
    const media = itemById("media");
    expect(isAdminNavActive("/admin/media", media)).toBe(true);
    expect(isAdminNavActive("/admin/pages", media)).toBe(false);
  });

  it("matches messages inbox and detail routes", () => {
    const messages = itemById("messages");
    expect(isAdminNavActive("/admin/messages", messages)).toBe(true);
    expect(isAdminNavActive("/admin/messages/abc", messages)).toBe(true);
    expect(isAdminNavActive("/admin/media", messages)).toBe(false);
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

  it("exposes active implemented routes", () => {
    const active = getActiveAdminNavItems();
    expect(active.map((i) => i.id).sort()).toEqual([
      "achievements",
      "dashboard",
      "media",
      "messages",
      "pages",
      "projects",
      "publications",
      "research",
      "site-settings",
      "writing",
    ]);
  });
});

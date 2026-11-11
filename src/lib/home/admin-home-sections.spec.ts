import { describe, expect, it } from "vitest";
import {
  coerceEditorSections,
  defaultHomeSections,
  HOME_SECTION_IDS,
  moduleEditorHref,
  sectionAdminLabel,
} from "./admin-home-sections";

describe("admin-home-sections", () => {
  it("defaultHomeSections includes all ids visible", () => {
    expect(defaultHomeSections()).toHaveLength(HOME_SECTION_IDS.length);
    expect(defaultHomeSections().every((s) => s.visible)).toBe(true);
  });

  it("coerceEditorSections returns defaults when null", () => {
    expect(coerceEditorSections(null)).toEqual(defaultHomeSections());
  });

  it("preserves stored order and visibility", () => {
    const stored = [
      { id: "hero" as const, visible: true },
      { id: "featuredProjects" as const, visible: false },
      { id: "researchFocus" as const, visible: true },
    ];
    const result = coerceEditorSections(stored);
    expect(result.slice(0, 3).map((s) => s.id)).toEqual([
      "hero",
      "featuredProjects",
      "researchFocus",
    ]);
    expect(result.find((s) => s.id === "featuredProjects")?.visible).toBe(false);
    expect(result).toHaveLength(HOME_SECTION_IDS.length);
  });

  it("forces hero visible", () => {
    const result = coerceEditorSections([{ id: "hero", visible: false }]);
    expect(result.find((s) => s.id === "hero")?.visible).toBe(true);
  });

  it("sectionAdminLabel and moduleEditorHref", () => {
    expect(sectionAdminLabel("hero")).toBe("Hero");
    expect(sectionAdminLabel("researchFocus")).toContain("Research");
    expect(moduleEditorHref("researchFocus")).toBe("/admin/research");
    expect(moduleEditorHref("hero")).toBeUndefined();
  });
});

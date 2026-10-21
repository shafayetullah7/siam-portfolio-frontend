import { describe, expect, it } from "vitest";
import {
  adminResearchThemeSchema,
  parseTagsFromInput,
} from "./admin-research-theme.schema";

describe("parseTagsFromInput", () => {
  it("splits and trims comma-separated tags", () => {
    expect(parseTagsFromInput("ml, fairness , nlp")).toEqual([
      "ml",
      "fairness",
      "nlp",
    ]);
  });

  it("returns empty for blank input", () => {
    expect(parseTagsFromInput("  ")).toEqual([]);
  });
});

describe("adminResearchThemeSchema", () => {
  it("accepts minimal create payload", () => {
    const result = adminResearchThemeSchema.safeParse({
      title: "Theme",
      slug: "my-theme",
      summary: "Summary",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.themeStatus).toBe("ongoing");
      expect(result.data.tags).toEqual([]);
    }
  });

  it("rejects invalid slug", () => {
    const result = adminResearchThemeSchema.safeParse({
      title: "Theme",
      slug: "Bad Slug",
      summary: "Summary",
    });
    expect(result.success).toBe(false);
  });
});

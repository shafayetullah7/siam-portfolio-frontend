import { describe, expect, it } from "vitest";
import { researchCardPublicToHomeItem } from "./research-card-mapper";

describe("researchCardPublicToHomeItem", () => {
  it("maps cover fields for grid cards", () => {
    const item = researchCardPublicToHomeItem({
      slug: "x",
      title: "Theme",
      summary: "Summary",
      themeStatus: "ongoing",
      tags: ["ml"],
      coverUrl: "https://example.com/c.jpg",
      coverAlt: "Alt",
      href: "/research/x",
    });
    expect(item.coverUrl).toBe("https://example.com/c.jpg");
    expect(item.coverAlt).toBe("Alt");
    expect(item.description).toBe("Summary");
  });
});

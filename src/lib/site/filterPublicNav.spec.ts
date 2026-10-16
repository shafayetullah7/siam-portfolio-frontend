import { describe, expect, it } from "vitest";
import { filterPublicNav } from "./filterPublicNav";

describe("filterPublicNav", () => {
  it("keeps visible items whose path is in sitemapPaths", () => {
    const nav = [
      { id: "1", label: "Home", path: "/", sortOrder: 0, visible: true },
      { id: "2", label: "Draft", path: "/pages/draft", sortOrder: 1, visible: true },
      { id: "3", label: "Hidden", path: "/about", sortOrder: 2, visible: false },
    ];
    const result = filterPublicNav(nav, ["/", "/about"]);
    expect(result.map((n) => n.path)).toEqual(["/"]);
  });
});

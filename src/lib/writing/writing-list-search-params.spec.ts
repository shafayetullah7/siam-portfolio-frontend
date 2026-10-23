import { describe, expect, it } from "vitest";
import {
  parseWritingListSearchParams,
  writingListHasActiveFilters,
  writingListSearchParamsToApi,
} from "./writing-list-search-params";

describe("writing-list-search-params", () => {
  it("parses q, tag, series, page, and sort", () => {
    const parsed = parseWritingListSearchParams({
      q: "essay",
      tag: "ml",
      series: "notes",
      page: "2",
      sort: "titleAsc",
    });
    expect(parsed).toEqual({
      q: "essay",
      tag: "ml",
      series: "notes",
      page: "2",
      sort: "titleAsc",
    });
  });

  it("maps to API params with featured flags", () => {
    const api = writingListSearchParamsToApi(
      { q: "x", page: "3" },
      { excludeFeaturedOnHub: true, limit: 24 },
    );
    expect(api).toEqual({
      q: "x",
      page: 3,
      limit: 24,
      excludeFeaturedOnHub: true,
    });
  });

  it("detects active filters", () => {
    expect(writingListHasActiveFilters({})).toBe(false);
    expect(writingListHasActiveFilters({ series: "a" })).toBe(true);
    expect(writingListHasActiveFilters({ sort: "titleAsc" })).toBe(true);
  });
});

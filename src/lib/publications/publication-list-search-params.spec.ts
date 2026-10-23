import { describe, expect, it, vi } from "vitest";
import {
  clearPublicationListFilters,
  parsePublicationListSearchParams,
  publicationListSearchParamsToApi,
  setPublicationListFilters,
} from "./publication-list-search-params";

describe("publication-list-search-params", () => {
  it("parses and maps to API params", () => {
    const parsed = parsePublicationListSearchParams({
      q: "transformer",
      year: "2024",
      type: "preprint",
      theme: "ml-safety",
      page: "2",
      group: "year",
    });
    expect(publicationListSearchParamsToApi(parsed)).toEqual({
      q: "transformer",
      year: 2024,
      type: "preprint",
      theme: "ml-safety",
      page: 2,
    });
    expect(parsed.group).toBe("year");
  });

  it("reset clears filters via setSearchParams", () => {
    const setSearchParams = vi.fn();
    clearPublicationListFilters(setSearchParams);
    expect(setSearchParams).toHaveBeenCalledWith({
      q: null,
      year: null,
      type: null,
      theme: null,
      group: null,
      page: null,
    });
  });

  it("setPublicationListFilters resets page", () => {
    const setSearchParams = vi.fn();
    setPublicationListFilters(setSearchParams, { year: "2023" });
    expect(setSearchParams).toHaveBeenCalledWith(
      expect.objectContaining({ year: "2023", page: null }),
      undefined,
    );
  });
});

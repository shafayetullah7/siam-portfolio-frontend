import { describe, expect, it } from "vitest";
import {
  parseProjectListSearchParams,
  projectListSearchParamsToApi,
} from "./project-list-search-params";

describe("project-list-search-params", () => {
  it("round-trips URL params to API params", () => {
    const parsed = parseProjectListSearchParams({
      q: "ml",
      tag: "python",
      type: "open_source",
      status: "completed",
      page: "2",
    });
    expect(projectListSearchParamsToApi(parsed)).toEqual({
      q: "ml",
      tag: "python",
      projectType: "open_source",
      projectStatus: "completed",
      page: 2,
    });
  });

  it("ignores invalid type and status", () => {
    const parsed = parseProjectListSearchParams({
      type: "not-a-type",
      status: "invalid",
    });
    expect(parsed.type).toBeUndefined();
    expect(parsed.status).toBeUndefined();
  });
});

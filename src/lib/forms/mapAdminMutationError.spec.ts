import { describe, expect, it } from "vitest";
import { ApiError } from "../api/types";
import { mapAdminMutationError } from "./mapAdminMutationError";

describe("mapAdminMutationError", () => {
  it("maps 403 to user-facing copy", () => {
    const mapped = mapAdminMutationError(new ApiError("Forbidden", 403));
    expect(mapped.formMessage).toContain("Action not allowed");
    expect(mapped.fieldErrors).toEqual({});
  });

  it("maps 400 validation errors to fields", () => {
    const mapped = mapAdminMutationError(
      new ApiError("Invalid", 400, {
        success: false,
        message: "Invalid",
        validationErrors: [{ field: "slug", message: "Slug taken" }],
      }),
    );
    expect(mapped.fieldErrors.slug).toBe("Slug taken");
    expect(mapped.formMessage).toBe("Invalid");
  });

  it("falls back to generic message", () => {
    const mapped = mapAdminMutationError(new Error("Network"));
    expect(mapped.formMessage).toBe("Network");
  });
});

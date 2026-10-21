import { describe, expect, it } from "vitest";
import { ApiError } from "./types";
import {
  getApiErrorMessage,
  getApiErrorUserMessage,
  getApiValidationErrors,
  getAuthFormErrorMessage,
  isApiError,
} from "./errors";

describe("api errors", () => {
  it("isApiError", () => {
    expect(isApiError(new ApiError("x", 400))).toBe(true);
    expect(isApiError(new Error("x"))).toBe(false);
  });

  it("getApiErrorMessage uses ApiError message", () => {
    expect(getApiErrorMessage(new ApiError("Bad", 400))).toBe("Bad");
  });

  it("getApiErrorMessage falls back for Error and unknown", () => {
    expect(getApiErrorMessage(new Error("Oops"))).toBe("Oops");
    expect(getApiErrorMessage("plain")).toBe("plain");
    expect(getApiErrorMessage(null)).toContain("Something went wrong");
  });

  it("maps 403 user message", () => {
    const msg = getApiErrorUserMessage(new ApiError("Forbidden", 403));
    expect(msg.title).toBe("Action not allowed");
  });

  it("maps 404 user message", () => {
    const msg = getApiErrorUserMessage(new ApiError("Missing", 404));
    expect(msg.title).toBe("Not found");
    expect(msg.description).toContain("Missing");
  });

  it("maps 429 user message", () => {
    const msg = getApiErrorUserMessage(new ApiError("Slow down", 429));
    expect(msg.title).toBe("Too many requests");
  });

  it("getApiValidationErrors reads envelope validationErrors", () => {
    const err = new ApiError("Invalid", 400, {
      success: false,
      message: "Invalid",
      statusCode: 400,
      validationErrors: [{ field: "email", message: "Required" }],
    });
    expect(getApiValidationErrors(err)).toEqual([
      { field: "email", message: "Required" },
    ]);
  });

  it("getAuthFormErrorMessage maps 401", () => {
    const result = getAuthFormErrorMessage(new ApiError("Unauthorized", 401));
    expect(result.formMessage).toBe("Invalid email or password.");
  });

  it("getAuthFormErrorMessage maps 429", () => {
    const result = getAuthFormErrorMessage(new ApiError("Slow", 429));
    expect(result.formMessage).toContain("wait");
  });

  it("getAuthFormErrorMessage maps 429 API envelope from throttler filter", () => {
    const result = getAuthFormErrorMessage(
      new ApiError("Too many requests. Please try again later.", 429, {
        success: false,
        message: "Too many requests. Please try again later.",
        statusCode: 429,
      }),
    );
    expect(result.formMessage).toContain("wait");
  });

  it("getAuthFormErrorMessage maps 400 with fields", () => {
    const result = getAuthFormErrorMessage(
      new ApiError("Invalid password", 400, {
        success: false,
        message: "Invalid password",
        statusCode: 400,
      }),
    );
    expect(result.formMessage).toBe("Invalid password");
    expect(result.fieldErrors.form).toBe("Invalid password");
  });
});

import { ApiError, type ApiFailure, type FieldError } from "./types";

function isApiFailure(body: unknown): body is ApiFailure {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as ApiFailure).success === false
  );
}

function readValidationErrors(body: unknown): FieldError[] {
  if (!body || typeof body !== "object") return [];
  if (isApiFailure(body) && body.validationErrors?.length) {
    return body.validationErrors;
  }
  const nested = (body as { error?: { validationErrors?: FieldError[] } }).error;
  if (nested?.validationErrors?.length) return nested.validationErrors;
  return [];
}

/** Validation errors from API envelope on `ApiError.body`. */
export function getApiValidationErrors(error: unknown): FieldError[] {
  if (!isApiError(error)) return [];
  return readValidationErrors(error.body);
}

export type AuthFormErrorResult = {
  formMessage: string;
  fieldErrors: Record<string, string>;
};

/** Login/register form mapping — event handlers only (not ErrorBoundary). */
export function getAuthFormErrorMessage(error: unknown): AuthFormErrorResult {
  const fieldErrors: Record<string, string> = {};

  if (isApiError(error)) {
    if (error.status === 429) {
      const copy = getApiErrorUserMessage(error);
      return { formMessage: copy.description, fieldErrors };
    }
    if (error.status === 401) {
      return {
        formMessage: "Invalid email or password.",
        fieldErrors,
      };
    }
    if (error.status === 400) {
      for (const item of getApiValidationErrors(error)) {
        fieldErrors[item.field] = item.message;
      }
      const formMessage =
        Object.keys(fieldErrors).length > 0
          ? error.message || "Check the fields below."
          : error.message || "Check the fields below.";
      if (Object.keys(fieldErrors).length === 0 && formMessage) {
        fieldErrors.form = formMessage;
      }
      return { formMessage, fieldErrors };
    }
  }

  return {
    formMessage: getApiErrorMessage(error),
    fieldErrors,
  };
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function getApiErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}

export function getApiErrorUserMessage(error: unknown): {
  title: string;
  description: string;
} {
  if (isApiError(error)) {
    switch (error.status) {
      case 403:
        return {
          title: "Action not allowed",
          description:
            "You may not have permission, or your session may need a refresh. Try signing in again if this persists.",
        };
      case 404:
        return {
          title: "Not found",
          description: error.message || "The requested content could not be found.",
        };
      case 429:
        return {
          title: "Too many requests",
          description: "Please wait a moment and try again.",
        };
      case 401:
        return {
          title: "Sign in required",
          description: error.message || "Your session may have expired.",
        };
      default:
        return {
          title: "Request failed",
          description: error.message,
        };
    }
  }
  return {
    title: "Something went wrong",
    description: getApiErrorMessage(error),
  };
}

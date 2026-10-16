import {
  getApiErrorMessage,
  getApiErrorUserMessage,
  getApiValidationErrors,
  isApiError,
} from "~/lib/api/errors";
import { formFailure, type FormActionResult } from "./types";

/** CMS/admin mutation errors (not auth login 401 copy). */
export function mapAdminMutationError(error: unknown): {
  formMessage: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  if (isApiError(error) && error.status === 403) {
    const copy = getApiErrorUserMessage(error);
    return {
      formMessage: `${copy.title}. ${copy.description}`,
      fieldErrors,
    };
  }

  const validation = getApiValidationErrors(error);
  if (validation.length > 0) {
    for (const item of validation) {
      fieldErrors[item.field] = item.message;
    }
    return {
      formMessage: getApiErrorMessage(error) || "Check the fields below.",
      fieldErrors,
    };
  }

  return {
    formMessage: getApiErrorMessage(error),
    fieldErrors,
  };
}

export function mapAdminMutationErrorToResult(error: unknown): FormActionResult {
  const { formMessage, fieldErrors } = mapAdminMutationError(error);
  return formFailure(formMessage, fieldErrors);
}

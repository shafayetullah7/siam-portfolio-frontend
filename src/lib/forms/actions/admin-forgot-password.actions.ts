import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminForgotPasswordSchema } from "~/lib/forms/schemas/admin-forgot-password.schema";
import type { ForgotPasswordActionResult } from "~/lib/forms/types";

export const forgotPasswordAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      email: fd.get("email")?.toString() ?? "",
    }),
    adminForgotPasswordSchema,
  );
  if (!parsed.success) return parsed.result as ForgotPasswordActionResult;

  try {
    const data = await adminAuthApi.forgotPassword(parsed.data);
    return {
      ok: true,
      message: data.message,
    } satisfies ForgotPasswordActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies ForgotPasswordActionResult;
  }
}, "adminForgotPassword");

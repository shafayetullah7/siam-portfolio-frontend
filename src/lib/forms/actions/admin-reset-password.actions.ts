import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminResetPasswordSchema } from "~/lib/forms/schemas/admin-reset-password.schema";
import type { ResetPasswordActionResult } from "~/lib/forms/types";

export const resetPasswordAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      token: fd.get("token")?.toString() ?? "",
      password: fd.get("password")?.toString() ?? "",
    }),
    adminResetPasswordSchema,
  );
  if (!parsed.success) return parsed.result as ResetPasswordActionResult;

  try {
    const data = await adminAuthApi.resetPassword(parsed.data);
    return {
      ok: true,
      message: data.message,
    } satisfies ResetPasswordActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies ResetPasswordActionResult;
  }
}, "adminResetPassword");

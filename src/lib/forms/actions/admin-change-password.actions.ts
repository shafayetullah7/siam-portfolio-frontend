import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminChangePasswordSchema } from "~/lib/forms/schemas/admin-change-password.schema";
import type { ChangePasswordActionResult } from "~/lib/forms/types";

export const changePasswordAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      currentPassword: fd.get("currentPassword")?.toString() ?? "",
      newPassword: fd.get("newPassword")?.toString() ?? "",
    }),
    adminChangePasswordSchema,
  );
  if (!parsed.success) return parsed.result as ChangePasswordActionResult;

  try {
    const data = await adminAuthApi.changePassword(parsed.data);
    return {
      ok: true,
      message: data.message,
    } satisfies ChangePasswordActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies ChangePasswordActionResult;
  }
}, "adminChangePassword");

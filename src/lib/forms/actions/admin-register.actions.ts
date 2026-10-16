import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminRegisterSchema } from "~/lib/forms/schemas/admin-register.schema";
import type { RegisterActionResult } from "~/lib/forms/types";

export const registerAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      firstName: fd.get("firstName")?.toString() ?? "",
      lastName: fd.get("lastName")?.toString() ?? "",
      userName: fd.get("userName")?.toString() ?? "",
      email: fd.get("email")?.toString() ?? "",
      password: fd.get("password")?.toString() ?? "",
    }),
    adminRegisterSchema,
  );
  if (!parsed.success) return parsed.result as RegisterActionResult;

  try {
    await adminAuthApi.register(parsed.data);
    return { ok: true } satisfies RegisterActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies RegisterActionResult;
  }
}, "adminRegister");

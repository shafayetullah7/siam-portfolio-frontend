import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminLoginSchema } from "~/lib/forms/schemas/admin-login.schema";
import type { LoginActionResult } from "~/lib/forms/types";

export const loginAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      email: fd.get("email")?.toString() ?? "",
      password: fd.get("password")?.toString() ?? "",
    }),
    adminLoginSchema,
  );
  if (!parsed.success) return parsed.result as LoginActionResult;

  try {
    const profile = await adminAuthApi.login(parsed.data);
    return { ok: true, profile } satisfies LoginActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies LoginActionResult;
  }
}, "adminLogin");

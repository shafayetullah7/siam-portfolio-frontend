import { action } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { parseWithSchema } from "~/lib/forms/parseFormData";
import { adminVerifyOtpSchema } from "~/lib/forms/schemas/admin-verify-otp.schema";
import type { VerifyRegistrationActionResult } from "~/lib/forms/types";

export const verifyRegistrationAction = action(async (formData: FormData) => {
  const parsed = parseWithSchema(
    formData,
    (fd) => ({
      otp: fd.get("otp")?.toString() ?? "",
    }),
    adminVerifyOtpSchema,
  );
  if (!parsed.success) return parsed.result as VerifyRegistrationActionResult;

  try {
    const profile = await adminAuthApi.verifyRegistration(parsed.data);
    return { ok: true, profile } satisfies VerifyRegistrationActionResult;
  } catch (error) {
    const mapped = getAuthFormErrorMessage(error);
    return {
      ok: false,
      formMessage: mapped.formMessage,
      fieldErrors: mapped.fieldErrors,
    } satisfies VerifyRegistrationActionResult;
  }
}, "adminVerifyRegistration");

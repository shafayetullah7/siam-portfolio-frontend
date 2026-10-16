export type FormActionResult =
  | { ok: true }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

import type { AdminProfile } from "~/lib/api/types/admin.types";

export type LoginActionResult =
  | { ok: true; profile: AdminProfile }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

export type RegisterActionResult = FormActionResult;

export type VerifyRegistrationActionResult =
  | { ok: true; profile: AdminProfile }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

export type PasswordMessageActionResult =
  | { ok: true; message: string }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

export type ForgotPasswordActionResult = PasswordMessageActionResult;
export type ResetPasswordActionResult = PasswordMessageActionResult;
export type ChangePasswordActionResult = PasswordMessageActionResult;

export function formSuccess(): FormActionResult {
  return { ok: true };
}

export function formFailure(
  formMessage: string,
  fieldErrors?: Record<string, string>,
): FormActionResult {
  return { ok: false, formMessage, fieldErrors };
}

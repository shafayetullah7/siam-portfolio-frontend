export type FormActionResult =
  | { ok: true }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

import type { AdminProfile } from "~/lib/api/types/admin.types";

export type LoginActionResult =
  | { ok: true; profile: AdminProfile }
  | { ok: false; formMessage: string; fieldErrors?: Record<string, string> };

export function formSuccess(): FormActionResult {
  return { ok: true };
}

export function formFailure(
  formMessage: string,
  fieldErrors?: Record<string, string>,
): FormActionResult {
  return { ok: false, formMessage, fieldErrors };
}

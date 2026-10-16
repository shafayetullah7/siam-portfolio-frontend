import type { ZodType } from "zod";
import { mapZodErrors } from "./mapZodErrors";
import { formFailure, type FormActionResult } from "./types";

export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      out[key] = value;
    }
  }
  return out;
}

/** Trim string; empty → null (optional CMS fields). */
export function emptyToNull(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function parseCheckbox(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function parseWithSchema<T>(
  formData: FormData,
  buildValues: (formData: FormData) => unknown,
  schema: ZodType<T>,
): { success: true; data: T } | { success: false; result: FormActionResult } {
  const parsed = schema.safeParse(buildValues(formData));
  if (!parsed.success) {
    return {
      success: false,
      result: formFailure("Check the fields below.", mapZodErrors(parsed.error)),
    };
  }
  return { success: true, data: parsed.data };
}

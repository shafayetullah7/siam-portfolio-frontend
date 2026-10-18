/** Move focus to the first invalid field or form alert after a failed submit. */
export function focusFirstFormError(
  fieldErrors: Record<string, string | undefined>,
  fieldOrder: string[],
  alertId?: string,
): void {
  if (typeof document === "undefined") return;

  for (const name of fieldOrder) {
    if (fieldErrors[name]) {
      const el = document.querySelector<HTMLElement>(
        `[name="${CSS.escape(name)}"]`,
      );
      if (el) {
        el.focus();
        return;
      }
    }
  }

  if (alertId) {
    document.getElementById(alertId)?.focus();
  }
}

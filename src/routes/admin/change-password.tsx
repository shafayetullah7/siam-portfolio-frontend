import { createSignal, Show } from "solid-js";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminChangePasswordSchema } from "~/lib/forms/schemas/admin-change-password.schema";

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [success, setSuccess] = createSignal(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    const parsed = adminChangePasswordSchema.safeParse({
      currentPassword: currentPassword(),
      newPassword: newPassword(),
    });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Check the fields below.");
      return;
    }
    try {
      await adminAuthApi.changePassword(parsed.data);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

  return (
    <div class="max-w-md">
      <h1 class="text-2xl font-bold text-ink">Change password</h1>
      <Show when={success()}>
        <p class="siam-alert-success mt-4" role="status">Password updated.</p>
      </Show>
      <form class="mt-8 space-y-4" onSubmit={onSubmit}>
        <label class="block text-sm font-medium">
          Current password
          <input
            type="password"
            class="siam-input mt-1"
            value={currentPassword()}
            onInput={(e) => setCurrentPassword(e.currentTarget.value)}
            aria-invalid={fieldErrors().currentPassword ? true : undefined}
          />
          <Show when={fieldErrors().currentPassword}>
            <p class="mt-1 text-sm text-error">{fieldErrors().currentPassword}</p>
          </Show>
        </label>
        <label class="block text-sm font-medium">
          New password
          <input
            type="password"
            class="siam-input mt-1"
            value={newPassword()}
            onInput={(e) => setNewPassword(e.currentTarget.value)}
            aria-invalid={fieldErrors().newPassword ? true : undefined}
          />
          <Show when={fieldErrors().newPassword}>
            <p class="mt-1 text-sm text-error">{fieldErrors().newPassword}</p>
          </Show>
        </label>
        {error() && <p class="siam-alert-error" role="alert">{error()}</p>}
        <button type="submit" class="siam-btn-primary">Update password</button>
      </form>
    </div>
  );
}

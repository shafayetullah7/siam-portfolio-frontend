import { useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import { changePasswordAction } from "~/lib/forms/actions/admin-change-password.actions";
import type { ChangePasswordActionResult } from "~/lib/forms/types";

export default function AdminChangePassword() {
  const submission = useSubmission(changePasswordAction);
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");

  const result = () => submission.result as ChangePasswordActionResult | undefined;

  const fieldErrors = () => {
    const r = result();
    if (r && !r.ok && r.fieldErrors) return r.fieldErrors;
    return {};
  };

  const formMessage = () => {
    const r = result();
    if (r && !r.ok) return r.formMessage;
    if (submission.error) return submission.error.message;
    return null;
  };

  const successMessage = () => {
    const r = result();
    if (r?.ok) return r.message;
    return null;
  };

  return (
    <div class="max-w-md">
      <h1 class="text-2xl font-bold text-ink">Change password</h1>
      <Show when={successMessage()}>
        <p class="siam-alert-success mt-4" role="status">{successMessage()}</p>
      </Show>
      <form class="mt-8 space-y-4" action={changePasswordAction} method="post">
        <FormField
          label="Current password"
          name="currentPassword"
          error={fieldErrors().currentPassword}
        >
          <FormTextInput
            type="password"
            name="currentPassword"
            autocomplete="current-password"
            value={currentPassword()}
            onInput={(e) => setCurrentPassword(e.currentTarget.value)}
            error={fieldErrors().currentPassword}
          />
        </FormField>
        <FormField label="New password" name="newPassword" error={fieldErrors().newPassword}>
          <FormTextInput
            type="password"
            name="newPassword"
            autocomplete="new-password"
            value={newPassword()}
            onInput={(e) => setNewPassword(e.currentTarget.value)}
            error={fieldErrors().newPassword}
          />
        </FormField>
        <FormErrorAlert message={formMessage()} />
        <button
          type="submit"
          class="siam-btn-primary"
          disabled={submission.pending}
        >
          {submission.pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

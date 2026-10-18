import { useSubmission } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PasswordRequirementsChecklist, {
  passwordRequirementsDescribedBy,
} from "~/components/forms/PasswordRequirementsChecklist";
import PasswordVisibilityToggle from "~/components/forms/PasswordVisibilityToggle";
import { ADMIN_PASSWORD_MAX } from "~/lib/auth/adminPasswordPolicy";
import { changePasswordAction } from "~/lib/forms/actions/admin-change-password.actions";
import type { ChangePasswordActionResult } from "~/lib/forms/types";

export default function AdminChangePassword() {
  const submission = useSubmission(changePasswordAction);
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [newPasswordFocused, setNewPasswordFocused] = createSignal(false);

  const newPasswordChecklistVisible = () =>
    newPasswordFocused() || newPassword().length > 0;

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
      <Title>Change password — SIAM Admin</Title>
      <AdminPageHeader title="Change password" />
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
          <div class="relative">
            <FormTextInput
              type={showNewPassword() ? "text" : "password"}
              name="newPassword"
              autocomplete="new-password"
              value={newPassword()}
              maxLength={ADMIN_PASSWORD_MAX}
              onInput={(e) => setNewPassword(e.currentTarget.value)}
              error={fieldErrors().newPassword}
              class="pr-11"
              describedByExtra={passwordRequirementsDescribedBy(
                "newPassword",
                newPasswordChecklistVisible(),
              )}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
            />
            <PasswordVisibilityToggle
              visible={showNewPassword()}
              onToggle={() => setShowNewPassword((v) => !v)}
            />
          </div>
          <PasswordRequirementsChecklist
            name="newPassword"
            password={newPassword()}
            visible={newPasswordChecklistVisible()}
            showErrors={Boolean(fieldErrors().newPassword)}
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

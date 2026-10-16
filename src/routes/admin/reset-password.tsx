import { A, useNavigate, useSearchParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PasswordRequirementsChecklist, {
  passwordRequirementsDescribedBy,
} from "~/components/forms/PasswordRequirementsChecklist";
import PasswordVisibilityToggle from "~/components/forms/PasswordVisibilityToggle";
import { ADMIN_PASSWORD_MAX } from "~/lib/auth/adminPasswordPolicy";
import { resetPasswordAction } from "~/lib/forms/actions/admin-reset-password.actions";
import type { ResetPasswordActionResult } from "~/lib/forms/types";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submission = useSubmission(resetPasswordAction);
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [passwordFocused, setPasswordFocused] = createSignal(false);

  const passwordChecklistVisible = () =>
    passwordFocused() || password().length > 0;

  const token = () => {
    const t = searchParams.token;
    return typeof t === "string" ? t : "";
  };

  const result = () => submission.result as ResetPasswordActionResult | undefined;

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

  createEffect(() => {
    const r = result();
    if (r?.ok) {
      navigate("/admin/login?message=password_reset", { replace: true });
    }
  });

  return (
    <AdminAuthLayout
      title="Reset password"
      footer={
        <p class="text-center text-sm text-ink-muted">
          <A href="/admin/login" class="text-link">Sign in</A>
        </p>
      }
    >
      <Show when={!token()}>
        <p class="siam-alert-error" role="alert">
          This reset link is invalid. Request a new one from the forgot password page.
        </p>
      </Show>
      <Show when={token()}>
        <form class="mt-6 space-y-4" action={resetPasswordAction} method="post">
          <input type="hidden" name="token" value={token()} />
          <FormField label="New password" name="password" error={fieldErrors().password}>
            <div class="relative">
              <FormTextInput
                type={showPassword() ? "text" : "password"}
                name="password"
                autocomplete="new-password"
                value={password()}
                maxLength={ADMIN_PASSWORD_MAX}
                onInput={(e) => setPassword(e.currentTarget.value)}
                error={fieldErrors().password}
                class="pr-11"
                describedByExtra={passwordRequirementsDescribedBy(
                  "password",
                  passwordChecklistVisible(),
                )}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <PasswordVisibilityToggle
                visible={showPassword()}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>
            <PasswordRequirementsChecklist
              name="password"
              password={password()}
              visible={passwordChecklistVisible()}
              showErrors={Boolean(fieldErrors().password)}
            />
          </FormField>
          <FormErrorAlert message={formMessage()} />
          <button
            type="submit"
            class="siam-btn-primary w-full"
            disabled={submission.pending}
          >
            {submission.pending ? "Updating…" : "Update password"}
          </button>
        </form>
      </Show>
    </AdminAuthLayout>
  );
}

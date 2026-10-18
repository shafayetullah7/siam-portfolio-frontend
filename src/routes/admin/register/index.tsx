import { A, useNavigate, useSubmission } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import EmptyState from "~/components/EmptyState";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PasswordRequirementsChecklist, {
  passwordRequirementsDescribedBy,
} from "~/components/forms/PasswordRequirementsChecklist";
import PasswordVisibilityToggle from "~/components/forms/PasswordVisibilityToggle";
import { ADMIN_PASSWORD_MAX } from "~/lib/auth/adminPasswordPolicy";
import { registerAction } from "~/lib/forms/actions/admin-register.actions";
import type { RegisterActionResult } from "~/lib/forms/types";

export default function AdminRegister() {
  const navigate = useNavigate();
  const submission = useSubmission(registerAction);
  const [registrationClosed, setRegistrationClosed] = createSignal(false);
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [passwordFocused, setPasswordFocused] = createSignal(false);

  const passwordChecklistVisible = () =>
    passwordFocused() || password().length > 0;

  onMount(async () => {
    try {
      const status = await adminAuthApi.registrationStatus();
      if (!status.registrationEnabled) setRegistrationClosed(true);
    } catch {
      setRegistrationClosed(true);
    }
  });

  const fieldErrors = () => {
    const r = submission.result as RegisterActionResult | undefined;
    if (r && !r.ok && r.fieldErrors) return r.fieldErrors;
    return {};
  };

  const formMessage = () => {
    const r = submission.result as RegisterActionResult | undefined;
    if (r && !r.ok) return r.formMessage;
    if (submission.error) return submission.error.message;
    return null;
  };

  createEffect(() => {
    const r = submission.result as RegisterActionResult | undefined;
    if (r?.ok) {
      navigate("/admin/register/verify", { replace: true });
    }
  });

  return (
    <>
      <Title>Register — SIAM Admin</Title>
      <AdminAuthLayout
        title="Create admin account"
        description="Registration sends a 6-digit code to the site owner email for verification."
        footer={
          <A href="/admin/login" class="text-link no-underline">Sign in instead</A>
        }
      >
        <Show
          when={!registrationClosed()}
          fallback={
            <div class="mt-6">
              <EmptyState
                title="Registration is disabled"
                description="Contact a site administrator if you need access."
              >
                <A href="/admin/login" class="siam-btn-secondary no-underline">
                  Back to sign in
                </A>
              </EmptyState>
            </div>
          }
        >
        <form
          class="mt-6 space-y-4"
          action={registerAction}
          method="post"
        >
          <FormField label="First name" name="firstName" error={fieldErrors().firstName}>
            <FormTextInput
              name="firstName"
              autocomplete="given-name"
              error={fieldErrors().firstName}
            />
          </FormField>
          <FormField label="Last name" name="lastName" error={fieldErrors().lastName}>
            <FormTextInput
              name="lastName"
              autocomplete="family-name"
              error={fieldErrors().lastName}
            />
          </FormField>
          <FormField label="Username" name="userName" error={fieldErrors().userName}>
            <FormTextInput
              name="userName"
              autocomplete="username"
              error={fieldErrors().userName}
            />
          </FormField>
          <FormField label="Email" name="email" error={fieldErrors().email}>
            <FormTextInput
              type="email"
              name="email"
              autocomplete="email"
              error={fieldErrors().email}
            />
          </FormField>
          <FormField label="Password" name="password" error={fieldErrors().password}>
            <div class="relative">
              <FormTextInput
                type={showPassword() ? "text" : "password"}
                name="password"
                autocomplete="new-password"
                value={password()}
                maxLength={ADMIN_PASSWORD_MAX}
                error={fieldErrors().password}
                class="pr-11"
                describedByExtra={passwordRequirementsDescribedBy(
                  "password",
                  passwordChecklistVisible(),
                )}
                onInput={(e) => setPassword(e.currentTarget.value)}
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
            {submission.pending ? "Continuing…" : "Continue"}
          </button>
        </form>
        </Show>
      </AdminAuthLayout>
    </>
  );
}

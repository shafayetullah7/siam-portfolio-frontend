import { A, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PasswordVisibilityToggle from "~/components/forms/PasswordVisibilityToggle";
import { registerAction } from "~/lib/forms/actions/admin-register.actions";
import type { RegisterActionResult } from "~/lib/forms/types";

export default function AdminRegister() {
  const navigate = useNavigate();
  const submission = useSubmission(registerAction);
  const [registrationClosed, setRegistrationClosed] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);

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
    <AdminAuthLayout
      title="Create admin account"
      description="Registration sends a 6-digit code to the site owner email for verification."
      footer={
        <p class="text-center text-sm text-ink-muted">
          <A href="/admin/login" class="text-link">Sign in instead</A>
        </p>
      }
    >
      <Show
        when={!registrationClosed()}
        fallback={
          <p class="mt-4 siam-alert-error" role="status">
            Registration is disabled. Contact a site administrator if you need access.
          </p>
        }
      >
        <form
          class="mt-8 space-y-4"
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
                error={fieldErrors().password}
                class="pr-11"
              />
              <PasswordVisibilityToggle
                visible={showPassword()}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>
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
  );
}

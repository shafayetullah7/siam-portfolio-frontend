import { A, useNavigate, useSearchParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import AdminAuthStatusBanner from "~/components/admin/AdminAuthStatusBanner";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import PasswordVisibilityToggle from "~/components/forms/PasswordVisibilityToggle";
import { safeAdminReturnUrl } from "~/lib/auth/safeAdminReturnUrl";
import { useAdminAuth } from "~/lib/auth/useAdminAuth";
import { loginAction } from "~/lib/forms/actions/admin-login.actions";
import type { LoginActionResult } from "~/lib/forms/types";

export default function AdminLogin() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [searchParams] = useSearchParams();
  const submission = useSubmission(loginAction);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showRegisterLink, setShowRegisterLink] = createSignal(false);

  onMount(async () => {
    try {
      const status = await adminAuthApi.registrationStatus();
      setShowRegisterLink(status.registrationEnabled);
    } catch {
      setShowRegisterLink(false);
    }
  });

  const sessionExpired = () => searchParams.reason === "session_expired";
  const passwordReset = () => searchParams.message === "password_reset";

  const returnUrl = () => safeAdminReturnUrl(searchParams.returnUrl);

  const fieldErrors = () => {
    const r = submission.result as LoginActionResult | undefined;
    if (r && !r.ok && r.fieldErrors) return r.fieldErrors;
    return {};
  };

  const formMessage = () => {
    const r = submission.result as LoginActionResult | undefined;
    if (r && !r.ok) return r.formMessage;
    if (submission.error) return submission.error.message;
    return null;
  };

  createEffect(() => {
    const r = submission.result as LoginActionResult | undefined;
    if (r?.ok) {
      auth.setFromLogin(r.profile);
      navigate(returnUrl(), { replace: true });
    }
  });

  return (
    <AdminAuthLayout
      title="Admin sign in"
      footer={
        <p class="text-center text-sm text-ink-muted">
          <A href="/admin/forgot-password" class="text-link">Forgot password?</A>
          <Show when={showRegisterLink()}>
            {" · "}
            <A href="/admin/register" class="text-link">Register</A>
          </Show>
        </p>
      }
    >
      <Show when={sessionExpired()}>
        <AdminAuthStatusBanner>Your session expired. Sign in again.</AdminAuthStatusBanner>
      </Show>
      <Show when={passwordReset()}>
        <AdminAuthStatusBanner variant="success">
          Password updated. Sign in with your new password.
        </AdminAuthStatusBanner>
      </Show>
      <form
        class="mt-6 space-y-4"
        action={loginAction}
        method="post"
      >
        <FormField label="Email" name="email" error={fieldErrors().email}>
          <FormTextInput
            type="email"
            name="email"
            autocomplete="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            error={fieldErrors().email}
          />
        </FormField>
        <FormField label="Password" name="password" error={fieldErrors().password}>
          <div class="relative">
            <FormTextInput
              type={showPassword() ? "text" : "password"}
              name="password"
              autocomplete="current-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
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
          {submission.pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AdminAuthLayout>
  );
}

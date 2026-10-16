import { A, useNavigate, useSearchParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
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

  const sessionExpired = () => searchParams.reason === "session_expired";

  const returnUrl = () => {
    const raw = searchParams.returnUrl;
    if (typeof raw !== "string" || !raw.startsWith("/admin")) return "/admin";
    return raw;
  };

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
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Admin sign in</h1>
      <Show when={sessionExpired()}>
        <p
          class="mt-4 rounded-md border border-border bg-surface-muted px-4 py-3 text-sm text-ink-muted"
          role="status"
        >
          Your session expired. Sign in again.
        </p>
      </Show>
      <form
        class="mt-8 space-y-4"
        action={loginAction}
        method="post"
      >
        <FormField label="Email" name="email" error={fieldErrors().email}>
          <FormTextInput
            type="email"
            name="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            error={fieldErrors().email}
          />
        </FormField>
        <FormField label="Password" name="password" error={fieldErrors().password}>
          <FormTextInput
            type="password"
            name="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            error={fieldErrors().password}
          />
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
      <p class="mt-6 text-center text-sm text-ink-muted">
        <A href="/admin/forgot-password" class="text-link">Forgot password?</A>
        {" · "}
        <A href="/admin/register" class="text-link">Register</A>
      </p>
    </main>
  );
}

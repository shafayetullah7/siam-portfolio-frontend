import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminForgotPasswordSchema } from "~/lib/forms/schemas/admin-forgot-password.schema";

const GENERIC_SUCCESS =
  "If an account exists for that email, you will receive reset instructions shortly.";

export default function AdminForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [sent, setSent] = createSignal(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSent(false);
    const parsed = adminForgotPasswordSchema.safeParse({ email: email() });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Check the fields below.");
      return;
    }
    try {
      await adminAuthApi.forgotPassword(parsed.data);
      setSent(true);
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

  return (
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Forgot password</h1>
      <Show when={sent()} fallback={
        <form class="mt-8 space-y-4" onSubmit={onSubmit}>
          <label class="block text-sm font-medium">
            Email
            <input
              type="email"
              class="siam-input mt-1"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              aria-invalid={fieldErrors().email ? true : undefined}
            />
            <Show when={fieldErrors().email}>
              <p class="mt-1 text-sm text-error">{fieldErrors().email}</p>
            </Show>
          </label>
          {error() && <p class="siam-alert-error" role="alert">{error()}</p>}
          <button type="submit" class="siam-btn-primary w-full">Send reset link</button>
        </form>
      }>
        <p class="mt-6 text-sm text-ink-muted" role="status">{GENERIC_SUCCESS}</p>
      </Show>
      <p class="mt-6 text-center text-sm">
        <A href="/admin/login" class="text-link">Back to sign in</A>
      </p>
    </main>
  );
}

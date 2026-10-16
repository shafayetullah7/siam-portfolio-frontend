import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminResetPasswordSchema } from "~/lib/forms/schemas/admin-reset-password.schema";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [done, setDone] = createSignal(false);

  const token = () => {
    const t = searchParams.token;
    return typeof t === "string" ? t : "";
  };

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const parsed = adminResetPasswordSchema.safeParse({
      token: token(),
      password: password(),
    });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Check the fields below.");
      return;
    }
    try {
      await adminAuthApi.resetPassword(parsed.data);
      setDone(true);
      setTimeout(() => navigate("/admin/login", { replace: true }), 2000);
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

  return (
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Reset password</h1>
      <Show when={!token() && !done()}>
        <p class="siam-alert-error mt-4" role="alert">
          This reset link is invalid. Request a new one from the forgot password page.
        </p>
      </Show>
      <Show when={done()}>
        <p class="mt-4 text-sm text-ink-muted" role="status">
          Password updated. Redirecting to sign in…
        </p>
      </Show>
      <Show when={token() && !done()}>
        <form class="mt-8 space-y-4" onSubmit={onSubmit}>
          <label class="block text-sm font-medium">
            New password
            <input
              type="password"
              class="siam-input mt-1"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              aria-invalid={fieldErrors().password ? true : undefined}
            />
            <Show when={fieldErrors().password}>
              <p class="mt-1 text-sm text-error">{fieldErrors().password}</p>
            </Show>
          </label>
          {error() && <p class="siam-alert-error" role="alert">{error()}</p>}
          <button type="submit" class="siam-btn-primary w-full">Update password</button>
        </form>
      </Show>
      <p class="mt-6 text-center text-sm">
        <A href="/admin/login" class="text-link">Sign in</A>
      </p>
    </main>
  );
}

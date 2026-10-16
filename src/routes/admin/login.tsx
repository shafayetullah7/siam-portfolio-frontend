import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { useAdminAuth } from "~/lib/auth/useAdminAuth";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminLoginSchema } from "~/lib/forms/schemas/admin-login.schema";

export default function AdminLogin() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  const sessionExpired = () => searchParams.reason === "session_expired";

  const returnUrl = () => {
    const raw = searchParams.returnUrl;
    if (typeof raw !== "string" || !raw.startsWith("/admin")) return "/admin";
    return raw;
  };

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const parsed = adminLoginSchema.safeParse({
      email: email(),
      password: password(),
    });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Check the fields below.");
      return;
    }
    try {
      const profile = await adminAuthApi.login(parsed.data);
      auth.setFromLogin(profile);
      navigate(returnUrl(), { replace: true });
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

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
        <label class="block text-sm font-medium">
          Password
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
        <button type="submit" class="siam-btn-primary w-full">Sign in</button>
      </form>
      <p class="mt-6 text-center text-sm text-ink-muted">
        <A href="/admin/forgot-password" class="text-link">Forgot password?</A>
        {" · "}
        <A href="/admin/register" class="text-link">Register</A>
      </p>
    </main>
  );
}

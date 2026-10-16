import { A } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import type { AdminRegistrationStatus } from "~/lib/api/types/admin.types";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { useAdminAuth } from "~/lib/auth/useAdminAuth";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminVerifyOtpSchema } from "~/lib/forms/schemas/admin-verify-otp.schema";

export default function AdminRegisterVerify() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [otp, setOtp] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [status, setStatus] = createSignal<AdminRegistrationStatus | null>(null);

  onMount(async () => {
    try {
      setStatus(await adminAuthApi.registrationStatus());
    } catch {
      setStatus({ hasPending: false });
    }
  });

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const parsed = adminVerifyOtpSchema.safeParse({ otp: otp() });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Enter the 6-digit code.");
      return;
    }
    try {
      const profile = await adminAuthApi.verifyRegistration(parsed.data);
      auth.setFromLogin(profile);
      navigate("/admin", { replace: true });
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

  return (
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Verify registration</h1>
      <Show when={status()?.hasPending === false}>
        <p class="mt-4 text-sm text-ink-muted">
          No pending registration.{" "}
          <A href="/admin/register" class="text-link">Start again</A>
        </p>
      </Show>
      <Show when={status()?.locked}>
        <p class="siam-alert-error mt-4" role="alert">
          Too many attempts. Contact the site owner or start registration again later.
        </p>
      </Show>
      <Show when={status()?.otpExpiresAt}>
        <p class="mt-2 text-xs text-ink-subtle">
          Code expires {new Date(status()!.otpExpiresAt!).toLocaleString()}
        </p>
      </Show>
      <form class="mt-8 space-y-4" onSubmit={onSubmit}>
        <label class="block text-sm font-medium">
          6-digit code
          <input
            type="text"
            inputMode="numeric"
            autocomplete="one-time-code"
            class="siam-input mt-1"
            maxLength={6}
            value={otp()}
            onInput={(e) => setOtp(e.currentTarget.value.replace(/\D/g, ""))}
            aria-invalid={fieldErrors().otp ? true : undefined}
          />
          <Show when={fieldErrors().otp}>
            <p class="mt-1 text-sm text-error">{fieldErrors().otp}</p>
          </Show>
        </label>
        {error() && <p class="siam-alert-error" role="alert">{error()}</p>}
        <button
          type="submit"
          class="siam-btn-primary w-full"
          disabled={status()?.locked === true}
        >
          Verify and sign in
        </button>
      </form>
      <p class="mt-4 text-xs text-ink-muted">
        Resend is not available yet; contact the site owner if the code expired.
      </p>
      <p class="mt-4 text-center text-sm">
        <A href="/admin/login" class="text-link">Back to sign in</A>
      </p>
    </main>
  );
}

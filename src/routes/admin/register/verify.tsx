import { A, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import type { AdminRegistrationStatus } from "~/lib/api/types/admin.types";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import { verifyRegistrationAction } from "~/lib/forms/actions/admin-verify.actions";
import type { VerifyRegistrationActionResult } from "~/lib/forms/types";
import { useAdminAuth } from "~/lib/auth/useAdminAuth";

function secondsUntil(iso: string | undefined): number {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000));
}

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function AdminRegisterVerify() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const submission = useSubmission(verifyRegistrationAction);
  const [status, setStatus] = createSignal<AdminRegistrationStatus | null>(null);
  const [resendError, setResendError] = createSignal<string | null>(null);
  const [resendPending, setResendPending] = createSignal(false);
  const [resendCooldownSec, setResendCooldownSec] = createSignal(0);
  const [otpExpirySec, setOtpExpirySec] = createSignal(0);

  async function loadStatus() {
    try {
      const s = await adminAuthApi.registrationStatus();
      setStatus(s);
      setResendCooldownSec(secondsUntil(s.nextResendAt));
      setOtpExpirySec(secondsUntil(s.otpExpiresAt));
    } catch {
      setStatus({ registrationEnabled: false, hasPending: false });
    }
  }

  onMount(() => {
    void loadStatus();
    const tick = setInterval(() => {
      const s = status();
      if (s?.otpExpiresAt) {
        setOtpExpirySec(secondsUntil(s.otpExpiresAt));
      }
      if (s?.nextResendAt) {
        setResendCooldownSec(secondsUntil(s.nextResendAt));
      } else if (resendCooldownSec() > 0) {
        setResendCooldownSec((n) => Math.max(0, n - 1));
      }
    }, 1000);
    return () => clearInterval(tick);
  });

  const fieldErrors = () => {
    const r = submission.result as VerifyRegistrationActionResult | undefined;
    if (r && !r.ok && r.fieldErrors) return r.fieldErrors;
    return {};
  };

  const formMessage = () => {
    const r = submission.result as VerifyRegistrationActionResult | undefined;
    if (r && !r.ok) return r.formMessage;
    if (submission.error) return submission.error.message;
    return null;
  };

  createEffect(() => {
    const r = submission.result as VerifyRegistrationActionResult | undefined;
    if (r?.ok) {
      auth.setFromLogin(r.profile);
      navigate("/admin", { replace: true });
    }
  });

  async function onResend() {
    setResendError(null);
    setResendPending(true);
    try {
      const result = await adminAuthApi.resendRegistrationOtp();
      await loadStatus();
      setStatus((prev) =>
        prev
          ? { ...prev, otpExpiresAt: result.otpExpiresAt, hasPending: true }
          : prev,
      );
    } catch (err) {
      setResendError(getAuthFormErrorMessage(err).formMessage);
      await loadStatus();
    } finally {
      setResendPending(false);
    }
  }

  const canVerify = () =>
    status()?.hasPending === true && status()?.locked !== true;

  const canResend = () =>
    canVerify() &&
    resendCooldownSec() === 0 &&
    !resendPending() &&
    otpExpirySec() > 0;

  return (
    <AdminAuthLayout
      title="Verify registration"
      description="Enter the 6-digit code sent to the site owner email."
      footer={
        <p class="text-center text-sm text-ink-muted">
          <A href="/admin/login" class="text-link">Back to sign in</A>
        </p>
      }
    >
      <Show when={status()?.hasPending === false}>
        <p class="mt-4 text-sm text-ink-muted" role="status">
          No pending registration.{" "}
          <A href="/admin/register" class="text-link">Start again</A>
        </p>
      </Show>
      <Show when={status()?.locked}>
        <p class="siam-alert-error mt-4" role="alert">
          Too many attempts. Contact the site owner or start registration again later.
        </p>
      </Show>
      <Show when={status()?.otpExpiresAt && canVerify()}>
        <p class="mt-2 text-xs text-ink-muted" role="status">
          {otpExpirySec() > 0
            ? `Code expires in ${formatCountdown(otpExpirySec())}`
            : "Code expired — register again or resend if still allowed."}
        </p>
        <p class="mt-1 text-xs text-ink-subtle">
          Expires {new Date(status()!.otpExpiresAt!).toLocaleString()}
        </p>
      </Show>
      <Show when={canVerify()}>
        <form
          class="mt-8 space-y-4"
          action={verifyRegistrationAction}
          method="post"
        >
          <FormField label="6-digit code" name="otp" error={fieldErrors().otp}>
            <FormTextInput
              name="otp"
              inputMode="numeric"
              autocomplete="one-time-code"
              maxLength={6}
              error={fieldErrors().otp}
            />
          </FormField>
          <FormErrorAlert message={formMessage()} />
          <button
            type="submit"
            class="siam-btn-primary w-full"
            disabled={submission.pending || otpExpirySec() === 0}
          >
            {submission.pending ? "Verifying…" : "Verify and sign in"}
          </button>
        </form>
        <div class="mt-4">
          <button
            type="button"
            class="siam-btn-secondary w-full"
            disabled={!canResend()}
            onClick={() => void onResend()}
          >
            {resendPending()
              ? "Sending…"
              : resendCooldownSec() > 0
                ? `Resend code in ${resendCooldownSec()}s`
                : "Resend code"}
          </button>
          {resendError() && (
            <p class="siam-alert-error mt-2" role="alert">{resendError()}</p>
          )}
        </div>
      </Show>
    </AdminAuthLayout>
  );
}

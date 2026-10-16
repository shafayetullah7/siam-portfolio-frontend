import { A, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import AdminAuthLayout from "~/components/admin/AdminAuthLayout";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import { forgotPasswordAction } from "~/lib/forms/actions/admin-forgot-password.actions";
import type { ForgotPasswordActionResult } from "~/lib/forms/types";

export default function AdminForgotPassword() {
  const submission = useSubmission(forgotPasswordAction);
  const [email, setEmail] = createSignal("");

  const result = () => submission.result as ForgotPasswordActionResult | undefined;

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

  const successMessage = () => {
    const r = result();
    if (r?.ok) return r.message;
    return null;
  };

  return (
    <AdminAuthLayout
      title="Forgot password"
      footer={
        <p class="text-center text-sm text-ink-muted">
          <A href="/admin/login" class="text-link">Back to sign in</A>
        </p>
      }
    >
      <Show
        when={successMessage()}
        fallback={
          <form class="mt-6 space-y-4" action={forgotPasswordAction} method="post">
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
            <FormErrorAlert message={formMessage()} />
            <button
              type="submit"
              class="siam-btn-primary w-full"
              disabled={submission.pending}
            >
              {submission.pending ? "Sending…" : "Send reset link"}
            </button>
          </form>
        }
      >
        <p class="siam-alert-success mt-6" role="status">{successMessage()}</p>
      </Show>
    </AdminAuthLayout>
  );
}

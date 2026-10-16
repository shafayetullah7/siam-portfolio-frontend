import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import { mapZodErrors } from "~/lib/forms/mapZodErrors";
import { adminRegisterSchema } from "~/lib/forms/schemas/admin-register.schema";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [userName, setUserName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const parsed = adminRegisterSchema.safeParse({
      firstName: firstName(),
      lastName: lastName(),
      userName: userName(),
      email: email(),
      password: password(),
    });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      setError("Check the fields below.");
      return;
    }
    try {
      await adminAuthApi.register(parsed.data);
      navigate("/admin/register/verify", { replace: true });
    } catch (err) {
      const mapped = getAuthFormErrorMessage(err);
      setError(mapped.formMessage);
      setFieldErrors(mapped.fieldErrors);
    }
  }

  const field = (name: string, label: string, value: () => string, set: (v: string) => void, type = "text") => (
    <label class="block text-sm font-medium">
      {label}
      <input
        type={type}
        class="siam-input mt-1"
        value={value()}
        onInput={(e) => set(e.currentTarget.value)}
        aria-invalid={fieldErrors()[name] ? true : undefined}
      />
      <Show when={fieldErrors()[name]}>
        <p class="mt-1 text-sm text-error">{fieldErrors()[name]}</p>
      </Show>
    </label>
  );

  return (
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Create admin account</h1>
      <p class="mt-2 text-sm text-ink-muted">
        Registration sends a 6-digit code to the site owner email for verification.
      </p>
      <form class="mt-8 space-y-4" onSubmit={onSubmit}>
        {field("firstName", "First name", firstName, setFirstName)}
        {field("lastName", "Last name", lastName, setLastName)}
        {field("userName", "Username", userName, setUserName)}
        {field("email", "Email", email, setEmail, "email")}
        {field("password", "Password", password, setPassword, "password")}
        {error() && <p class="siam-alert-error" role="alert">{error()}</p>}
        <button type="submit" class="siam-btn-primary w-full">Continue</button>
      </form>
      <p class="mt-6 text-center text-sm">
        <A href="/admin/login" class="text-link">Sign in instead</A>
      </p>
    </main>
  );
}

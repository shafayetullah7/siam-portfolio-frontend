import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { adminSession } from "~/lib/auth/adminSession";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    try {
      const profile = await adminAuthApi.login({
        email: email(),
        password: password(),
      });
      adminSession.setAdmin(profile);
      navigate("/admin", { replace: true });
    } catch {
      setError("Login failed. Check email and password.");
    }
  }

  return (
    <main id="main" class="mx-auto max-w-md py-16">
      <h1 class="text-2xl font-bold text-ink">Admin sign in</h1>
      <form class="mt-8 space-y-4" onSubmit={onSubmit}>
        <label class="block text-sm font-medium">
          Email
          <input
            type="email"
            class="siam-input mt-1"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
          />
        </label>
        <label class="block text-sm font-medium">
          Password
          <input
            type="password"
            class="siam-input mt-1"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </label>
        {error() && <p class="siam-alert-error">{error()}</p>}
        <button type="submit" class="siam-btn-primary w-full">Sign in</button>
      </form>
    </main>
  );
}

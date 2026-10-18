import { A } from "@solidjs/router";

/** Brand block above public admin auth cards. */
export default function AdminAuthWordmark() {
  return (
    <div class="mb-8 text-center">
      <p class="siam-eyebrow text-secondary">Owner access</p>
      <A
        href="/"
        class="mt-2 inline-block font-serif text-xl font-normal tracking-tight text-brand-deep no-underline hover:text-link"
      >
        SIAM
      </A>
      <p class="mt-1 text-sm text-ink-muted">Admin</p>
    </div>
  );
}

import { A } from "@solidjs/router";

export default function About() {
  return (
    <main id="main" class="siam-container py-12">
      <h1 class="text-h1 text-3xl font-bold tracking-tight sm:text-4xl">About</h1>
      <p class="siam-prose mt-4 text-ink-muted">
        Placeholder route — uses SIAM theme tokens from{" "}
        <code class="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-sm">docs/design-tokens.md</code>.
      </p>
      <p class="mt-6">
        <A href="/" class="text-link font-medium no-underline hover:underline">← Home</A>
      </p>
    </main>
  );
}

import { A } from "@solidjs/router";

/** Theme reference shell — replace with P01 Home in a later phase. */
export default function Home() {
  return (
    <main class="siam-container py-12 sm:py-16">
      <p class="siam-label mb-4">Theme preview</p>
      <h1 class="max-w-3xl text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
        A curious mind. A builder of{" "}
        <span class="text-primary">thoughtful AI.</span>
      </h1>
      <p class="siam-prose mt-6 text-ink-muted">
        Organic Tech palette: warm canvas, teal actions, peach and mint accents on cards below.
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <button type="button" class="siam-btn-primary">Primary action</button>
        <button type="button" class="siam-btn-secondary">Secondary</button>
        <A href="/about" class="siam-btn-secondary no-underline">About</A>
      </div>
      <div class="mt-14 grid gap-4 sm:grid-cols-3">
        <div class="overflow-hidden rounded-lg border border-border bg-surface">
          <div class="h-28 bg-accent-research" />
          <p class="p-4 text-sm font-semibold text-ink">Research accent</p>
        </div>
        <div class="overflow-hidden rounded-lg border border-border bg-surface">
          <div class="h-28 bg-accent-project" />
          <p class="p-4 text-sm font-semibold text-accent-project-ink">Project accent</p>
        </div>
        <div class="overflow-hidden rounded-lg border border-border bg-surface">
          <div class="h-28 bg-accent-writing" />
          <p class="p-4 text-sm font-semibold text-accent-writing-ink">Writing accent</p>
        </div>
      </div>
    </main>
  );
}

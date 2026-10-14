import { A } from "@solidjs/router";
import { ArrowExternal, ChevronRight } from "~/icons";

/** Phase 1 reference compositions — not P01. Hidden from primary nav. */
export default function DesignPreview() {
  return (
    <main id="main" class="siam-container py-12 sm:py-16">
      <p class="siam-label mb-4">Design preview</p>
      <h1 class="max-w-3xl text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
        Reference compositions for researcher sign-off
      </h1>

      <section class="mt-14" aria-labelledby="hero-heading">
        <h2 id="hero-heading" class="text-xl font-semibold text-ink">
          Home hero
        </h2>
        <p class="siam-prose mt-4 text-ink-muted">
          Editorial headline with visible primary and secondary actions (no hover-only labels).
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="siam-btn-primary">View research</button>
          <button type="button" class="siam-btn-secondary">Contact</button>
        </div>
      </section>

      <section class="mt-14" aria-labelledby="pub-heading">
        <h2 id="pub-heading" class="text-xl font-semibold text-ink">
          Publication list row
        </h2>
        <article class="siam-pub-row mt-4">
          <div>
            <h3 class="text-base font-semibold text-ink">
              Example Paper Title for Theme Preview
            </h3>
            <p class="mt-1 text-sm text-ink-muted">
              A. Researcher, B. Collaborator — NeurIPS 2025
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="siam-chip">DOI</span>
            <a
              href="https://doi.org/10.0000/example"
              class="inline-flex items-center gap-1 text-sm font-medium text-link no-underline hover:underline"
            >
              Publisher
              <ArrowExternal class="size-4" />
            </a>
          </div>
        </article>
      </section>

      <section class="mt-14" aria-labelledby="article-heading">
        <h2 id="article-heading" class="text-xl font-semibold text-ink">
          Article paragraph
        </h2>
        <div class="siam-prose mt-4">
          <p>
            Long-form prose uses a narrow measure. Inline{" "}
            <a href="/about">internal links</a> and{" "}
            <a href="https://example.org" class="inline-flex items-center gap-0.5">
              external references
              <ArrowExternal class="size-3.5" />
            </a>{" "}
            stay readable on mobile.
          </p>
          <pre><code>const preview = "monospace code block";</code></pre>
          <blockquote class="siam-citation">
            Citation or pull quote pattern for insights pages.
          </blockquote>
        </div>
      </section>

      <section class="mt-14" aria-labelledby="ui-heading">
        <h2 id="ui-heading" class="text-xl font-semibold text-ink">
          Form &amp; feedback
        </h2>
        <div class="mt-4 grid max-w-md gap-3">
          <label class="block text-sm font-medium text-ink">
            Email
            <input type="email" class="siam-input mt-1" placeholder="you@university.edu" />
          </label>
          <p class="siam-alert-success" role="status">Saved draft successfully.</p>
          <p class="siam-alert-error" role="alert">Please fix validation errors.</p>
        </div>
      </section>

      <p class="mt-10">
        <A href="/" class="inline-flex items-center gap-1 text-link no-underline hover:underline">
          <ChevronRight class="size-4 rotate-180" />
          Back to home
        </A>
      </p>
    </main>
  );
}

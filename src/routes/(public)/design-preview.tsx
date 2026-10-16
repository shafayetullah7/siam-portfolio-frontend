import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import { ArrowExternal, ChevronRight } from "~/icons";

/** Phase 1 reference compositions — not P01. DEV only; not linked from prod home. */
export default function DesignPreview() {
  return (
    <Show
      when={import.meta.env.DEV}
      fallback={
        <div class={PUBLIC_PAGE_WIDE}>
          <h1 class="text-xl font-semibold text-ink">Not available</h1>
          <p class="mt-2 text-ink-muted">This preview is for local development only.</p>
          <A href="/" class="mt-6 inline-block text-link no-underline">Home</A>
        </div>
      }
    >
      <DesignPreviewContent />
    </Show>
  );
}

function DesignPreviewContent() {
  return (
    <div class={PUBLIC_PAGE_WIDE}>
      <p class="siam-eyebrow mb-4">Academic Atelier</p>
      <h1 class="siam-display-hero max-w-3xl">
        Reference compositions for researcher sign-off
      </h1>

      <section class="mt-14" aria-labelledby="type-heading">
        <h2 id="type-heading" class="siam-headline-md">
          Typography
        </h2>
        <p class="mt-4 text-body-lg text-ink-muted">
          Newsreader display and headlines; Jakarta body; JetBrains eyebrows and pills.
        </p>
        <div class="mt-6 space-y-4 border-t border-border-hairline pt-6">
          <p class="siam-eyebrow">Researcher &amp; builder of thoughtful AI</p>
          <p class="siam-display-hero">Dr. Example Name</p>
          <p class="siam-headline-lg">Selected publications</p>
          <p class="text-body-lg text-ink-muted">
            Body large — reliable learning under real-world constraints.
          </p>
          <span class="siam-pill">NeurIPS &apos;25</span>
        </div>
      </section>

      <section class="mt-14" aria-labelledby="hero-heading">
        <h2 id="hero-heading" class="siam-headline-md">
          Actions
        </h2>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="siam-btn-primary">View research</button>
          <button type="button" class="siam-btn-secondary">Contact</button>
        </div>
      </section>

      <section class="mt-14" aria-labelledby="card-heading">
        <h2 id="card-heading" class="siam-headline-md">
          Card elevation
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div class="siam-card p-6">
            <p class="siam-eyebrow mb-2">Level 1</p>
            <p class="font-serif text-lg text-ink">Hairline border, parchment surface</p>
          </div>
          <div class="siam-card-accent-top siam-card-interactive p-6">
            <p class="siam-eyebrow mb-2">Accent top</p>
            <p class="text-sm text-ink-muted">2px forest bar — hero shell pattern</p>
          </div>
        </div>
        <div class="mt-6 rounded-lg bg-surface-emblem p-8">
          <p class="siam-eyebrow text-center text-ink-subtle">Research emblem plate</p>
        </div>
      </section>

      <section class="mt-14" aria-labelledby="pub-heading">
        <h2 id="pub-heading" class="siam-headline-md">
          Publication list row
        </h2>
        <article class="siam-pub-row mt-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <span class="siam-pill shrink-0">ICML &apos;25</span>
            <div>
              <h3 class="font-serif text-lg font-medium text-ink">
                Example Paper Title for Theme Preview
              </h3>
              <p class="mt-1 text-sm text-ink-muted">
                <span class="font-semibold text-ink">A. Researcher</span>, B. Collaborator
              </p>
              <p class="mt-2 text-sm text-ink-muted">
                One-line significance statement for the portfolio row.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="siam-chip">DOI</span>
            <a
              href="https://doi.org/10.0000/example"
              class="inline-flex items-center gap-1 text-sm font-medium text-link no-underline hover:underline"
            >
              PDF
              <ArrowExternal class="size-4" />
            </a>
          </div>
        </article>
      </section>

      <section class="mt-14" aria-labelledby="article-heading">
        <h2 id="article-heading" class="siam-headline-md">
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
        <h2 id="ui-heading" class="siam-headline-md">
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
    </div>
  );
}

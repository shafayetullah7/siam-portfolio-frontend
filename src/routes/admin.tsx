import type { RouteSectionProps } from "@solidjs/router";

/** Admin layout — auth guard in Phase 5. */
export default function AdminLayout(props: RouteSectionProps) {
  return (
    <div class="min-h-screen bg-surface-muted">
      <header class="border-b border-border bg-surface">
        <div class="siam-container flex h-14 items-center justify-between">
          <a href="/admin" class="font-semibold text-ink no-underline">
            SIAM Admin
          </a>
          <a href="/" class="text-sm text-link no-underline hover:underline">
            Public site
          </a>
        </div>
      </header>
      <main id="main" class="siam-container py-8">
        {props.children}
      </main>
    </div>
  );
}

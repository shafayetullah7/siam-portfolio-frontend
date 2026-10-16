import { A } from "@solidjs/router";
import { Show } from "solid-js";

function ThrowOnRender() {
  throw new Error("Intentional error for ErrorBoundary test (dev only)");
}

/** DEV only — verifies root ErrorBoundary in app.tsx */
export default function ErrorBoundaryTest() {
  return (
    <Show
      when={import.meta.env.DEV}
      fallback={
        <main id="main" class="siam-container py-16">
          <p class="text-ink-muted">Not available.</p>
          <A href="/" class="text-link">Home</A>
        </main>
      }
    >
      <main id="main" class="siam-container py-8">
        <p class="text-sm text-ink-muted mb-4">Dev: ErrorBoundary test</p>
        <ThrowOnRender />
      </main>
    </Show>
  );
}

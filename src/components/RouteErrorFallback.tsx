import { A } from "@solidjs/router";
import { Show } from "solid-js";
import EmptyState from "~/components/EmptyState";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";

export type RouteErrorFallbackProps = {
  error: unknown;
  reset: () => void;
  title?: string;
  /** When inside layout main#main, omit duplicate main landmark */
  variant?: "embedded" | "standalone";
};

function shellClass(variant: "embedded" | "standalone") {
  return variant === "standalone"
    ? "siam-container py-16 sm:py-24"
    : "siam-container py-12 sm:py-16";
}

function NotFoundFallback(props: { variant: "embedded" | "standalone" }) {
  return (
    <div class={shellClass(props.variant)}>
      <EmptyState
        title="Page not found"
        description="The address may be wrong, or the page may have moved."
      >
        <div class="flex flex-wrap justify-center gap-3">
          <A href="/" class="siam-btn-primary no-underline">Home</A>
          <A href="/about" class="siam-btn-secondary no-underline">About</A>
        </div>
      </EmptyState>
    </div>
  );
}

export default function RouteErrorFallback(props: RouteErrorFallbackProps) {
  const variant = () => props.variant ?? "embedded";
  const isNotFound = () => isApiError(props.error) && props.error.status === 404;

  return (
    <Show when={!isNotFound()} fallback={<NotFoundFallback variant={variant()} />}>
      <div class={shellClass(variant())} role="alert">
        <p class="siam-label mb-2">Error</p>
        <h1 class="text-2xl font-bold text-ink">
          {props.title ?? "We could not load this page"}
        </h1>
        <p class="mt-3 max-w-lg text-ink-muted">
          {getApiErrorMessage(props.error)}
        </p>
        <Show when={import.meta.env.DEV && props.error instanceof Error}>
          <pre class="mt-4 max-w-full overflow-x-auto rounded border border-border bg-surface p-3 text-xs text-ink-subtle">
            {props.error instanceof Error ? props.error.stack : ""}
          </pre>
        </Show>
        <div class="mt-8 flex flex-wrap gap-3">
          <button type="button" class="siam-btn-primary" onClick={() => props.reset()}>
            Try again
          </button>
          <A href="/" class="siam-btn-secondary no-underline">Home</A>
        </div>
      </div>
    </Show>
  );
}

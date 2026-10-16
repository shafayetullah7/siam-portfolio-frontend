import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import EmptyState from "~/components/EmptyState";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";

export default function NotFound() {
  return (
    <div class={PUBLIC_PAGE_WIDE}>
      <Title>Page not found</Title>
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

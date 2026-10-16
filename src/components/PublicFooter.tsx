import { A } from "@solidjs/router";

export default function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer class="mt-auto border-t border-border bg-canvas">
      <div class="siam-container flex flex-col gap-3 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} SIAM portfolio</p>
        <nav aria-label="Footer">
          <ul class="flex flex-wrap gap-4">
            <li>
              <A href="/" class="text-link no-underline hover:text-link-hover">
                Home
              </A>
            </li>
            <li>
              <A href="/about" class="text-link no-underline hover:text-link-hover">
                About
              </A>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

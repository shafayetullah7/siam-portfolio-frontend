import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const linkClass = (path: string) => {
    const isActive = path === location.pathname;
    return [
      "text-sm font-medium transition-colors duration-200",
      isActive ? "text-link" : "text-ink-muted hover:text-ink",
    ].join(" ");
  };

  return (
    <header class="border-b border-border bg-canvas/95 backdrop-blur-sm">
      <div class="siam-container flex h-14 items-center justify-between gap-4">
        <a href="/" class="flex items-center gap-1.5 text-ink no-underline hover:text-ink">
          <span class="text-primary" aria-hidden="true">✳</span>
          <span class="font-semibold tracking-tight">siam.</span>
        </a>
        <nav aria-label="Primary">
          <ul class="flex items-center gap-6 sm:gap-8">
            <li>
              <a href="/" class={linkClass("/")}>Home</a>
            </li>
            <li>
              <a href="/about" class={linkClass("/about")}>About</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

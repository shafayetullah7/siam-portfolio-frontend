import { A, useLocation } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { filterPublicNav } from "~/lib/site/filterPublicNav";
import { usePublicSite } from "~/lib/site/PublicSiteProvider";

export default function Nav() {
  const location = useLocation();
  const { site } = usePublicSite();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const navItems = () => {
    const s = site();
    if (!s) return [];
    return filterPublicNav(s.nav, s.sitemapPaths);
  };

  const siteName = () => site()?.siteName ?? "SIAM";

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
        <A href="/" class="flex items-center gap-1.5 text-ink no-underline hover:text-ink">
          <span class="text-primary" aria-hidden="true">✳</span>
          <span class="font-semibold tracking-tight">{siteName()}</span>
        </A>

        <nav class="hidden sm:block" aria-label="Primary">
          <ul class="flex items-center gap-6 sm:gap-8">
            <For each={navItems()}>
              {(item) => (
                <li>
                  <A href={item.path} class={linkClass(item.path)}>
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>

        <button
          type="button"
          class="siam-btn-secondary px-3 py-1.5 text-sm sm:hidden"
          aria-expanded={menuOpen()}
          aria-controls="mobile-primary-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          Menu
        </button>
      </div>

      <Show when={menuOpen()}>
        <nav
          id="mobile-primary-nav"
          class="border-t border-border bg-canvas sm:hidden"
          aria-label="Primary"
        >
          <ul class="siam-container flex flex-col gap-1 py-3">
            <For each={navItems()}>
              {(item) => (
                <li>
                  <A
                    href={item.path}
                    class={`block py-2 ${linkClass(item.path)}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </header>
  );
}

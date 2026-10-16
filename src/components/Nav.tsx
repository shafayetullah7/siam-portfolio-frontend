import { A, useLocation } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { filterPublicNav } from "~/lib/site/filterPublicNav";
import { usePublicSite } from "~/lib/site/PublicSiteProvider";

const HOME_SECTION_LINKS = [
  { label: "Research", href: "/#research-focus" },
  { label: "Publications", href: "/#selected-publications" },
  { label: "Projects", href: "/#featured-projects" },
  { label: "Focus", href: "/#currently-working-on" },
] as const;

export default function Nav() {
  const location = useLocation();
  const { site } = usePublicSite();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const isHome = () => location.pathname === "/";

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
    <header
      class={
        isHome()
          ? "fixed top-0 left-0 z-50 w-full border-b border-border/50 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          : "border-b border-border bg-canvas/95 backdrop-blur-sm"
      }
    >
      <div
        class={
          isHome()
            ? "mx-auto flex h-20 max-w-[var(--siam-content-width-wide)] items-center justify-between gap-4 px-[var(--siam-gutter)] lg:px-[var(--siam-gutter-desktop)]"
            : "siam-container flex h-14 items-center justify-between gap-4"
        }
      >
        <A href="/" class="flex items-center gap-3 text-ink no-underline hover:text-ink">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-fixed"
            aria-hidden="true"
          >
            S
          </div>
          <div class="flex flex-col">
            <span class="siam-headline-md text-base leading-none font-medium text-brand-deep">
              {siteName()}
            </span>
            <span class="siam-eyebrow text-[10px] text-secondary">Research Lab</span>
          </div>
        </A>

        <Show
          when={isHome()}
          fallback={
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
          }
        >
          <nav class="hidden lg:flex items-center gap-1" aria-label="Primary">
            <For each={HOME_SECTION_LINKS}>
              {(item) => (
                <A
                  href={item.href}
                  class="rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                >
                  {item.label}
                </A>
              )}
            </For>
          </nav>
        </Show>

        <div class="flex items-center gap-2">
          <A
            href="/about#contact"
            class="hidden sm:inline-flex siam-btn-primary px-4 py-2 text-sm no-underline"
          >
            Contact
          </A>
          <button
            type="button"
            class="siam-btn-secondary px-3 py-1.5 text-sm lg:hidden"
            aria-expanded={menuOpen()}
            aria-controls="mobile-primary-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu
          </button>
        </div>
      </div>

      <Show when={menuOpen()}>
        <nav
          id="mobile-primary-nav"
          class="border-t border-border bg-canvas lg:hidden"
          aria-label="Primary"
        >
          <ul
            class={
              isHome()
                ? "mx-auto flex max-w-[var(--siam-content-width-wide)] flex-col gap-1 px-[var(--siam-gutter)] py-3"
                : "siam-container flex flex-col gap-1 py-3"
            }
          >
            <Show
              when={isHome()}
              fallback={
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
              }
            >
              <For each={HOME_SECTION_LINKS}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      class="block py-2 text-sm text-ink-muted no-underline hover:text-ink"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </A>
                  </li>
                )}
              </For>
            </Show>
          </ul>
        </nav>
      </Show>
    </header>
  );
}

import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import {
  buildPrimaryNavItems,
  isPrimaryNavActive,
  type PrimaryNavItem,
} from "~/lib/site/primaryNav";
import { usePublicSite } from "~/lib/site/PublicSiteProvider";

const CONTACT_HREF = "/contact";

export default function Nav() {
  const location = useLocation();
  const { site } = usePublicSite();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const navItems = () => buildPrimaryNavItems(site());
  const siteName = () => site()?.siteName ?? "SIAM";

  createEffect(() => {
    location.pathname;
    setMenuOpen(false);
  });

  createEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen() ? "hidden" : "";
    onCleanup(() => {
      document.body.style.overflow = "";
    });
  });

  const linkClass = (item: PrimaryNavItem, block = false) => {
    const active = isPrimaryNavActive(location.pathname, location.hash, item);
    return [
      block ? "block w-full text-center no-underline" : "",
      "rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <header
      class="fixed top-0 left-0 z-50 w-full border-b border-border/50 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
    >
      <div
        class="mx-auto flex h-20 max-w-[var(--siam-content-width-wide)] items-center justify-between gap-4 px-[var(--siam-gutter)] lg:px-[var(--siam-gutter-desktop)]"
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

        <nav class="hidden lg:flex items-center gap-1" aria-label="Primary">
          <ul class="flex items-center gap-1">
            <For each={navItems()}>
              {(item) => (
                <li>
                  <A href={item.href} class={linkClass(item)}>
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>

        <div class="flex items-center gap-2">
          <A
            href={CONTACT_HREF}
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
          aria-label="Menu"
        >
          <ul
            class="mx-auto flex max-w-[var(--siam-content-width-wide)] flex-col gap-1 px-[var(--siam-gutter)] py-3"
          >
            <For each={navItems()}>
              {(item) => (
                <li>
                  <A
                    href={item.href}
                    class={linkClass(item, true)}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </A>
                </li>
              )}
            </For>
            <li class="mt-2 border-t border-border pt-3">
              <A
                href={CONTACT_HREF}
                class="siam-btn-primary block w-full py-2.5 text-center text-sm no-underline"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </A>
            </li>
          </ul>
        </nav>
      </Show>
    </header>
  );
}

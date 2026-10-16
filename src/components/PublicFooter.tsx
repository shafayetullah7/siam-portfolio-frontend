import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { filterPublicNav } from "~/lib/site/filterPublicNav";
import { usePublicSite } from "~/lib/site/PublicSiteProvider";

export default function PublicFooter() {
  const { site } = usePublicSite();
  const year = new Date().getFullYear();

  const navItems = () => {
    const s = site();
    if (!s) return [];
    return filterPublicNav(s.nav, s.sitemapPaths);
  };

  const siteName = () => site()?.siteName ?? "SIAM";

  return (
    <footer class="mt-auto border-t border-border bg-canvas">
      <div class="siam-container flex flex-col gap-3 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>© {year} {siteName()}</p>
          <Show when={site()?.footerText}>
            <p class="mt-2 max-w-prose">{site()!.footerText}</p>
          </Show>
        </div>
        <nav aria-label="Footer">
          <ul class="flex flex-wrap gap-4">
            <For each={navItems()}>
              {(item) => (
                <li>
                  <A href={item.path} class="text-link no-underline hover:text-link-hover">
                    {item.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

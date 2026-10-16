import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { HomeProfileLink } from "~/content";
import { ChevronRight } from "~/icons";
import { buildFooterNavItems } from "~/lib/site/primaryNav";
import { usePublicSite } from "~/lib/site/PublicSiteProvider";

export type LandingHomeFooterProps = {
  profiles?: readonly HomeProfileLink[];
};

export default function LandingHomeFooter(props: LandingHomeFooterProps) {
  const { site } = usePublicSite();
  const year = new Date().getFullYear();
  const siteName = () => site()?.siteName ?? "S.I.A.M. Research Lab";
  const tagline = () =>
    site()?.footerText ??
    "Theoretical foundations & empirical alignment for humane machine intelligence.";
  const footerNav = () => buildFooterNavItems(site());

  return (
    <footer class="mt-16 w-full bg-surface-container-low" role="contentinfo">
      <div
        class="mx-auto flex max-w-[var(--siam-content-width-wide)] flex-col gap-8 px-[var(--siam-gutter)] py-12 lg:px-[var(--siam-gutter-desktop)]"
      >
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div class="flex flex-col">
            <span class="siam-headline-md font-medium tracking-tight text-brand-deep">
              {siteName()}
            </span>
            <span class="mt-1 text-sm text-on-surface-variant">{tagline()}</span>
          </div>
          <a
            href="#main"
            class="inline-flex items-center gap-1 self-start rounded-lg px-3 py-1 font-mono text-xs text-on-surface-variant no-underline transition-colors hover:bg-surface-container-high hover:text-ink md:self-auto"
          >
            <ChevronRight class="size-4 -rotate-90" aria-hidden="true" />
            Back to top
          </a>
        </div>
        <Show when={footerNav().length > 0}>
          <nav aria-label="Footer">
            <ul class="flex flex-wrap gap-x-4 gap-y-2">
              <For each={footerNav()}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      class="font-mono text-xs text-secondary no-underline transition-colors hover:text-primary"
                    >
                      {item.label}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </Show>
        <Show when={props.profiles && props.profiles.length > 0}>
          <div class="flex flex-wrap items-center gap-4">
            <For each={props.profiles}>
              {(profile) => (
                <a
                  href={profile.href}
                  class="font-mono text-xs text-secondary no-underline transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.label}
                </a>
              )}
            </For>
          </div>
        </Show>
        <div
          class="flex flex-col justify-between gap-2 border-t border-surface-container pt-6 sm:flex-row sm:items-center"
        >
          <span class="font-mono text-xs text-ink-subtle">
            © {year} {siteName()}. All rights reserved.
          </span>
          <span class="font-mono text-xs text-ink-subtle">
            Typeset in Newsreader &amp; Plus Jakarta Sans.
          </span>
        </div>
      </div>
    </footer>
  );
}

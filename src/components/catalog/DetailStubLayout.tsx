import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";

export type DetailStubLayoutProps = {
  title: string;
  /** Plain-text meta lines (rendered in layout for SSR/hydration safety). */
  metaLines?: readonly string[];
  metaFirstLineClass?: string;
  backHref: string;
  backLabel: string;
  children: JSX.Element;
  relatedLinks?: readonly { label: string; href: string }[];
  prevSlug?: string;
  nextSlug?: string;
  themeNavPrevLabel?: string;
  themeNavNextLabel?: string;
};

export default function DetailStubLayout(props: DetailStubLayoutProps) {
  const metaLines = () => [...(props.metaLines ?? [])];
  const firstLineClass = () => props.metaFirstLineClass ?? "";
  const showThemeNav = () => Boolean(props.prevSlug || props.nextSlug);
  const prevLabel = () => props.themeNavPrevLabel ?? "Previous theme";
  const nextLabel = () => props.themeNavNextLabel ?? "Next theme";

  return (
    <div class={PUBLIC_PAGE_WIDE}>
      <p class="mb-6">
        <A href={props.backHref} class="text-link text-sm font-medium no-underline hover:underline">
          ← {props.backLabel}
        </A>
      </p>
      <article>
        <h1 class="siam-headline-lg font-normal text-brand-deep">{props.title}</h1>
        <Show when={metaLines().length > 0}>
          <div class="mt-3 space-y-2 font-mono text-sm text-on-surface-variant">
            <For each={metaLines()}>
              {(line, index) => (
                <span
                  classList={{
                    block: index() > 0,
                    "text-sm":
                      index() > 0 && index() === metaLines().length - 1,
                    ...(index() === 0 && firstLineClass()
                      ? { [firstLineClass()]: true }
                      : {}),
                  }}
                >
                  {line}
                </span>
              )}
            </For>
          </div>
        </Show>
        <div class="siam-prose mt-8 max-w-3xl text-secondary">{props.children}</div>
      </article>
      <Show when={showThemeNav()}>
        <nav
          class="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between"
          aria-label="Theme navigation"
        >
          <Show
            when={props.prevSlug}
            fallback={<div class="hidden sm:block sm:flex-1" aria-hidden="true" />}
          >
            {(slug) => (
              <A
                href={`/research/${slug()}`}
                class="text-link text-sm font-medium no-underline hover:underline"
              >
                ← {prevLabel()}
              </A>
            )}
          </Show>
          <Show when={props.nextSlug}>
            {(slug) => (
              <A
                href={`/research/${slug()}`}
                class="text-link text-sm font-medium no-underline hover:underline sm:text-right"
              >
                {nextLabel()} →
              </A>
            )}
          </Show>
        </nav>
      </Show>
      <Show when={props.relatedLinks && props.relatedLinks.length > 0}>
        <nav class="mt-12 border-t border-border pt-8" aria-label="Related">
          <p class="siam-eyebrow mb-3 text-secondary">Explore</p>
          <ul class="flex flex-col gap-2">
            <For each={[...(props.relatedLinks ?? [])]}>
              {(link) => (
                <li>
                  <A href={link.href} class="text-link no-underline hover:underline">
                    {link.label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </div>
  );
}

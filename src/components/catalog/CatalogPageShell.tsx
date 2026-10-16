import { A } from "@solidjs/router";
import { For } from "solid-js";
import type { JSX } from "solid-js";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";

export type CatalogBreadcrumb = {
  label: string;
  href?: string;
};

export type CatalogPageShellProps = {
  title: string;
  intro?: string;
  breadcrumbs?: readonly CatalogBreadcrumb[];
  children: JSX.Element;
  wide?: boolean;
};

export default function CatalogPageShell(props: CatalogPageShellProps) {
  const containerClass = props.wide ? PUBLIC_PAGE_WIDE : "siam-container py-12";

  return (
    <div class={containerClass}>
      {props.breadcrumbs && props.breadcrumbs.length > 0 && (
        <nav class="mb-6 text-sm text-ink-muted" aria-label="Breadcrumb">
          <ol class="flex flex-wrap items-center gap-1">
            <For each={[...(props.breadcrumbs ?? [])]}>
              {(crumb, i) => (
                <li class="flex items-center gap-1">
                  {i() > 0 && <span aria-hidden="true">→</span>}
                  {crumb.href ? (
                    <A href={crumb.href} class="text-link no-underline hover:underline">
                      {crumb.label}
                    </A>
                  ) : (
                    <span class="text-ink">{crumb.label}</span>
                  )}
                </li>
              )}
            </For>
          </ol>
        </nav>
      )}
      <h1 class="siam-headline-lg font-normal text-brand-deep">{props.title}</h1>
      {props.intro && (
        <p class="siam-prose mt-4 max-w-3xl text-secondary">{props.intro}</p>
      )}
      <div class="mt-10">{props.children}</div>
    </div>
  );
}

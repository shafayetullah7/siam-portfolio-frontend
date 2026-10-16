import { A } from "@solidjs/router";
import { For } from "solid-js";
import type { JSX } from "solid-js";

export type DetailStubLayoutProps = {
  title: string;
  meta?: JSX.Element;
  backHref: string;
  backLabel: string;
  children: JSX.Element;
  relatedLinks?: readonly { label: string; href: string }[];
};

export default function DetailStubLayout(props: DetailStubLayoutProps) {
  return (
    <div class="siam-container py-12">
      <p class="mb-6">
        <A href={props.backHref} class="text-link text-sm font-medium no-underline hover:underline">
          ← {props.backLabel}
        </A>
      </p>
      <article>
        <h1 class="siam-headline-lg font-normal text-brand-deep">{props.title}</h1>
        {props.meta && (
          <div class="mt-3 font-mono text-sm text-on-surface-variant">{props.meta}</div>
        )}
        <div class="siam-prose mt-8 max-w-3xl text-secondary">{props.children}</div>
      </article>
      {props.relatedLinks && props.relatedLinks.length > 0 && (
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
      )}
    </div>
  );
}

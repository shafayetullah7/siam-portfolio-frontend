import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { JSX } from "solid-js";
import { ArrowExternal } from "~/icons";
import { isExternalHref } from "~/lib/url/isExternalHref";

export type LandingContentLinkProps = {
  href: string;
  class?: string;
  ariaLabel?: string;
  children: JSX.Element;
};

export default function LandingContentLink(props: LandingContentLinkProps) {
  const external = () => isExternalHref(props.href);

  return (
    <Show
      when={external()}
      fallback={
        <A href={props.href} class={props.class} aria-label={props.ariaLabel}>
          {props.children}
        </A>
      }
    >
      <a
        href={props.href}
        class={props.class}
        aria-label={props.ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
        <ArrowExternal class="inline size-4 shrink-0 align-text-bottom" aria-hidden="true" />
      </a>
    </Show>
  );
}

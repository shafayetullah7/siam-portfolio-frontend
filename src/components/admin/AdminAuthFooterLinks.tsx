import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

export type AdminAuthFooterLinksProps = {
  /** Page-specific links (sign in, register, forgot, etc.) */
  children?: JSX.Element;
};

/**
 * Standard footer for public admin auth routes.
 * Always includes a link back to the public site; pass contextual links as children.
 */
export default function AdminAuthFooterLinks(props: AdminAuthFooterLinksProps) {
  return (
    <div class="flex flex-col items-center gap-3 text-center text-sm text-ink-muted">
      <Show when={props.children}>
        <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {props.children}
        </div>
      </Show>
      <p>
        <A href="/" class="text-link no-underline">Public site</A>
      </p>
    </div>
  );
}

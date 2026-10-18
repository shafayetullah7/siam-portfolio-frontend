import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import type { AdminNavItem } from "./adminNav";
import { isAdminNavActive } from "./adminNav";

const navLinkClass =
  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant no-underline transition-colors hover:bg-secondary-container hover:text-on-secondary-container";

const soonBadgeClass =
  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-secondary-container text-on-surface-variant";

const soonRowClass =
  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted cursor-not-allowed";

export type AdminNavRowProps = {
  item: AdminNavItem;
  onNavigate?: () => void;
};

export default function AdminNavRow(props: AdminNavRowProps) {
  const location = useLocation();

  const active = () => isAdminNavActive(location.pathname, props.item);

  const linkClass = () =>
    [navLinkClass, active() ? "bg-secondary-container text-on-secondary-container" : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <Show
      when={props.item.status === "active"}
      fallback={
        <span
          class={soonRowClass}
          aria-disabled="true"
          tabIndex={-1}
          title="Available in a future release"
        >
          <span>{props.item.label}</span>
          <span class={soonBadgeClass}>Soon</span>
        </span>
      }
    >
      <A
        href={props.item.href}
        class={linkClass()}
        aria-current={active() ? "page" : undefined}
        onClick={() => props.onNavigate?.()}
      >
        <span>{props.item.label}</span>
      </A>
    </Show>
  );
}

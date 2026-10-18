import { A, useNavigate } from "@solidjs/router";
import { For, Index, Show } from "solid-js";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { useAdminAuth } from "~/lib/auth/AdminAuthProvider";
import AdminNavRow from "./AdminNavRow";
import { ADMIN_NAV_SECTIONS } from "./adminNav";

const footerLinkClass =
  "block rounded-lg px-3 py-2 text-sm text-on-surface-variant no-underline transition-colors hover:bg-secondary-container hover:text-on-secondary-container";

export type AdminSidebarProps = {
  onNavigate?: () => void;
};

export default function AdminSidebar(props: AdminSidebarProps) {
  const navigate = useNavigate();
  const auth = useAdminAuth();

  const label = () => {
    const a = auth.admin();
    if (!a) return "";
    return a.firstName?.trim() || a.userName;
  };

  async function logout() {
    try {
      await adminAuthApi.logout();
    } catch {
      /* session may already be dead */
    }
    auth.clear();
    navigate("/admin/login", { replace: true });
  }

  function afterNav() {
    props.onNavigate?.();
  }

  return (
    <div class="flex h-full min-h-0 flex-col">
      <div class="border-b border-border px-4 py-4">
        <A
          href="/admin"
          class="font-semibold text-brand-deep no-underline"
          onClick={afterNav}
        >
          SIAM Admin
        </A>
      </div>

      <nav
        class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4"
        aria-label="Admin"
      >
        <Index each={ADMIN_NAV_SECTIONS}>
          {(section, index) => {
            const headingId = `admin-nav-section-${section().id}`;
            return (
              <div
                classList={{
                  "mt-4 border-t border-border pt-4": index > 0,
                }}
              >
                <p
                  id={headingId}
                  class="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-ink-muted"
                >
                  {section().label}
                </p>
                <ul class="space-y-1" aria-labelledby={headingId}>
                  <For each={section().items}>
                    {(item) => (
                      <li>
                        <AdminNavRow item={item} onNavigate={afterNav} />
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            );
          }}
        </Index>
      </nav>

      <div class="border-t border-border px-3 py-4">
        <A href="/" class={footerLinkClass} onClick={afterNav}>
          Public site
        </A>
        <A
          href="/admin/change-password"
          class={`${footerLinkClass} mt-1`}
          onClick={afterNav}
        >
          Account
        </A>
        <Show when={label()}>
          <p class="mt-3 px-3 text-xs text-ink-muted">{label()}</p>
        </Show>
        <button type="button" class={`${footerLinkClass} mt-1 w-full text-left`} onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}

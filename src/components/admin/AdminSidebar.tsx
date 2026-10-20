import { A, useNavigate } from "@solidjs/router";
import { For, Index, Show } from "solid-js";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import { useAdminAuth } from "~/lib/auth/AdminAuthProvider";
import AdminNavRow from "./AdminNavRow";
import { ADMIN_NAV_SECTIONS } from "./adminNav";

const utilityLinkClass =
  "flex w-full items-center rounded-lg px-3 py-2 text-sm text-on-surface-variant no-underline transition-colors hover:bg-surface hover:text-on-surface";

const logoutButtonClass =
  "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error-surface";

export type AdminSidebarProps = {
  onNavigate?: () => void;
};

export default function AdminSidebar(props: AdminSidebarProps) {
  const navigate = useNavigate();
  const auth = useAdminAuth();

  const displayName = () => {
    const a = auth.admin();
    if (!a) return "";
    const first = a.firstName?.trim();
    const last = a.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return a.userName;
  };

  const initials = () => {
    const a = auth.admin();
    if (!a) return "?";
    const first = a.firstName?.trim();
    const last = a.lastName?.trim();
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    return a.userName.slice(0, 2).toUpperCase();
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

      <div
        class="shrink-0 border-t border-border bg-surface-container-low px-3 py-3"
        aria-label="Sidebar utilities"
      >
        <Show when={auth.admin()}>
          {(admin) => (
            <div
              class="mb-3 flex items-center gap-3 rounded-lg border border-border/70 bg-surface px-3 py-2.5 shadow-sm"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold tracking-tight text-primary"
                aria-hidden="true"
              >
                {initials()}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-ink">{displayName()}</p>
                <p class="truncate text-xs text-ink-muted">{admin().email}</p>
              </div>
            </div>
          )}
        </Show>

        <ul class="space-y-0.5">
          <li>
            <A href="/" class={utilityLinkClass} onClick={afterNav}>
              Public site
            </A>
          </li>
          <li>
            <A href="/admin/change-password" class={utilityLinkClass} onClick={afterNav}>
              Account
            </A>
          </li>
        </ul>

        <div class="mt-2 border-t border-border/80 pt-2">
          <button type="button" class={logoutButtonClass} onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

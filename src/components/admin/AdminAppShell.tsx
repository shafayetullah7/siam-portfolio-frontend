import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, Show, type JSX } from "solid-js";
import { Menu } from "~/icons";
import AdminSidebar from "./AdminSidebar";

export default function AdminAppShell(props: { children: JSX.Element }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  createEffect(() => {
    location.pathname;
    setDrawerOpen(false);
  });

  createEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen() ? "hidden" : "";
    onCleanup(() => {
      document.body.style.overflow = "";
    });
  });

  return (
    <div class="flex h-dvh w-full overflow-hidden bg-canvas">
      <aside
        class="hidden h-full min-h-0 w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-surface md:flex"
        aria-label="Admin sidebar"
      >
        <AdminSidebar />
      </aside>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          class="flex min-h-14 items-center gap-3 border-b border-border bg-surface px-4 md:hidden"
        >
          <button
            type="button"
            class="siam-btn-secondary inline-flex items-center justify-center p-2"
            aria-expanded={drawerOpen()}
            aria-controls="admin-mobile-drawer"
            aria-label={drawerOpen() ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <Menu class="size-5" />
          </button>
          <span class="font-semibold text-brand-deep">SIAM Admin</span>
        </div>

        <Show when={drawerOpen()}>
          <button
            type="button"
            class="fixed inset-0 z-40 bg-ink/30 md:hidden"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            id="admin-mobile-drawer"
            class="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-surface shadow-lg md:hidden"
          >
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </Show>

        <main
          id="main"
          class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain"
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}

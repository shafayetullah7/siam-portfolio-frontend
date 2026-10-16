import { onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import type { RouteSectionProps } from "@solidjs/router";
import { adminSession } from "~/lib/auth/adminSession";

/** Admin layout — auth guard (Phase 5). */
export default function AdminLayout(props: RouteSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = () => location.pathname === "/admin/login";

  onMount(() => {
    if (!isLogin()) {
      void adminSession.load().then(() => {
        if (!adminSession.admin() && !isLogin()) {
          navigate("/admin/login", { replace: true });
        }
      });
    }
  });

  return (
    <div class="min-h-screen bg-surface-muted">
      <header class="border-b border-border bg-surface">
        <div class="siam-container flex h-14 items-center justify-between">
          <a href="/admin" class="font-semibold text-ink no-underline">
            SIAM Admin
          </a>
          <nav class="flex gap-4 text-sm">
            <a href="/admin/pages" class="text-link no-underline">Pages</a>
            <a href="/" class="text-link no-underline">Public site</a>
          </nav>
        </div>
      </header>
      <Show when={isLogin()} fallback={
        <main id="main" class="siam-container py-8">{props.children}</main>
      }>
        {props.children}
      </Show>
    </div>
  );
}

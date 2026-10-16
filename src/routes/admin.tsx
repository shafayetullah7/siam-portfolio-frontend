import { createEffect, Show } from "solid-js";
import { useLocation, useNavigate, type RouteSectionProps } from "@solidjs/router";
import { A } from "@solidjs/router";
import PageLoading from "~/components/PageLoading";
import { AdminAuthProvider, useAdminAuth } from "~/lib/auth/AdminAuthProvider";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import {
  isPublicAdminAuthPath,
  isResetPasswordPath,
} from "~/lib/auth/publicAdminAuthPaths";

function AdminHeader() {
  const auth = useAdminAuth();
  const navigate = useNavigate();

  async function logout() {
    try {
      await adminAuthApi.logout();
    } catch {
      /* session may already be dead */
    }
    auth.clear();
    navigate("/admin/login", { replace: true });
  }

  const label = () => {
    const a = auth.admin();
    if (!a) return "";
    return a.firstName?.trim() || a.userName;
  };

  return (
    <header class="border-b border-border bg-surface">
      <div class="siam-container flex h-14 flex-wrap items-center justify-between gap-2">
        <a href="/admin" class="font-semibold text-ink no-underline">
          SIAM Admin
        </a>
        <nav class="flex flex-wrap items-center gap-4 text-sm">
          <A href="/admin/site" class="text-link no-underline">Site</A>
          <a href="/admin/pages" class="text-link no-underline">Pages</a>
          <A href="/admin/change-password" class="text-link no-underline">
            Password
          </A>
          <a href="/" class="text-link no-underline">Public site</a>
          <span class="text-ink-muted">{label()}</span>
          <button type="button" class="text-link text-sm" onClick={logout}>
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}

function AdminLayoutContent(props: RouteSectionProps) {
  const auth = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isPublicAuth = () => isPublicAdminAuthPath(location.pathname);

  createEffect(() => {
    const status = auth.status();
    if (status === "unknown") return;

    const path = location.pathname;
    const search = location.search;

    if (status === "anonymous" && !isPublicAdminAuthPath(path)) {
      const returnUrl = encodeURIComponent(path + search);
      navigate(`/admin/login?returnUrl=${returnUrl}`, { replace: true });
      return;
    }

    if (
      status === "authenticated" &&
      isPublicAdminAuthPath(path) &&
      !isResetPasswordPath(path)
    ) {
      navigate("/admin", { replace: true });
    }
  });

  const showLoading = () =>
    auth.status() === "unknown" ||
    (auth.status() === "anonymous" && !isPublicAuth());

  const showChrome = () => auth.status() === "authenticated";

  return (
    <div class="min-h-screen bg-surface-muted">
      <Show when={showLoading()} fallback={
        <>
          <Show when={showChrome()}>
            <AdminHeader />
          </Show>
          <main
            id="main"
            class={showChrome() ? "siam-container py-8" : undefined}
          >
            {props.children}
          </main>
        </>
      }>
        <PageLoading />
      </Show>
    </div>
  );
}

/** Admin layout — AdminAuthProvider + client guard (F5). */
export default function AdminLayout(props: RouteSectionProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent {...props} />
    </AdminAuthProvider>
  );
}

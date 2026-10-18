import { createEffect, Show } from "solid-js";
import { useLocation, useNavigate, type RouteSectionProps } from "@solidjs/router";
import AdminAppShell from "~/components/admin/AdminAppShell";
import AdminPageContainer from "~/components/admin/AdminPageContainer";
import AsyncRouteShell from "~/components/AsyncRouteShell";
import PageLoading from "~/components/PageLoading";
import { AdminAuthProvider, useAdminAuth } from "~/lib/auth/AdminAuthProvider";
import {
  isPublicAdminAuthPath,
  isResetPasswordPath,
} from "~/lib/auth/publicAdminAuthPaths";

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
  const centerMain = () => !showChrome();

  return (
    <div class="flex min-h-screen flex-col bg-canvas">
      <Show
        when={showChrome() && !showLoading()}
        fallback={
          <main
            id="main"
            classList={{
              "flex flex-1 flex-col justify-center": centerMain(),
            }}
          >
            <Show
              when={showLoading()}
              fallback={
                <AsyncRouteShell compactLoading>{props.children}</AsyncRouteShell>
              }
            >
              <div
                classList={{
                  "mx-auto w-full max-w-md": centerMain(),
                }}
              >
                <PageLoading compact />
              </div>
            </Show>
          </main>
        }
      >
        <AdminAppShell>
          <AsyncRouteShell compactLoading>
            <AdminPageContainer>{props.children}</AdminPageContainer>
          </AsyncRouteShell>
        </AdminAppShell>
      </Show>
    </div>
  );
}

/** @internal Exported for layout tests */
export { AdminLayoutContent };

/** Admin layout — AdminAuthProvider + client guard (F5). */
export default function AdminLayout(props: RouteSectionProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent {...props} />
    </AdminAuthProvider>
  );
}

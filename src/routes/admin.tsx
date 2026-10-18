// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore node builtin, server side only
import { appendFileSync } from "node:fs";
import {
  createAsync,
  useLocation,
  useNavigate,
  type RouteDefinition,
  type RouteSectionProps,
} from "@solidjs/router";
import { createEffect, sharedConfig, Show, Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import AdminAppShell from "~/components/admin/AdminAppShell";
import AdminLayoutSessionFallback from "~/components/admin/AdminLayoutSessionFallback";
import AdminPageContainer from "~/components/admin/AdminPageContainer";
import AsyncRouteShell from "~/components/AsyncRouteShell";
import PageLoading from "~/components/PageLoading";
import { getAdminSession } from "~/lib/api/queries/admin";
import { AdminAuthProvider, useAdminAuth } from "~/lib/auth/AdminAuthProvider";
import {
  isPublicAdminAuthPath,
  isResetPasswordPath,
} from "~/lib/auth/publicAdminAuthPaths";

export const route = {
  preload: () => getAdminSession(),
} satisfies RouteDefinition;

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
  const showCmsChrome = () => showChrome() && !showLoading();
  const cmsViewportLock = () => showCmsChrome();

  // #region agent log
  const _p1 = JSON.stringify({sessionId:'1e53c5',hypothesisId:'A,B,C',location:'admin.tsx:AdminLayoutContent',message:'layout content render',data:{isServer,ctxId:sharedConfig.context?.id ?? null,hydrating:!!sharedConfig.context,readyState:isServer?null:document.readyState,targetDivInDom:isServer?null:!!document.querySelector('[data-hk="00000000010000100000001000"]'),streamTemplateInDom:isServer?null:!!document.querySelector('template[id="000000000100001000000"]'),hyDone:isServer?null:!!(window as unknown as {_$HY?:{done?:boolean}})._$HY?.done,status:auth.status(),showCmsChrome:showCmsChrome(),path:location.pathname},timestamp:Date.now()});
  if (isServer) { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _p1 + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_p1}).catch(()=>{}); }
  // #endregion

  return (
    <div
      class="flex flex-col bg-canvas"
      classList={{
        "h-dvh overflow-hidden": cmsViewportLock(),
        "min-h-screen": !cmsViewportLock(),
      }}
    >
      <Show
        when={showCmsChrome()}
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

function AdminLayoutWithSession(props: RouteSectionProps) {
  const session = createAsync(() => getAdminSession());
  // #region agent log
  const _p2 = JSON.stringify({sessionId:'1e53c5',hypothesisId:'A,B',location:'admin.tsx:AdminLayoutWithSession',message:'session accessor at provider creation',data:{isServer,ctxId:sharedConfig.context?.id ?? null,hydrating:!!sharedConfig.context,session:(()=>{try{const s=session();return s===undefined?'undefined':s===null?'null':'profile';}catch(e){return 'threw:'+String((e as Error)?.message ?? e).slice(0,80);}})()},timestamp:Date.now()});
  if (isServer) { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _p2 + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_p2}).catch(()=>{}); }
  // #endregion
  return (
    <AdminAuthProvider initialAdmin={session()}>
      <AdminLayoutContent {...props} />
    </AdminAuthProvider>
  );
}

/** @internal Exported for layout tests */
export { AdminLayoutContent };

/** Admin layout — session preload + AdminAuthProvider + client guard (F5). */
export default function AdminLayout(props: RouteSectionProps) {
  // #region agent log
  const _p3 = JSON.stringify({sessionId:'1e53c5',hypothesisId:'C,D',location:'admin.tsx:AdminLayout',message:'admin layout render',data:{isServer,ctxId:sharedConfig.context?.id ?? null,hydrating:!!sharedConfig.context,readyState:isServer?null:document.readyState,placeholderInDom:isServer?null:!!document.getElementById('pl-000000000100001000000'),streamTemplateInDom:isServer?null:!!document.querySelector('template#\\30 00000000100001000000, template[id="000000000100001000000"]'),targetDivInDom:isServer?null:!!document.querySelector('[data-hk="00000000010000100000001000"]'),hyDone:isServer?null:!!(window as unknown as {_$HY?:{done?:boolean}})._$HY?.done},timestamp:Date.now()});
  if (isServer) { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _p3 + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_p3}).catch(()=>{}); }
  // #endregion
  return (
    <Suspense fallback={<AdminLayoutSessionFallback />}>
      <AdminLayoutWithSession {...props} />
    </Suspense>
  );
}
